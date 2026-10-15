import { css, html, svg, nothing } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import { clamp, fireMoreInfo, numState } from "../shared/helpers";
import { defineEditor } from "../shared/editor";
import type { HassEntity, LovelaceCardConfig } from "../shared/types";

interface EnergyEntities {
  /** Instant power used by the house (W or kW). */
  home?: string;
  /** Instant solar production (W or kW). */
  solar?: string;
  /** Instant grid power: positive = import, negative = export. */
  grid?: string;
  /** Instant battery power: positive = charging. */
  battery?: string;
  /** Battery state of charge (%). */
  battery_soc?: string;
  /** Energy used today (kWh or Wh). */
  consumption_today?: string;
  /** Solar energy produced today (kWh or Wh). */
  production_today?: string;
  /** Energy imported from the grid today (kWh or Wh), for self-sufficiency. */
  grid_import_today?: string;
}

export interface EnergyCardConfig extends LovelaceCardConfig {
  title?: string;
  room?: string;
  entities: EnergyEntities;
  invert_grid?: boolean;
  invert_battery?: boolean;
  /** Show today's consumption chart. Needs `entities.home`. Default true. */
  history?: boolean;
  compact?: boolean;
}

const sensor = (device_class: string) => ({ entity: { domain: "sensor", device_class } });

const getConfigElement = defineEditor("luxury-energy-card-editor", {
  schema: [
    { type: "grid", name: "", schema: [
      { name: "title", selector: { text: {} } },
      { name: "room", selector: { text: {} } },
    ] },
    {
      type: "expandable",
      name: "entities",
      title: "Sensori",
      schema: [
        { name: "home", selector: sensor("power") },
        { name: "solar", selector: sensor("power") },
        { name: "grid", selector: sensor("power") },
        { name: "battery", selector: sensor("power") },
        { name: "battery_soc", selector: sensor("battery") },
        { name: "consumption_today", selector: sensor("energy") },
        { name: "production_today", selector: sensor("energy") },
        { name: "grid_import_today", selector: sensor("energy") },
      ],
    },
    { type: "grid", name: "", schema: [
      { name: "invert_grid", selector: { boolean: {} } },
      { name: "invert_battery", selector: { boolean: {} } },
      { name: "history", selector: { boolean: {} } },
      { name: "compact", selector: { boolean: {} } },
    ] },
  ],
  labels: {
    title: "Titolo",
    home: "Consumo casa (potenza)",
    solar: "Produzione solare (potenza)",
    grid: "Rete (potenza, + prelievo)",
    battery: "Batteria (potenza, + in carica)",
    battery_soc: "Batteria (%)",
    consumption_today: "Energia consumata oggi",
    production_today: "Energia prodotta oggi",
    grid_import_today: "Energia prelevata oggi",
    invert_grid: "Inverti segno rete",
    invert_battery: "Inverti segno batteria",
    history: "Grafico di oggi",
  },
  toForm: (c) => ({ ...c, entities: c.entities ?? {}, history: c.history ?? true }),
  // Drop cleared sensors so they do not end up as empty strings in YAML
  fromForm: (data, prev) => {
    const entities = Object.fromEntries(
      Object.entries((data.entities as Record<string, string>) ?? {}).filter(([, v]) => !!v),
    );
    return { ...prev, ...data, entities };
  },
});

type HistoryResponse = Record<string, Array<{ s: string; lu: number }>>;

const HISTORY_REFRESH_MS = 10 * 60 * 1000;
const SAMPLE_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Power of a sensor in watts, honouring its unit. */
const watts = (entity?: HassEntity) => {
  const v = numState(entity);
  if (v === undefined) return undefined;
  const unit = String(entity!.attributes.unit_of_measurement ?? "W");
  return unit === "kW" ? v * 1000 : unit === "MW" ? v * 1e6 : v;
};

