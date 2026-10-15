import { LitElement, css, html } from "lit";
import type { HomeAssistant, LovelaceCardConfig } from "./types";

/** A field of Home Assistant's `ha-form` (selector-based schema). */
export type FormSchema =
  | { name: string; selector: Record<string, unknown>; required?: boolean; default?: unknown }
  | { type: "grid"; name: string; schema: FormSchema[] }
  | { type: "expandable"; name: string; title: string; flatten?: boolean; schema: FormSchema[] };

export interface EditorSpec {
  schema: FormSchema[];
  labels: Record<string, string>;
  /** Config → form data, when the YAML shape differs from the form shape. */
  toForm?: (config: LovelaceCardConfig) => Record<string, unknown>;
  /** Form data → config. `previous` lets the card keep options the form does not show. */
  fromForm?: (data: Record<string, unknown>, previous: LovelaceCardConfig) => LovelaceCardConfig;
}

// Fields shared by every card
export const COMMON_LABELS: Record<string, string> = {
  entity: "Entità",
  name: "Nome (opzionale)",
  room: "Stanza / sottotitolo (opzionale)",
  icon: "Icona",
  compact: "Versione compatta",
};

export const ICON_SELECTOR = {
  select: {
    mode: "dropdown",
    custom_value: true,
    options: [
      { value: "bulb", label: "Lampadina" },
      { value: "chandelier", label: "Lampadario" },
      { value: "ceiling", label: "Plafoniera" },
      { value: "floor", label: "Piantana" },
      { value: "table", label: "Lampada da tavolo" },
      { value: "spot", label: "Faretto" },
      { value: "strip", label: "Striscia LED" },
    ],
  },
};

/**
 * `ha-form` is lazy-loaded by Home Assistant: creating a built-in card's
 * editor once makes sure it (and the entity pickers) are defined.
 */
let haFormLoading: Promise<void> | undefined;
const loadHaForm = () =>
  (haFormLoading ??= (async () => {
    if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<any> }).loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
  })());

/** Generic visual editor: renders `ha-form` from a schema and fires `config-changed`. */
export class LuxCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _ready: { state: true },
  };

  declare hass?: HomeAssistant;
  declare private _config?: LovelaceCardConfig;
  declare private _ready: boolean;

  constructor(private spec: EditorSpec) {
    super();
    this._ready = !!customElements.get("ha-form");
  }

  static styles = css`
    :host { display: block; }
    .loading { color: var(--secondary-text-color); font-size: 14px; padding: 8px 0; }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (!this._ready) {
      loadHaForm()
        .catch(() => undefined)
        .then(() => customElements.whenDefined("ha-form"))
        .then(() => (this._ready = true));
    }
  }

  setConfig(config: LovelaceCardConfig) {
    this._config = config;
  }

  private _label = (field: { name: string }) =>
    this.spec.labels[field.name] ?? COMMON_LABELS[field.name] ?? field.name;

  private _changed(e: CustomEvent) {
    e.stopPropagation();
    if (!this._config) return;
    const data = { ...(e.detail.value as Record<string, unknown>) };
    let config = this.spec.fromForm
      ? this.spec.fromForm(data, this._config)
      : ({ ...this._config, ...data } as LovelaceCardConfig);
    // Leave optional fields out of the YAML instead of writing empty values
    config = Object.fromEntries(
      Object.entries(config).filter(([, v]) => v !== undefined && v !== "" && v !== null),
    ) as LovelaceCardConfig;
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  render() {
    if (!this._config || !this.hass) return null;
    if (!this._ready) return html`<div class="loading">Caricamento editor…</div>`;
    const data = this.spec.toForm ? this.spec.toForm(this._config) : this._config;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this.spec.schema}
        .computeLabel=${this._label}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }
}

/** Defines `<tag>` as an editor for the given spec (once). */
export const defineEditor = (tag: string, spec: EditorSpec) => {
  if (!customElements.get(tag)) {
    customElements.define(
      tag,
      class extends LuxCardEditor {
        constructor() {
          super(spec);
        }
      },
    );
  }
  return () => document.createElement(tag);
};
