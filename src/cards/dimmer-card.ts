import { css, html } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import {
  brightnessPct,
  entityName,
  fireMoreInfo,
  isOn,
  isUnavailable,
  setBrightness,
  toggle,
} from "../shared/helpers";
import "../shared/lux-slider";
import { PendingValue } from "../shared/pending-value";
import type { LovelaceCardConfig } from "../shared/types";

export interface DimmerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  room?: string;
}

/** Large dimmer: on/off switch, brightness readout and a wide slider. */
export class LuxDimmerCard extends LuxBaseCard<DimmerCardConfig> {
  private _brightness = new PendingValue(this);

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .card::before {
        content: "";
        position: absolute;
        inset: -40% -20% auto;
        height: 90%;
        background: radial-gradient(closest-side, var(--lux-glow, #f1c58a), transparent);
        opacity: var(--glow-o, 0);
        filter: blur(20px);
        pointer-events: none;
        transition: opacity 0.5s var(--ease);
      }
      .value { position: relative; display: flex; align-items: baseline; gap: 4px; margin: 6px 0 2px; }
      .value .num { font-size: 64px; line-height: 1; }
      .value .unit { font-size: 22px; }
      .label { position: relative; color: var(--muted); font-size: 12.5px; margin-bottom: 22px; }
    `,
  ];

  static getStubConfig() {
    return { entity: "light.example", name: "Lampada", room: "Soggiorno" };
  }

  setConfig(config: DimmerCardConfig) {
    if (!config.entity?.startsWith("light.")) throw new Error("Specifica un'entità light.*");
    this._config = config;
  }

  getCardSize() {
    return 4;
  }

  protected watchedEntities() {
    return this._config ? [this._config.entity] : [];
  }

  render() {
    if (!this._config || !this.hass) return null;
    const id = this._config.entity;
    const entity = this.hass.states[id];
    if (!entity) return this.renderWarning(`Entità non trovata: ${id}`);

    const unavailable = isUnavailable(entity);
    const on = isOn(entity);
    const pct = this._brightness.resolve(brightnessPct(entity));
    const lit = on || this._brightness.active;
    const glow = lit ? (0.08 + (pct / 100) * 0.32).toFixed(2) : "0";

    return html`
      <div class="card" style="--glow-o:${glow}">
        <div class="card-head">
          <div class="clickable" @click=${() => fireMoreInfo(this, id)}>
            ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${entityName(entity, this._config.name)}</h2>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${on}
            aria-label="Accendi o spegni"
            ?disabled=${unavailable}
            @click=${() => toggle(this.hass!, id)}
          ></button>
        </div>
        <div class="value"><span class="num">${lit ? pct : 0}</span><span class="unit">%</span></div>
        <div class="label">${unavailable ? "Non disponibile" : lit ? "Luminosità" : "Spenta"}</div>
        <lux-slider
          marks
          label="Luminosità"
          .value=${pct}
          ?off=${!on}
          ?disabled=${unavailable}
          @value-changing=${(e: CustomEvent) => this._brightness.drag(e.detail.value)}
          @value-changed=${(e: CustomEvent) => {
            this._brightness.commit(e.detail.value);
            setBrightness(this.hass!, id, e.detail.value);
          }}
        ></lux-slider>
      </div>
    `;
  }
}