/** Energy of a sensor in kWh, honouring its unit. */
const kwh = (entity?: HassEntity) => {
  const v = numState(entity);
  if (v === undefined) return undefined;
  const unit = String(entity!.attributes.unit_of_measurement ?? "kWh");
  return unit === "Wh" ? v / 1000 : unit === "MWh" ? v * 1000 : v;
};

const formatPower = (w: number) =>
  Math.abs(w) < 1000 ? { num: String(Math.round(w)), unit: "W" } : { num: (w / 1000).toFixed(2), unit: "kW" };

const powerText = (w: number, signed = false) => {
  const { num, unit } = formatPower(Math.abs(w));
  return `${signed ? (w < 0 ? "−" : "+") : ""}${num} ${unit}`;
};

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const ICON = {
  solar: svg`<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>`,
  home: svg`<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>`,
  grid: svg`<path d="M12 3l-5 18M12 3l5 18M8.5 15h7M9.6 11h4.8M5 7h14M12 3v4"/>`,
};

/** Live power flow (solar → home ↔ grid), battery, today's chart and totals. */
export class LuxEnergyCard extends LuxBaseCard<EnergyCardConfig> {
  static properties = { ...LuxBaseCard.properties, _history: { state: true } };

  // Today's home power, sampled every 15 minutes from midnight (watts)
  declare private _history: Array<{ t: number; w: number }> | null;
  private _historyTimer?: number;
  private _historyLoadedFor?: string;

