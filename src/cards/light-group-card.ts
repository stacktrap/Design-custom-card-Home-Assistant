import { css, html } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import {
  brightnessPct,
  entityName,
  fireMoreInfo,
  isOn,
  isUnavailable,
  supportsBrightness,
  toggle,
  turnOnOff,
} from "../shared/helpers";
import { defineEditor } from "../shared/editor";
import { renderIcon } from "../shared/icons";
import type { LovelaceCardConfig } from "../shared/types";

interface LightEntry {
  entity: string;
  name?: string;
  icon?: string;
}

export interface LightGroupCardConfig extends LovelaceCardConfig {
  /** Room name shown above the counter. */
  title?: string;
  entities: Array<string | LightEntry>;
  columns?: number;
  /** Show the master switch that turns every light on or off. */
  master?: boolean;
  compact?: boolean;
}

const getConfigElement = defineEditor("luxury-light-group-card-editor", {
  schema: [
    { name: "title", selector: { text: {} } },
    { name: "entities", required: true, selector: { entity: { multiple: true, filter: [{ domain: "light" }, { domain: "switch" }] } } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "columns", selector: { number: { min: 1, max: 4, mode: "box" } } },
        { name: "master", selector: { boolean: {} } },
        { name: "compact", selector: { boolean: {} } },
      ],
    },
  ],
  labels: { title: "Stanza", entities: "Luci", columns: "Colonne", master: "Interruttore generale" },
  toForm: (c) => ({
    ...c,
    master: c.master ?? true,
    columns: c.columns ?? 2,
    entities: ((c.entities as LightGroupCardConfig["entities"]) ?? []).map((e) => (typeof e === "string" ? e : e.entity)),
  }),
  // Keep per-light name/icon from YAML for lights that are still selected
  fromForm: (data, prev) => {
    const old = (prev.entities as LightGroupCardConfig["entities"]) ?? [];
    const entities = ((data.entities as string[]) ?? []).map(
      (id) => old.find((e) => typeof e !== "string" && e.entity === id) ?? id,
    );
    return { ...prev, ...data, entities };
  },
});

const HOLD_MS = 500;

/** Grid of light tiles for a room, with an on/off counter and a master switch. */
export class LuxLightGroupCard extends LuxBaseCard<LightGroupCardConfig> {
  private _entries: LightEntry[] = [];
  private _holdTimer?: number;
  private _held = false;

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .tiles { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); gap: 8px; }
      .tile {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        min-height: 92px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        touch-action: manipulation;
        transition: background 0.4s var(--ease), border-color 0.4s var(--ease), transform 0.2s var(--ease);
      }
      .tile:active { transform: scale(0.98); }
      .tile:disabled { opacity: 0.45; cursor: default; }
      .name { font-size: 13px; font-weight: 500; margin-top: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .state { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
      .tile .ico { width: 32px; height: 32px; --mdc-icon-size: 18px; }
      .tile .ico svg { width: 18px; height: 18px; }
      /* Compact: one row per light, icon beside the text */
      :host([compact]) .tile { min-height: 0; flex-direction: row; align-items: center; justify-content: flex-start; gap: 10px; padding: 9px 10px; }
      :host([compact]) .tile > span:last-child { min-width: 0; }
      :host([compact]) .name { margin-top: 0; }
      .tile.on {
        background: linear-gradient(160deg, rgba(200, 164, 106, 0.13), rgba(200, 164, 106, 0.03));
        border-color: var(--gold-edge);
      }
      .tile.on .state { color: var(--gold-hi); }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { title: "Soggiorno", entities: ["light.example_1", "light.example_2"] };
  }

  setConfig(config: LightGroupCardConfig) {
    if (!Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("Specifica almeno un'entità in `entities`");
    }
    this._entries = config.entities.map((e) => (typeof e === "string" ? { entity: e } : e));
    this._config = config;
  }

  protected watchedEntities() {
    return this._entries.map((e) => e.entity);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  getCardSize() {
    return 1 + Math.ceil(this._entries.length / (this._config?.columns ?? 2)) * 2;
  }

  // Tap toggles the light, press-and-hold opens the more-info dialog
  private _pointerDown(entityId: string) {
    this._held = false;
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      fireMoreInfo(this, entityId);
    }, HOLD_MS);
  }

  private _click(entityId: string) {
    clearTimeout(this._holdTimer);
    if (!this._held) toggle(this.hass!, entityId);
    this._held = false;
  }

  render() {
    if (!this._config || !this.hass) return null;
    const states = this.hass.states;
    const ids = this._entries.map((e) => e.entity);
    const onCount = ids.filter((id) => isOn(states[id])).length;
    const counter = onCount ? `${onCount} di ${ids.length} accese` : "Tutte spente";

    return html`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.title ? html`<p class="card-sub">${this._config.title}</p>` : null}
            <h2 class="card-title">${counter}</h2>
          </div>
          ${this._config.master !== false
            ? html`<button
                class="switch"
                role="switch"
                aria-checked=${onCount > 0}
                aria-label="Tutte le luci"
                @click=${() => turnOnOff(this.hass!, ids, onCount === 0)}
              ></button>`
            : null}
        </div>
        <div class="tiles" style="--cols:${this._config.columns ?? 2}">
          ${this._entries.map((entry) => {
            const entity = states[entry.entity];
            const unavailable = isUnavailable(entity);
            const on = isOn(entity);
            const state = unavailable
              ? "Non disponibile"
              : !on
                ? "Spenta"
                : supportsBrightness(entity)
                  ? `Accesa · ${brightnessPct(entity)}%`
                  : "Accesa";
            return html`
              <button
                class="tile ${on ? "on" : ""}"
                ?disabled=${unavailable}
                @pointerdown=${() => this._pointerDown(entry.entity)}
                @pointerleave=${() => clearTimeout(this._holdTimer)}
                @click=${() => this._click(entry.entity)}
                @contextmenu=${(e: Event) => e.preventDefault()}
              >
                <span class="ico">${renderIcon(entry.icon)}</span>
                <span>
                  <div class="name">${entityName(entity, entry.name)}</div>
                  <div class="state">${state}</div>
                </span>
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }
}
