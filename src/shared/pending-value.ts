import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Optimistic value for sliders: shows what the user dragged to until
 * Home Assistant reports the same value (or a timeout expires), so the
 * readout does not jump back while the service call is in flight.
 */
export class PendingValue implements ReactiveController {
  private _value: number | null = null;
  private _dragging = false;
  private _timer?: number;

  constructor(private host: ReactiveControllerHost) {
    host.addController(this);
  }

  get active() {
    return this._value !== null;
  }

  drag(value: number) {
    this._value = value;
    this._dragging = true;
    this.host.requestUpdate();
  }

  commit(value: number) {
    this._value = value;
    this._dragging = false;
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      this._value = null;
      this.host.requestUpdate();
    }, 3000);
    this.host.requestUpdate();
  }

  /** Returns the value to display given the one reported by Home Assistant. */
  resolve(actual: number) {
    if (this._value !== null && !this._dragging && Math.abs(actual - this._value) <= 1) {
      this._value = null;
      clearTimeout(this._timer);
    }
    return this._value ?? actual;
  }

  hostDisconnected() {
    clearTimeout(this._timer);
  }
}
