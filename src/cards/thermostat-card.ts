import { css, html, svg } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import { clamp, entityName, fireMoreInfo, isUnavailable, numAttr, numState, startDrag } from "../shared/helpers";
import { defineEditor } from "../shared/editor";
import { PendingValue } from "../shared/pending-value";
import type { LovelaceCardConfig } from "../shared/types";

export interface ThermostatCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  room?: string;
  /** Optional humidity sensor, used when the climate entity has no humidity. */
  humidity_entity?: string;
  min?: number;
  max?: number;
  step?: number;
  compact?: boolean;
}

const getConfigElement = defineEditor("luxury-thermostat-card-editor", {
  schema: [
    { name: "entity", required: true, selector: { entity: { domain: "climate" } } },
    { type: "grid", name: "", schema: [
      { name: "name", selector: { text: {} } },
      { name: "room", selector: { text: {} } },
    ] },
    { name: "humidity_entity", selector: { entity: { domain: "sensor", device_class: "humidity" } } },
    { type: "grid", name: "", schema: [
      { name: "min", selector: { number: { min: 5, max: 35, step: 0.5, mode: "box", unit_of_measurement: "°C" } } },
      { name: "max", selector: { number: { min: 5, max: 35, step: 0.5, mode: "box", unit_of_measurement: "°C" } } },
      { name: "step", selector: { number: { min: 0.1, max: 1, step: 0.1, mode: "box" } } },
    ] },
    { name: "compact", selector: { boolean: {} } },
  ],
  labels: {
    humidity_entity: "Sensore umidità (opzionale)",
    min: "Minima (opz.)",
    max: "Massima (opz.)",
    step: "Passo (opz.)",
  },
});

// Dial geometry (SVG viewBox 0 0 260 260): a 270° arc open at the bottom
const C = 130;
const R = 100;
const START = 135;
const SWEEP = 270;
const TICKS = 60;

