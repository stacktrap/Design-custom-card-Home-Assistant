import { css, html, type PropertyValues } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import { LuxCardDialog } from "../shared/card-dialog";
import { defineEditor } from "../shared/editor";
import { entityName, isUnavailable, numAttr } from "../shared/helpers";
import { renderIcon } from "../shared/icons";
import { THERMOSTAT_FIELDS, THERMOSTAT_LABELS, type ThermostatCardConfig } from "./thermostat-card";

export type ThermostatMiniCardConfig = ThermostatCardConfig;

const getConfigElement = defineEditor("luxury-thermostat-mini-card-editor", {
  schema: [...THERMOSTAT_FIELDS, { name: "compact", selector: { boolean: {} } }],
  labels: THERMOSTAT_LABELS,
});

/**
 * Small thermostat row (styled like the single light card) showing the
 * current and target temperature; tapping it opens the full dial.
 */
export class LuxThermostatMiniCard extends LuxBaseCard<ThermostatMiniCardConfig> {
  private _dialog?: LuxCardDialog;
  private _fullCard?: HTMLElement & { hass?: unknown; setConfig(c: unknown): void };

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        cursor: pointer;
        transition: border-color 0.4s var(--ease), transform 0.2s var(--ease);
      }
      .card:active { transform: scale(0.985); }
      .card:focus-visible { outline: none; border-color: var(--gold-edge); }
      .card.heating { border-color: var(--gold-edge); }
      .ico { width: 40px; height: 40px; }
      .idle .ico { color: var(--gold); background: var(--gold-tint); }
      .text { flex: 1; min-width: 0; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .heating .state { color: var(--gold-hi); }
      .temp { display: flex; align-items: flex-start; flex: none; }
      .temp .num { font-size: 30px; line-height: 1; }
      .temp sup { font-size: 13px; color: var(--gold); margin-left: 1px; line-height: 1.2; }
      .off .temp .num { color: var(--muted); }

      :host([compact]) .card { padding: 10px 14px; }
      :host([compact]) .ico { width: 34px; height: 34px; }
      :host([compact]) .card-sub { display: none; }
      :host([compact]) .temp .num { font-size: 24px; }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { entity: "climate.example", room: "Soggiorno" };
  }

  setConfig(config: ThermostatMiniCardConfig) {
    if (!config.entity?.startsWith("climate.")) throw new Error("Specifica un'entità climate.*");
    this._config = config;
    this._fullCard?.setConfig(this._fullConfig());
  }

  getCardSize() {
    return 1;
  }

  protected watchedEntities() {
    if (!this._config) return [];
    return [this._config.entity, this._config.humidity_entity].filter((id): id is string => !!id);
  }

  // Keep the open dialog in sync with Home Assistant
  protected updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (this._fullCard && changed.has("hass")) this._fullCard.hass = this.hass;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._dialog?.close();
  }

  private _fullConfig() {
    const { compact: _compact, ...rest } = this._config!;
    return { ...rest, type: "custom:luxury-thermostat-card" };
  }

  private _open() {
    if (this._dialog || !this._config) return;
    const card = document.createElement("luxury-thermostat-card") as NonNullable<typeof this._fullCard>;
    card.setConfig(this._fullConfig());
    card.hass = this.hass;
    // more-info from inside the dialog must still reach Home Assistant
    card.addEventListener("hass-more-info", (e) => {
      e.stopPropagation();
      this._dialog?.close();
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: (e as CustomEvent).detail, bubbles: true, composed: true }));
    });
    this._fullCard = card;
    this._dialog = new LuxCardDialog();
    this._dialog.show(card, () => {
      this._dialog = undefined;
      this._fullCard = undefined;
    });
  }

  render() {
    if (!this._config || !this.hass) return null;
    const entity = this.hass.states[this._config.entity];
    if (!entity) return this.renderWarning(`Entità non trovata: ${this._config.entity}`);

    const unavailable = isUnavailable(entity);
    const on = !unavailable && entity.state !== "off";
    const target = numAttr(entity, "temperature");
    const current = numAttr(entity, "current_temperature");
    const action = entity.attributes.hvac_action as string | undefined;
    const heating =
      on && (action ? action === "heating" : current !== undefined && target !== undefined && current < target);

    const status = unavailable
      ? "Non disponibile"
      : !on
        ? "Spento"
        : `${heating ? "Riscalda" : "In attesa"}${target !== undefined ? ` · impostata ${target.toFixed(1)}°` : ""}`;
    const mode = heating ? "heating" : on ? "idle" : "off";

    return html`
      <div
        class="card ${mode} ${heating ? "on" : ""}"
        role="button"
        tabindex="0"
        aria-label="Apri il termostato"
        @click=${this._open}
        @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._open())}
      >
        <span class="ico">${renderIcon("flame")}</span>
        <div class="text">
          ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
          <h2 class="card-title">${entityName(entity, this._config.name ?? "Riscaldamento")}</h2>
          <div class="state">${status}</div>
        </div>
        <div class="temp">
          <span class="num">${current !== undefined ? current.toFixed(1) : "—"}</span><sup>°</sup>
        </div>
      </div>
    `;
  }
}
