import { css, html, type PropertyValues } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import { defineEditor, ICON_SELECTOR } from "../shared/editor";
import { renderIcon } from "../shared/icons";
import type { LovelaceCardConfig } from "../shared/types";

/** A Home Assistant action, same format as `tap_action` in any built-in card. */
type ActionConfig = { action: string; [key: string]: unknown };

export interface ButtonCardConfig extends LovelaceCardConfig {
  name: string;
  room?: string;
  /** Small text under the name. */
  secondary?: string;
  icon?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  /** "row" (default): icon beside the text · "tile": icon above, for small grid cells. */
  layout?: "row" | "tile";
  compact?: boolean;
}

const HOLD_MS = 500;
const FEEDBACK_MS = 1400;

const getConfigElement = defineEditor("luxury-button-card-editor", {
  schema: [
    { type: "grid", name: "", schema: [
      { name: "name", required: true, selector: { text: {} } },
      { name: "room", selector: { text: {} } },
    ] },
    { name: "secondary", selector: { text: {} } },
    { name: "icon", selector: ICON_SELECTOR },
    { name: "tap_action", selector: { ui_action: {} } },
    { name: "hold_action", selector: { ui_action: {} } },
    { type: "grid", name: "", schema: [
      {
        name: "layout",
        selector: { select: { mode: "dropdown", options: [
          { value: "row", label: "Riga" },
          { value: "tile", label: "Riquadro" },
        ] } },
      },
      { name: "compact", selector: { boolean: {} } },
    ] },
  ],
  labels: {
    name: "Nome",
    secondary: "Testo secondario (opzionale)",
    tap_action: "Azione al tocco",
    hold_action: "Azione alla pressione prolungata",
    layout: "Disposizione",
  },
});

/** A button that runs any Home Assistant action (scripts, scenes, "close all covers"…). */
export class LuxButtonCard extends LuxBaseCard<ButtonCardConfig> {
  static properties = { ...LuxBaseCard.properties, _fired: { state: true } };

  // Brief gold confirmation after the action has been sent
  declare private _fired: boolean;
  private _holdTimer?: number;
  private _feedbackTimer?: number;
  private _held = false;

  constructor() {
    super();
    this._fired = false;
  }

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        cursor: pointer;
        touch-action: manipulation;
        transition: border-color 0.4s var(--ease), transform 0.2s var(--ease), background 0.4s var(--ease);
      }
      .card:hover { border-color: var(--gold-edge); }
      .card:active { transform: scale(0.985); }
      .card:focus-visible { outline: none; border-color: var(--gold-edge); }
      .ico { width: 40px; height: 40px; color: var(--gold-hi); background: var(--gold-tint); }
      .text { flex: 1; min-width: 0; }
      .secondary { font-size: 12px; color: var(--muted); margin-top: 3px; transition: color 0.3s; }
      .chevron { width: 16px; height: 16px; color: var(--faint); flex: none; transition: transform 0.3s var(--ease), color 0.3s; }
      .card:hover .chevron { transform: translateX(2px); color: var(--muted); }
      .fired { border-color: var(--gold-edge); }
      .fired .ico {
        color: var(--on-gold);
        background: linear-gradient(135deg, var(--gold-hi), var(--gold));
        box-shadow: 0 0 24px rgba(232, 211, 166, 0.35);
      }
      .fired .secondary { color: var(--gold-hi); }

      /* Tile layout: icon on top, text below */
      :host([layout="tile"]) .card {
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        min-height: 104px;
        padding: 14px 16px;
      }
      :host([layout="tile"]) .chevron { display: none; }
      :host([layout="tile"]) .text { flex: none; width: 100%; }

      :host([compact]) .card { padding: 10px 14px; }
      :host([compact]) .ico { width: 34px; height: 34px; }
      :host([compact]) .card-sub { display: none; }
      :host([compact][layout="tile"]) .card { min-height: 84px; }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return {
      name: "Chiudi tutto",
      room: "Tapparelle",
      icon: "blinds_closed",
      tap_action: { action: "perform-action", perform_action: "cover.close_cover", target: {} },
    };
  }

  setConfig(config: ButtonCardConfig) {
    if (!config.name) throw new Error("Specifica un nome (`name`)");
    this._config = config;
  }

  getCardSize() {
    return this._config?.layout === "tile" ? 2 : 1;
  }

  getGridOptions() {
    return this._config?.layout === "tile" ? { columns: 3, min_columns: 3 } : { columns: 6, min_columns: 3 };
  }

  protected watchedEntities() {
    return [];
  }

  protected willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    this.setAttribute("layout", this._config?.layout ?? "row");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._holdTimer);
    clearTimeout(this._feedbackTimer);
  }

  // Home Assistant runs the action itself (including `confirmation:`), exactly
  // like for its built-in cards
  private _run(kind: "tap" | "hold") {
    const config = this._config!;
    const action = kind === "tap" ? config.tap_action : config.hold_action;
    if (!action || action.action === "none") return;
    this.dispatchEvent(
      new CustomEvent("hass-action", {
        detail: { config: { tap_action: config.tap_action, hold_action: config.hold_action }, action: kind },
        bubbles: true,
        composed: true,
      }),
    );
    if (action.confirmation) return; // feedback would show before the user confirms
    this._fired = true;
    clearTimeout(this._feedbackTimer);
    this._feedbackTimer = window.setTimeout(() => (this._fired = false), FEEDBACK_MS);
  }

  private _down() {
    this._held = false;
    if (!this._config?.hold_action) return;
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      this._run("hold");
    }, HOLD_MS);
  }

  private _click() {
    clearTimeout(this._holdTimer);
    if (!this._held) this._run("tap");
    this._held = false;
  }

  render() {
    if (!this._config) return null;
    const c = this._config;
    const secondary = this._fired ? "Fatto" : c.secondary;
    return html`
      <div
        class="card ${this._fired ? "fired" : ""}"
        role="button"
        tabindex="0"
        aria-label=${c.name}
        @pointerdown=${this._down}
        @pointerleave=${() => clearTimeout(this._holdTimer)}
        @click=${this._click}
        @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._run("tap"))}
        @contextmenu=${(e: Event) => c.hold_action && e.preventDefault()}
      >
        <span class="ico">${renderIcon(c.icon ?? "power")}</span>
        <div class="text">
          ${c.room ? html`<p class="card-sub">${c.room}</p>` : null}
          <h2 class="card-title">${c.name}</h2>
          ${secondary ? html`<div class="secondary">${secondary}</div>` : null}
        </div>
        <svg class="chevron icon" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
      </div>
    `;
  }
}
