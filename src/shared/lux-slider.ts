import { LitElement, css, html, type PropertyValues } from "lit";
import { clamp, startDrag } from "./helpers";

/**
 * Horizontal brightness slider.
 * Fires `value-changing` while dragging and `value-changed` on release.
 * Size is controlled with `--slider-height` and `--slider-radius`.
 */
export class LuxSlider extends LitElement {
  static properties = {
    value: { type: Number },
    disabled: { type: Boolean, reflect: true },
    off: { type: Boolean, reflect: true },
    marks: { type: Boolean },
    label: { type: String },
    _drag: { state: true },
    _hold: { state: true },
  };

  // `declare` keeps class fields from shadowing Lit's reactive accessors
  declare value: number;
  declare disabled: boolean;
  /** Dimmed look for a light that is off; still interactive. */
  declare off: boolean;
  declare marks: boolean;
  declare label: string;
  declare private _drag: number | null;
  // Value kept on screen after release until Home Assistant confirms it
  declare private _hold: number | null;
  private _holdTimer?: number;

  constructor() {
    super();
    this.value = 0;
    this.disabled = false;
    this.off = false;
    this.marks = false;
    this.label = "";
    this._drag = null;
    this._hold = null;
  }

  static styles = css`
    :host {
      display: block;
      outline: none;
    }
    .track {
      position: relative;
      height: var(--slider-height, 58px);
      border-radius: var(--slider-radius, 18px);
      background: var(--surface, #1c1b18);
      border: 1px solid var(--line, rgba(255, 240, 220, 0.07));
      overflow: hidden;
      cursor: ew-resize;
      touch-action: none;
    }
    :host(:focus-visible) .track { border-color: var(--gold-edge, rgba(200, 164, 106, 0.28)); }
    :host([disabled]) .track { cursor: default; }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: linear-gradient(90deg, var(--gold-lo, #8a6c40), var(--gold-hi, #e8d3a6));
      border-radius: inherit;
      transition: width 0.15s linear, opacity 0.4s;
    }
    .dragging .fill { transition: opacity 0.4s; }
    .active .fill { opacity: 1 !important; }
    :host([off]) .fill,
    :host([disabled]) .fill { opacity: 0.18; }
    .handle .fill::after {
      content: "";
      position: absolute;
      right: 12px;
      top: 50%;
      width: 2px;
      height: 40%;
      transform: translateY(-50%);
      border-radius: 2px;
      background: rgba(26, 23, 20, 0.55);
    }
    .marks {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      pointer-events: none;
    }
    .marks i { width: 1px; height: 8px; background: var(--line-2, rgba(255, 240, 220, 0.13)); }
  `;

  private get _shown() {
    return this._drag ?? this._hold ?? this.value;
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("value") && this._hold !== null && Math.abs(this.value - this._hold) <= 1) {
      this._hold = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
    this.setAttribute("role", "slider");
    this.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._onKey);
    clearTimeout(this._holdTimer);
  }

  protected updated() {
    this.setAttribute("aria-valuenow", String(Math.round(this._shown)));
    this.setAttribute("aria-valuemin", "1");
    this.setAttribute("aria-valuemax", "100");
    if (this.label) this.setAttribute("aria-label", this.label);
  }

  private _emit(type: "value-changing" | "value-changed", value: number) {
    this.dispatchEvent(new CustomEvent(type, { detail: { value }, bubbles: true, composed: true }));
  }

  private _commit(value: number) {
    this._hold = value;
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => (this._hold = null), 3000);
    this._emit("value-changed", value);
  }

  private _onPointerDown = (e: PointerEvent) => {
    if (this.disabled) return;
    const track = e.currentTarget as HTMLElement;
    const toValue = (ev: PointerEvent) => {
      const r = track.getBoundingClientRect();
      return clamp(Math.round(((ev.clientX - r.left) / r.width) * 100), 1, 100);
    };
    startDrag(
      e,
      track,
      (ev) => {
        this._drag = toValue(ev);
        this._emit("value-changing", this._drag);
      },
      () => {
        const v = this._drag;
        this._drag = null;
        if (v !== null) this._commit(v);
      },
    );
  };

  private _onKey = (e: KeyboardEvent) => {
    if (this.disabled) return;
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key];
    if (!step) return;
    e.preventDefault();
    this._commit(clamp(this._shown + step, 1, 100));
  };

  render() {
    const active = this._drag !== null || this._hold !== null;
    const width = this.disabled || (this.off && !active) ? 6 : Math.max(this._shown, 6);
    return html`
      <div
        class="track ${this.marks ? "handle" : ""} ${this._drag !== null ? "dragging" : ""} ${active ? "active" : ""}"
        @pointerdown=${this._onPointerDown}
      >
        ${this.marks ? html`<div class="marks"><i></i><i></i><i></i><i></i><i></i></div>` : null}
        <div class="fill" style="width:${width}%"></div>
      </div>
    `;
  }
}

if (!customElements.get("lux-slider")) customElements.define("lux-slider", LuxSlider);
