import { css, html } from "lit";
import { LuxBaseCard } from "../shared/base-card";
import { clamp, entityName, fireMoreInfo, isUnavailable, numAttr, startDrag } from "../shared/helpers";
import { defineEditor } from "../shared/editor";
import { PendingValue } from "../shared/pending-value";
import type { LovelaceCardConfig } from "../shared/types";

export interface CoverCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  room?: string;
  /** Quick positions in percent of opening. */
  presets?: number[];
  compact?: boolean;
}

const getConfigElement = defineEditor("luxury-cover-card-editor", {
  schema: [
    { name: "entity", required: true, selector: { entity: { domain: "cover" } } },
    { type: "grid", name: "", schema: [
      { name: "name", selector: { text: {} } },
      { name: "room", selector: { text: {} } },
    ] },
    { name: "presets", selector: { text: {} } },
    { name: "compact", selector: { boolean: {} } },
  ],
  labels: { presets: "Aperture rapide in % (es. 25, 50, 75)" },
  // The form edits presets as text: "25, 50, 75"
  toForm: (c) => ({ ...c, presets: ((c.presets as number[] | undefined) ?? [25, 50, 75]).join(", ") }),
  fromForm: (data, prev) => {
    const presets = String(data.presets ?? "")
      .split(/[,;\s]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 100);
    return { ...prev, ...data, presets: presets.length ? presets : undefined };
  },
});

// Home Assistant CoverEntityFeature.SET_POSITION
const SUPPORT_SET_POSITION = 4;

/** Roller shutter with a draggable window, up/stop/down and quick positions. */
export class LuxCoverCard extends LuxBaseCard<CoverCardConfig> {
  private _position = new PendingValue(this);

  static styles = [
    ...LuxBaseCard.styles,
    css`
      .body { display: grid; grid-template-columns: 84px 1fr; gap: 18px; align-items: center; }
      .window {
        position: relative;
        height: 120px;
        border-radius: 12px;
        border: 1px solid var(--line-2);
        background: linear-gradient(180deg, #2b2620 0%, #1e1b17 60%, #171512 100%);
        overflow: hidden;
        cursor: ns-resize;
        touch-action: none;
      }
      .window.fixed { cursor: default; }
      .window::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--line-2);
      }
      .shutter {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: repeating-linear-gradient(180deg, #2e2b27 0 9px, #1c1a17 9px 10.5px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
        transition: height 0.3s linear;
      }
      .dragging .shutter { transition: none; }
      .shutter::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--gold-lo), var(--gold-hi), var(--gold-lo));
      }
      .info .num { font-size: 42px; line-height: 1; }
      .info .unit { font-size: 17px; }
      .state { color: var(--muted); font-size: 12px; margin: 4px 0 12px; }
      .controls { display: flex; gap: 8px; }
      .round-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .round-btn:hover { border-color: var(--gold-edge); background: var(--gold-tint); }
      .round-btn:active { transform: scale(0.94); }
      .round-btn:disabled { opacity: 0.4; cursor: default; }
      .round-btn svg { width: 16px; height: 16px; }
      .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
      .chip {
        border: 1px solid var(--line-2);
        background: transparent;
        color: var(--muted);
        font-size: 11.5px;
        padding: 6px 12px;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .chip:hover { color: var(--text); border-color: var(--gold-edge); }
      .chip.active { color: var(--on-gold); background: var(--gold); border-color: transparent; }
      .moving {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .moving::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 10px var(--gold);
        animation: pulse 2s infinite;
      }
      @keyframes pulse { 50% { opacity: 0.35; } }
      /* Compact: no window drawing, everything on one row */
      :host([compact]) .body { grid-template-columns: 1fr; }
      :host([compact]) .window { display: none; }
      :host([compact]) .info { display: flex; align-items: center; gap: 12px; }
      :host([compact]) .info .num { font-size: 30px; }
      :host([compact]) .state { display: none; }
      :host([compact]) .controls { margin-left: auto; }
      :host([compact]) .chips { display: none; }
      @container (max-width: 260px) {
        .body { grid-template-columns: 64px 1fr; gap: 12px; }
        .window { height: 100px; }
      }
    `,
  ];

