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
}

const HOLD_MS = 500;

/** Grid of light tiles for a room, with an on/off counter and a master switch. */
export class LuxLightGroupCard extends LuxBaseCard<LightGroupCardConfig> {
  private _entries: LightEntry[] = [];
  private _holdTimer?: number;
  private _held = false;

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .tiles { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); gap: 10px; }
      .tile {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: var(--radius-sm);
        padding: 16px;
        min-height: 116px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        touch-action: manipulation;
        transition: background 0.4s var(--ease), border-color 0.4s var(--ease), transform 0.2s var(--ease);
      }
      .tile:active { transform: scale(0.98); }
      .tile:disabled { opacity: 0.45; cursor: default; }
      .name { font-size: 13.5px; font-weight: 500; margin-top: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .tile.on {
        background: linear-gradient(160deg, rgba(200, 164, 106, 0.13), rgba(200, 164, 106, 0.03));
        border-color: var(--gold-edge);
      }
      .tile.on .state { color: var(--gold-hi); }
    `,
  ];

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
