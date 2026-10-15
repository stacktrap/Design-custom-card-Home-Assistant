import { css, html } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import {
  brightnessPct,
  entityName,
  fireMoreInfo,
  isOn,
  isUnavailable,
  setBrightness,
  supportsBrightness,
  toggle,
} from "../shared/helpers";
import { defineEditor, ICON_SELECTOR } from "../shared/editor";
import { renderIcon } from "../shared/icons";
import "../shared/lux-slider";
import { PendingValue } from "../shared/pending-value";
import type { LovelaceCardConfig } from "../shared/types";

export interface LightCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  room?: string;
  icon?: string;
  /** Show the brightness slider. Defaults to true when the light is dimmable. */
  brightness?: boolean;
  compact?: boolean;
}

const getConfigElement = defineEditor("luxury-light-card-editor", {
  schema: [
    { name: "entity", required: true, selector: { entity: { filter: [{ domain: "light" }, { domain: "switch" }] } } },
    { type: "grid", name: "", schema: [
      { name: "name", selector: { text: {} } },
      { name: "room", selector: { text: {} } },
    ] },
    { name: "icon", selector: ICON_SELECTOR },
    { type: "grid", name: "", schema: [
      { name: "brightness", selector: { boolean: {} } },
      { name: "compact", selector: { boolean: {} } },
    ] },
  ],
  labels: { brightness: "Slider luminosità (se supportata)" },
  toForm: (c) => ({ ...c, brightness: c.brightness ?? true }),
});

/** Compact card for a single light or switch, with an optional slim brightness slider. */
export class LuxLightCard extends LuxBaseCard<LightCardConfig> {
  private _brightness = new PendingValue(this);

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .card { padding: 16px 18px; }
      .card.on { border-color: var(--gold-edge); }
      .row { display: flex; align-items: center; gap: 12px; }
      .ico { width: 40px; height: 40px; cursor: pointer; }
      .text { flex: 1; min-width: 0; cursor: pointer; }
      .card-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .on .state { color: var(--gold-hi); }
      lux-slider { margin-top: 14px; --slider-height: 30px; --slider-radius: 10px; }
      :host([compact]) .card { padding: 10px 14px; }
      :host([compact]) .ico { width: 34px; height: 34px; }
      :host([compact]) .card-sub { display: none; }
      :host([compact]) lux-slider { margin-top: 10px; --slider-height: 24px; --slider-radius: 8px; }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { entity: "light.example", room: "Camera" };
  }

  setConfig(config: LightCardConfig) {
    if (!config.entity) throw new Error("Specifica un'entità (light.* o switch.*)");
    this._config = config;
  }

  protected watchedEntities() {
    return this._config ? [this._config.entity] : [];
  }

  getCardSize() {
    return this._config?.brightness === false ? 1 : 2;
  }

  render() {
    if (!this._config || !this.hass) return null;
    const id = this._config.entity;
    const entity = this.hass.states[id];
    if (!entity) return this.renderWarning(`Entità non trovata: ${id}`);

    const unavailable = isUnavailable(entity);
    const on = isOn(entity);
    const dimmable = supportsBrightness(entity) && this._config.brightness !== false;
    const pct = this._brightness.resolve(brightnessPct(entity));
    const lit = on || this._brightness.active;
    const state = unavailable ? "Non disponibile" : !lit ? "Spenta" : dimmable ? `Accesa · ${pct}%` : "Accesa";
    const onToggle = () => !unavailable && toggle(this.hass!, id);

    return html`
      <div class="card ${lit ? "on" : ""}">
        <div class="row">
          <button class="ico" aria-label="Accendi o spegni" @click=${onToggle}>${renderIcon(this._config.icon)}</button>
          <div class="text" @click=${() => fireMoreInfo(this, id)}>
            ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${entityName(entity, this._config.name)}</h2>
            <div class="state">${state}</div>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${on}
            aria-label="Accendi o spegni"
            ?disabled=${unavailable}
            @click=${onToggle}
          ></button>
        </div>
        ${dimmable
          ? html`<lux-slider
              label="Luminosità"
              .value=${pct}
              ?off=${!on}
              ?disabled=${unavailable}
              @value-changing=${(e: CustomEvent) => this._brightness.drag(e.detail.value)}
              @value-changed=${(e: CustomEvent) => {
                this._brightness.commit(e.detail.value);
                setBrightness(this.hass!, id, e.detail.value);
              }}
            ></lux-slider>`
          : null}
      </div>
    `;
  }
}
