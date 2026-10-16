import { LitElement, css, html } from "lit";
import { tokens } from "./styles";

/**
 * Full-screen overlay that shows another card (e.g. the full thermostat).
 * It is appended to <body> so no dashboard container can clip or offset it.
 */
export class LuxCardDialog extends LitElement {
  static properties = { _open: { state: true } };

  declare private _open: boolean;
  private _card?: HTMLElement;
  private _onClose?: () => void;

  constructor() {
    super();
    this._open = false;
  }

  static styles = [
    tokens,
    css`
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 16px;
        background: rgba(6, 5, 4, 0.62);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        opacity: 0;
        transition: opacity 0.3s var(--ease);
      }
      .panel {
        position: relative;
        width: min(380px, 100%);
        transform: translateY(14px) scale(0.97);
        transition: transform 0.35s var(--ease);
      }
      .open .backdrop { opacity: 1; }
      .open .panel { transform: none; }
      .close {
        position: absolute;
        top: -48px;
        right: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: var(--surface);
        color: var(--text);
        display: grid;
        place-items: center;
        cursor: pointer;
      }
      .close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
    `,
  ];

  /** Shows `card` in the dialog; `onClose` runs once it has been dismissed. */
  show(card: HTMLElement, onClose?: () => void) {
    this._card = card;
    this._onClose = onClose;
    document.body.appendChild(this);
    requestAnimationFrame(() => requestAnimationFrame(() => (this._open = true)));
    window.addEventListener("keydown", this._onKey);
    // The back button closes the dialog instead of leaving the dashboard
    history.pushState({ luxDialog: true }, "");
    window.addEventListener("popstate", this._onPop);
  }

  close() {
    if (!this.isConnected) return;
    if (history.state?.luxDialog) history.back();
    else this._dismiss();
  }

  private _dismiss() {
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("popstate", this._onPop);
    this._open = false;
    setTimeout(() => {
      this.remove();
      this._onClose?.();
    }, 300);
  }

  private _onKey = (e: KeyboardEvent) => e.key === "Escape" && this.close();
  private _onPop = () => this._dismiss();

  render() {
    return html`
      <div class=${this._open ? "open" : ""}>
        <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this.close()}>
          <div class="panel" role="dialog" aria-modal="true">
            <button class="close" aria-label="Chiudi" @click=${() => this.close()}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            ${this._card}
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("lux-card-dialog")) customElements.define("lux-card-dialog", LuxCardDialog);
