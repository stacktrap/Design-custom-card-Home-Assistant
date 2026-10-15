import { LitElement, html, type PropertyValues } from "lit";
import { cardStyles, tokens } from "./styles";
import type { HomeAssistant, LovelaceCardConfig } from "./types";

/** Shared plumbing for all cards: hass/config handling and render throttling. */
export abstract class LuxBaseCard<C extends LovelaceCardConfig> extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  static styles = [tokens, cardStyles];

  // `declare` keeps class fields from shadowing Lit's reactive accessors
  declare hass?: HomeAssistant;
  declare protected _config?: C;

  abstract setConfig(config: C): void;

  /** Entity ids whose changes should re-render the card. */
  protected abstract watchedEntities(): string[];

  getCardSize() {
    return 2;
  }

  // Home Assistant pushes a new `hass` object on every state change in the
  // house: only re-render when one of our entities actually changed.
  protected shouldUpdate(changed: PropertyValues<this>) {
    if (changed.has("_config" as keyof LuxBaseCard<C>)) return true;
    const old = changed.get("hass" as keyof LuxBaseCard<C>) as HomeAssistant | undefined;
    if (!old || !this.hass) return true;
    return this.watchedEntities().some((id) => old.states[id] !== this.hass!.states[id]) || changed.size > 1;
  }

  protected renderWarning(message: string) {
    return html`<div class="card"><p class="warning">${message}</p></div>`;
  }
}