  static getConfigElement = getConfigElement;

  static getStubConfig() {
    return { entity: "cover.example", room: "Camera" };
  }

  setConfig(config: CoverCardConfig) {
    if (!config.entity?.startsWith("cover.")) throw new Error("Specifica un'entità cover.*");
    this._config = config;
  }

  getCardSize() {
    return 4;
  }

  protected watchedEntities() {
    return this._config ? [this._config.entity] : [];
  }

  private _call(service: string, data: Record<string, unknown> = {}) {
    this.hass!.callService("cover", service, { entity_id: this._config!.entity, ...data });
  }

  // The shutter then follows the position reported while the cover moves
  private _setPosition(pos: number) {
    this._position.clear();
    this._call("set_cover_position", { position: pos });
  }

  private _onWindowDown = (e: PointerEvent) => {
    const win = e.currentTarget as HTMLElement;
    let last: number | null = null;
    win.classList.add("dragging");
    startDrag(
      e,
      win,
      (ev) => {
        const r = win.getBoundingClientRect();
        last = clamp(Math.round(100 - ((ev.clientY - r.top) / r.height) * 100), 0, 100);
        this._position.drag(last);
      },
      () => {
        win.classList.remove("dragging");
        if (last !== null) this._setPosition(last);
      },
    );
  };

  render() {
    if (!this._config || !this.hass) return null;
    const id = this._config.entity;
    const entity = this.hass.states[id];
    if (!entity) return this.renderWarning(`Entità non trovata: ${id}`);

    const unavailable = isUnavailable(entity);
    const features = numAttr(entity, "supported_features") ?? 0;
    const positionable = (features & SUPPORT_SET_POSITION) !== 0;
    const reported = numAttr(entity, "current_position") ?? (entity.state === "closed" ? 0 : 100);
    const pos = this._position.resolve(reported);
    const moving = entity.state === "opening" || entity.state === "closing";
    const presets = this._config.presets ?? [25, 50, 75];

    const state = unavailable
      ? "Non disponibile"
      : entity.state === "opening"
        ? "In apertura"
        : entity.state === "closing"
          ? "In chiusura"
          : pos === 0
            ? "Chiusa"
            : pos === 100
              ? "Aperta"
              : "Parzialmente aperta";

    return html`
      <div class="card">
        <div class="card-head">
          <div class="clickable" @click=${() => fireMoreInfo(this, id)}>
            ${this._config.room ? html`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${entityName(entity, this._config.name)}</h2>
          </div>
          ${moving ? html`<span class="moving">In movimento</span>` : null}
        </div>
        <div class="body">
          <div
            class="window ${positionable && !unavailable ? "" : "fixed"}"
            role="slider"
            aria-label="Posizione"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${pos}
            @pointerdown=${positionable && !unavailable ? this._onWindowDown : null}
          >
            <div class="shutter" style="height:${100 - pos}%"></div>
          </div>
          <div class="info">
            <div><span class="num">${pos}</span><span class="unit">%</span></div>
            <div class="state">${state}</div>
            <div class="controls">
              <button class="round-btn" aria-label="Apri" ?disabled=${unavailable} @click=${() => this._call("open_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
              </button>
              <button class="round-btn" aria-label="Stop" ?disabled=${unavailable} @click=${() => this._call("stop_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="1.5" /></svg>
              </button>
              <button class="round-btn" aria-label="Chiudi" ?disabled=${unavailable} @click=${() => this._call("close_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
        ${positionable && presets.length
          ? html`<div class="chips">
              ${presets.map(
                (p) => html`<button
                  class="chip ${pos === p ? "active" : ""}"
                  ?disabled=${unavailable}
                  @click=${() => this._setPosition(p)}
                >
                  Apertura ${p}%
                </button>`,
              )}
            </div>`
          : null}
      </div>
    `;
  }
}