const polar = (r: number, deg: number) => {
  const t = (deg * Math.PI) / 180;
  return [C + r * Math.cos(t), C + r * Math.sin(t)];
};
const arcPath = (a0: number, a1: number) => {
  const [x0, y0] = polar(R, a0);
  const [x1, y1] = polar(R, a1);
  return `M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

/** Heating-only thermostat with a draggable arc dial. */
export class LuxThermostatCard extends LuxBaseCard<ThermostatCardConfig> {
  private _target = new PendingValue(this, 0.01);
  private _stepTimer?: number;
  private _stepping?: number;

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .card { --acc: var(--gold); --acc-hi: var(--gold-hi); --acc-lo: var(--gold-lo); }
      .card.off { --acc: #4a4640; --acc-hi: #5e5952; --acc-lo: #3a3732; }
      .dial { position: relative; width: 100%; max-width: 230px; margin: -4px auto 0; aspect-ratio: 1; }
      :host([compact]) .dial { max-width: 170px; }
      .dial svg { width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
      .dial svg:active { cursor: grabbing; }
      .tick { stroke: var(--line-2); stroke-width: 1.2; stroke-linecap: round; transition: stroke 0.3s; }
      .tick.on { stroke: var(--acc); }
      .center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .center .label { font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
      .center .num { font-size: 50px; line-height: 1; margin: 4px 0 6px; }
      :host([compact]) .center .num { font-size: 38px; }
      :host([compact]) .center .meta { font-size: 10.5px; }
      .center .num sup {
        font-size: 0.4em;
        color: var(--acc);
        font-weight: 300;
        vertical-align: top;
        position: relative;
        top: 0.12em;
        margin-left: 2px;
      }
      .center .meta { font-size: 11.5px; color: var(--muted); }
      :host([compact]) .center .label,
      :host([compact]) .hum { display: none; }
      .center .meta b { color: var(--text); font-weight: 400; }
      .steps { position: absolute; left: 0; right: 0; bottom: 2%; display: flex; justify-content: center; gap: 26%; }
      .round-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .round-btn:hover { border-color: var(--gold-edge); background: var(--gold-tint); }
      .round-btn:active { transform: scale(0.94); }
      .round-btn svg { width: 16px; height: 16px; }
      :host([compact]) .round-btn { width: 32px; height: 32px; }
      .status {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        margin-top: 2px;
        font-size: 10.5px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .status::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--faint);
      }
      .status.heating::before { background: var(--gold); box-shadow: 0 0 10px var(--gold); animation: pulse 2s infinite; }
      @keyframes pulse { 50% { opacity: 0.35; } }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { entity: "climate.example", room: "Soggiorno" };
  }

  setConfig(config: ThermostatCardConfig) {
    if (!config.entity?.startsWith("climate.")) throw new Error("Specifica un'entità climate.*");
    this._config = config;
  }

  getCardSize() {
    return 6;
  }

  protected watchedEntities() {
    if (!this._config) return [];
    return [this._config.entity, this._config.humidity_entity].filter((id): id is string => !!id);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._stepTimer);
  }

  private get _entity() {
    return this.hass?.states[this._config!.entity];
  }

  private get _range() {
    const e = this._entity;
    return {
      min: this._config!.min ?? numAttr(e, "min_temp") ?? 7,
      max: this._config!.max ?? numAttr(e, "max_temp") ?? 30,
      step: this._config!.step ?? numAttr(e, "target_temp_step") ?? 0.5,
    };
  }

  private _round(v: number) {
    const { min, max, step } = this._range;
    return clamp(Math.round(v / step) * step, min, max);
  }

  private _setTemperature(value: number) {
    const on = this._entity?.state !== "off";
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this._config!.entity,
      temperature: value,
      // Changing the target while off also turns the heating on
      ...(on ? {} : { hvac_mode: "heat" }),
    });
  }

  private _onDialDown = (e: PointerEvent) => {
    if (isUnavailable(this._entity)) return;
    const svgEl = e.currentTarget as SVGSVGElement;
    const { min, max } = this._range;
    const toValue = (ev: PointerEvent) => {
      const r = svgEl.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * 260 - C;
      const y = ((ev.clientY - r.top) / r.height) * 260 - C;
      let rel = ((Math.atan2(y, x) * 180) / Math.PI - START + 720) % 360;
      // Pointer in the bottom gap: snap to the nearest end
      if (rel > SWEEP) rel = rel > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP;
      return this._round(min + ((max - min) * rel) / SWEEP);
    };
    let last: number | null = null;
    startDrag(
      e,
      svgEl as unknown as HTMLElement,
      (ev) => {
        last = toValue(ev);
        this._target.drag(last);
      },
      () => {
        if (last === null) return;
        this._target.commit(last);
        this._setTemperature(last);
      },
    );
  };

  // +/- buttons: update immediately, send one service call once the user stops tapping
  private _step(direction: 1 | -1, current: number) {
    // Taps faster than a render must build on the previous tap, not the rendered value
    const value = this._round((this._stepping ?? current) + direction * this._range.step);
    this._stepping = value;
    this._target.drag(value);
    clearTimeout(this._stepTimer);
    this._stepTimer = window.setTimeout(() => {
      this._stepping = undefined;
      this._target.commit(value);
      this._setTemperature(value);
    }, 700);
  }

  private _toggle() {
    const on = this._entity?.state !== "off";
    this.hass!.callService("climate", "set_hvac_mode", {
      entity_id: this._config!.entity,
      hvac_mode: on ? "off" : "heat",
    });
  }

  render() {
    if (!this._config || !this.hass) return null;
    const entity = this._entity;
    if (!entity) return this.renderWarning(`Entità non trovata: ${this._config.entity}`);

    const unavailable = isUnavailable(entity);
    const { min, max } = this._range;
    const on = !unavailable && entity.state !== "off";
    const target = this._target.resolve(numAttr(entity, "temperature") ?? min);
    const current = numAttr(entity, "current_temperature");
    const humidity =
      numAttr(entity, "current_humidity") ??
      (this._config.humidity_entity ? numState(this.hass.states[this._config.humidity_entity]) : undefined);

    const action = entity.attributes.hvac_action as string | undefined;
    const heating = on && (action ? action === "heating" : current !== undefined && current < target);
    const status = unavailable
      ? "Non disponibile"
      : !on
        ? "Spento"
        : heating
          ? "Riscaldamento in corso"
          : "Temperatura raggiunta";

    const f = clamp((target - min) / (max - min), 0, 1);
    const end = START + Math.max(SWEEP * f, 0.01);
    const [kx, ky] = polar(R, end);
    const lit = on || this._target.active;

    return html`
      <div class="card ${lit ? "" : "off"}">
        <div class="card-head">
          <div class="clickable" @click=${() => fireMoreInfo(this, this._config!.entity)}>
            ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${entityName(entity, this._config.name ?? "Riscaldamento")}</h2>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${on}
            aria-label="Accendi o spegni il riscaldamento"
            ?disabled=${unavailable}
            @click=${this._toggle}
          ></button>
        </div>

        <div class="dial">
          <svg viewBox="0 0 260 260" aria-label="Temperatura impostata" @pointerdown=${this._onDialDown}>
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0" style="stop-color:var(--acc-lo)" />
                <stop offset="1" style="stop-color:var(--acc-hi)" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            ${Array.from({ length: TICKS + 1 }, (_, i) => {
              const a = START + (SWEEP * i) / TICKS;
              const [x0, y0] = polar(116, a);
              const [x1, y1] = polar(i % 10 === 0 ? 124 : 120, a);
              return svg`<line class="tick ${lit && i / TICKS <= f ? "on" : ""}" x1=${x0} y1=${y0} x2=${x1} y2=${y1} />`;
            })}
            <path d=${arcPath(START, START + SWEEP)} stroke="rgba(255,240,220,.08)" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d=${arcPath(START, end)} stroke="url(#grad)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#glow)" opacity=".55" />
            <path d=${arcPath(START, end)} stroke="url(#grad)" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <circle cx=${kx} cy=${ky} r="16" style="fill:var(--acc)" opacity=".14" />
            <circle cx=${kx} cy=${ky} r="8" fill="#1A1815" style="stroke:var(--acc-hi)" stroke-width="2" />
          </svg>
          <div class="center">
            <span class="label">Impostata</span>
            <span class="num">${lit ? target.toFixed(1) : "—"}<sup>°</sup></span>
            <span class="meta">
              ${current !== undefined ? html`Attuale <b>${current.toFixed(1)}°</b>` : null}
              ${humidity !== undefined
                ? html`<span class="hum">${current !== undefined ? " · " : null}Umidità <b>${Math.round(humidity)}%</b></span>`
                : null}
            </span>
          </div>
          <div class="steps">
            <button class="round-btn" aria-label="Diminuisci" ?disabled=${unavailable} @click=${() => this._step(-1, target)}>
              <svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12" /></svg>
            </button>
            <button class="round-btn" aria-label="Aumenta" ?disabled=${unavailable} @click=${() => this._step(1, target)}>
              <svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12M12 6v12" /></svg>
            </button>
          </div>
        </div>
        <div class="status ${heating ? "heating" : ""}">${status}</div>
      </div>
    `;
  }
}