  constructor() {
    super();
    this._history = null;
  }

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .live {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .live::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 10px var(--gold);
        animation: pulse 2s infinite;
      }
      @keyframes pulse { 50% { opacity: 0.35; } }
      .hero { display: flex; align-items: baseline; gap: 6px; }
      .hero .num { font-size: 42px; line-height: 1; }
      .hero .unit { font-size: 17px; }
      .caption { color: var(--muted); font-size: 12px; margin: 4px 0 8px; }
      .flow { width: 100%; max-width: 340px; margin: 0 auto; display: block; }
      .node { fill: var(--surface); stroke: var(--line-2); stroke-width: 1; cursor: pointer; }
      .node.hot { stroke: var(--gold-edge); }
      .glyph { fill: none; stroke: var(--gold-hi); stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
      .rail { stroke: var(--line); stroke-width: 1.5; }
      .stream { stroke: var(--gold); stroke-width: 1.5; stroke-dasharray: 1.5 7; stroke-linecap: round; animation: flow 1.1s linear infinite; }
      .stream.rev { animation-direction: reverse; }
      @keyframes flow { to { stroke-dashoffset: -17; } }
      .flow text { fill: var(--muted); font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; font-family: var(--font); }
      .flow text.v { fill: var(--text); font-size: 11.5px; letter-spacing: 0; text-transform: none; }
      .battery { display: flex; align-items: center; gap: 12px; margin: 8px 0 12px; font-size: 12.5px; color: var(--muted); }
      .battery b { color: var(--text); font-weight: 500; }
      .bar { flex: 1; height: 4px; border-radius: 4px; background: var(--surface-hi); overflow: hidden; }
      .bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--gold-lo), var(--gold-hi)); transition: width 0.8s var(--ease); }
      .spark { width: 100%; height: 56px; display: block; margin-top: 4px; }
      .axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--faint); margin-top: 6px; letter-spacing: 0.08em; }
      .stats { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin-top: 14px; border-top: 1px solid var(--line); padding-top: 12px; }
      .stat + .stat { border-left: 1px solid var(--line); padding-left: 14px; }
      .stat .k { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
      .stat .v { font-size: 18px; font-weight: 300; margin-top: 4px; }
      /* Compact: live numbers and flow only */
      :host([compact]) .hero .num { font-size: 32px; }
      :host([compact]) .spark,
      :host([compact]) .axis,
      :host([compact]) .stats { display: none; }
      .stat .v small { font-size: 11px; color: var(--gold); margin-left: 2px; }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { entities: { home: "sensor.home_power", solar: "sensor.solar_power", grid: "sensor.grid_power" } };
  }

  setConfig(config: EnergyCardConfig) {
    if (!config.entities || (!config.entities.home && !config.entities.solar && !config.entities.grid)) {
      throw new Error("Specifica almeno una tra entities.home, entities.solar ed entities.grid");
    }
    this._config = config;
    this._historyLoadedFor = undefined;
  }

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  protected watchedEntities() {
    return Object.values(this._config?.entities ?? {}).filter((id): id is string => !!id);
  }

  connectedCallback() {
    super.connectedCallback();
    this._historyTimer = window.setInterval(() => this._loadHistory(), HISTORY_REFRESH_MS);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._historyTimer);
  }

  protected updated() {
    // First load as soon as hass and config are both available
    const home = this._config?.entities.home;
    if (this.hass && home && this._historyLoadedFor !== home) {
      this._historyLoadedFor = home;
      this._loadHistory();
    }
  }

  private async _loadHistory() {
    const id = this._config?.entities.home;
    if (!this.hass || !id || this._config?.history === false) return;
    const start = startOfDay();
    try {
      const res = await this.hass.callWS<HistoryResponse>({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        entity_ids: [id],
        minimal_response: true,
        no_attributes: true,
      });
      const unit = String(this.hass.states[id]?.attributes.unit_of_measurement ?? "W");
      const scale = unit === "kW" ? 1000 : 1;
      const changes = (res[id] ?? [])
        .map((c) => ({ t: c.lu * 1000, w: parseFloat(c.s) * scale }))
        .filter((c) => !Number.isNaN(c.w));
      // Sample-and-hold every 15 minutes from midnight to now
      const samples: Array<{ t: number; w: number }> = [];
      let i = 0;
      let value = changes[0]?.w ?? 0;
      for (let t = start; t <= Date.now(); t += SAMPLE_MS) {
        while (i < changes.length && changes[i].t <= t) value = changes[i++].w;
        samples.push({ t, w: value });
      }
      this._history = samples;
    } catch (err) {
      console.warn("luxury-energy-card: storico non disponibile", err);
      this._history = null;
    }
  }

  private _renderFlow(solar: number | undefined, home: number, grid: number | undefined) {
    const ids = this._config!.entities;
    const nodes = [
      ...(solar !== undefined ? [{ key: "solar" as const, label: "Solare", value: powerText(solar), id: ids.solar, hot: solar > 10 }] : []),
      { key: "home" as const, label: "Casa", value: powerText(home), id: ids.home, hot: true },
      ...(grid !== undefined ? [{ key: "grid" as const, label: "Rete", value: powerText(grid, true), id: ids.grid, hot: grid > 10 }] : []),
    ];
    const xs = nodes.length === 3 ? [40, 150, 260] : nodes.length === 2 ? [75, 225] : [150];
    const r = (key: string) => (key === "home" ? 24 : 22);

    return html`
      <svg class="flow" viewBox="0 16 300 100">
        ${nodes.slice(1).map((n, k) => {
          const prev = nodes[k];
          const x1 = xs[k] + r(prev.key);
          const x2 = xs[k + 1] - r(n.key);
          // Solar always flows into the house; the grid line flows out when exporting
          const active = n.key === "home" ? (solar ?? 0) > 10 : Math.abs(grid ?? 0) > 10;
          const reverse = n.key === "grid" && (grid ?? 0) > 0;
          return svg`
            <line class="rail" x1=${x1} y1="44" x2=${x2} y2="44" />
            ${active ? svg`<line class="stream ${reverse ? "rev" : ""}" x1=${x1} y1="44" x2=${x2} y2="44" />` : nothing}
          `;
        })}
        ${nodes.map(
          (n, k) => svg`
            <circle class="node ${n.hot ? "hot" : ""}" cx=${xs[k]} cy="44" r=${r(n.key)}
              @click=${() => n.id && fireMoreInfo(this, n.id)} />
            <g class="glyph" transform="translate(${xs[k] - 12} 32)">${ICON[n.key]}</g>
            <text x=${xs[k]} y="92" text-anchor="middle">${n.label}</text>
            <text x=${xs[k]} y="110" text-anchor="middle" class="v">${n.value}</text>
          `,
        )}
      </svg>
    `;
  }

  private _renderChart() {
    const h = this._history;
    if (!h || h.length < 2) return nothing;
    const start = startOfDay();
    const max = Math.max(...h.map((p) => p.w), 1);
    const pts = h.map((p) => [((p.t - start) / DAY_MS) * 300, 68 - (clamp(p.w, 0, max) / max) * 60]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const lastX = pts[pts.length - 1][0];
    const nowX = ((Date.now() - start) / DAY_MS) * 300;
    return html`
      <svg class="spark" viewBox="0 0 300 72" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style="stop-color:var(--gold)" stop-opacity=".32" />
            <stop offset="1" style="stop-color:var(--gold)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${line} L${lastX} 72 L0 72 Z" fill="url(#sparkFill)" />
        <path d=${line} fill="none" style="stroke:var(--gold)" stroke-width="1.4" vector-effect="non-scaling-stroke" />
        <line x1=${nowX} x2=${nowX} y1="0" y2="72" stroke="rgba(255,240,220,.15)" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return null;
    const ids = this._config.entities;
    const s = this.hass.states;
    const get = (id?: string) => (id ? s[id] : undefined);

    const solar = watts(get(ids.solar));
    let battery = watts(get(ids.battery));
    if (battery !== undefined && this._config.invert_battery) battery = -battery;
    let grid = watts(get(ids.grid));
    if (grid !== undefined && this._config.invert_grid) grid = -grid;

    // Fill in whatever is missing from the energy balance: home = solar + grid − battery
    const home = watts(get(ids.home)) ?? (solar ?? 0) + (grid ?? 0) - (battery ?? 0);
    if (grid === undefined && ids.home && ids.solar) grid = home + (battery ?? 0) - solar!;

    const soc = numState(get(ids.battery_soc));
    const consumption = kwh(get(ids.consumption_today));
    const production = kwh(get(ids.production_today));
    const imported = kwh(get(ids.grid_import_today));
    const autonomy =
      consumption !== undefined && imported !== undefined && consumption > 0
        ? clamp(Math.round((1 - imported / consumption) * 100), 0, 100)
        : undefined;

    const hero = formatPower(home);
    const caption =
      grid === undefined
        ? "Consumo attuale"
        : `Consumo attuale · ${grid < 0 ? "in immissione" : "dalla rete"} ${powerText(Math.abs(grid))}`;

    const stats = [
      consumption !== undefined ? { k: "Consumo", v: consumption.toFixed(1), u: "kWh" } : null,
      production !== undefined ? { k: "Prodotta", v: production.toFixed(1), u: "kWh" } : null,
      autonomy !== undefined ? { k: "Autonomia", v: String(autonomy), u: "%" } : null,
    ].filter((x) => x !== null);

    return html`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${this._config.title ?? "Energia"}</h2>
          </div>
          <span class="live">Live</span>
        </div>
        <div class="hero"><span class="num">${hero.num}</span><span class="unit">${hero.unit}</span></div>
        <div class="caption">${caption}</div>

        ${this._renderFlow(solar, home, grid)}

        ${soc !== undefined
          ? html`<div class="battery">
              <span>Batteria <b>${Math.round(soc)}%</b></span>
              <div class="bar"><span style="width:${clamp(soc, 0, 100)}%"></span></div>
              ${battery !== undefined ? html`<span>${powerText(battery, true)}</span>` : null}
            </div>`
          : null}

        ${this._config.history === false ? nothing : this._renderChart()}

        ${stats.length
          ? html`<div class="stats">
              ${stats.map((st) => html`<div class="stat"><div class="k">${st.k}</div><div class="v">${st.v}<small>${st.u}</small></div></div>`)}
            </div>`
          : null}
      </div>
    `;
  }
}
