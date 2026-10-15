import type { HassEntity, HomeAssistant } from "./types";

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Reads a numeric attribute, or undefined when missing or not a number. */
export const numAttr = (entity: HassEntity | undefined, key: string) => {
  const v = entity?.attributes[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
};

/** Numeric state of a sensor, or undefined when unavailable. */
export const numState = (entity?: HassEntity) => {
  const v = entity ? parseFloat(entity.state) : NaN;
  return Number.isNaN(v) ? undefined : v;
};

export const isOn = (entity?: HassEntity) => entity?.state === "on";

export const isUnavailable = (entity?: HassEntity) =>
  !entity || entity.state === "unavailable" || entity.state === "unknown";

export const entityName = (entity: HassEntity | undefined, override?: string) =>
  override ?? entity?.attributes.friendly_name ?? entity?.entity_id ?? "";

/** Brightness in percent (0–100), or 0 when the light is off. */
export const brightnessPct = (entity?: HassEntity) => {
  const b = entity?.attributes.brightness;
  return isOn(entity) && typeof b === "number" ? Math.max(1, Math.round((b / 255) * 100)) : 0;
};

/** True when the entity is a light that can be dimmed. */
export const supportsBrightness = (entity?: HassEntity) => {
  if (!entity || !entity.entity_id.startsWith("light.")) return false;
  const modes = entity.attributes.supported_color_modes;
  if (Array.isArray(modes)) return modes.some((m) => m !== "onoff");
  return typeof entity.attributes.brightness === "number";
};

export const toggle = (hass: HomeAssistant, entityId: string) =>
  hass.callService("homeassistant", "toggle", { entity_id: entityId });

export const turnOnOff = (hass: HomeAssistant, entityIds: string[], on: boolean) =>
  hass.callService("homeassistant", on ? "turn_on" : "turn_off", { entity_id: entityIds });

export const setBrightness = (hass: HomeAssistant, entityId: string, pct: number) =>
  hass.callService("light", "turn_on", { entity_id: entityId, brightness_pct: clamp(Math.round(pct), 1, 100) });

/** Opens the native Home Assistant more-info dialog. */
export const fireMoreInfo = (node: HTMLElement, entityId: string) =>
  node.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));

/** Calls `onMove` with the pointer event on press and while dragging; `onEnd` on release. */
export const startDrag = (
  e: PointerEvent,
  node: HTMLElement,
  onMove: (ev: PointerEvent) => void,
  onEnd?: (ev: PointerEvent) => void,
) => {
  node.setPointerCapture(e.pointerId);
  onMove(e);
  const move = (ev: PointerEvent) => onMove(ev);
  const up = (ev: PointerEvent) => {
    node.removeEventListener("pointermove", move);
    node.removeEventListener("pointerup", up);
    node.removeEventListener("pointercancel", up);
    onEnd?.(ev);
  };
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerup", up);
  node.addEventListener("pointercancel", up);
};
