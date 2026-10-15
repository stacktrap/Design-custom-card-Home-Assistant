// Fake Home Assistant for developing the cards without a real instance.
import type { HassEntity, HomeAssistant } from "../src/shared/types";

type Listener = (hass: HomeAssistant) => void;

const light = (id: string, name: string, on: boolean, pct = 100, dimmable = true): HassEntity => ({
  entity_id: id,
  state: on ? "on" : "off",
  attributes: {
    friendly_name: name,
    supported_color_modes: dimmable ? ["brightness"] : ["onoff"],
    brightness: on && dimmable ? Math.round((pct / 100) * 255) : null,
  },
});

let states: Record<string, HassEntity> = Object.fromEntries(
  [
    light("light.lampadario", "Lampadario", true, 80),
    light("light.piantana", "Piantana", true, 45),
    light("light.strip_led", "Strip LED", false),
    light("light.applique", "Applique", true, 100, false),
    light("light.plafoniera", "Plafoniera", true, 100, false),
    light("light.comodino", "Comodino", true, 40),
    light("light.lampada_studio", "Lampada da tavolo", true, 65),
    { entity_id: "switch.presa_lampada", state: "off", attributes: { friendly_name: "Presa lampada" } },
    { entity_id: "light.giardino", state: "unavailable", attributes: { friendly_name: "Giardino" } },
  ].map((e) => [e.entity_id, e]),
);

const listeners: Listener[] = [];

const update = (id: string, patch: (e: HassEntity) => HassEntity) => {
  const current = states[id];
  if (!current || current.state === "unavailable") return;
  states = { ...states, [id]: patch(current) };
};

const setOn = (e: HassEntity, on: boolean, pct?: number): HassEntity => {
  const dimmable = e.attributes.supported_color_modes?.includes("brightness");
  const prev = typeof e.attributes.brightness === "number" ? e.attributes.brightness : 255;
  return {
    ...e,
    state: on ? "on" : "off",
    attributes: {
      ...e.attributes,
      brightness: on && dimmable ? (pct !== undefined ? Math.round((pct / 100) * 255) : prev) : null,
    },
  };
};

const hass = (): HomeAssistant => ({
  states,
  async callService(domain, service, data = {}) {
    console.log("callService", domain, service, data);
    const ids = ([] as string[]).concat(data.entity_id as string | string[]);
    // Simulate network latency, like a real instance
    await new Promise((r) => setTimeout(r, 250));
    for (const id of ids) {
      update(id, (e) => {
        if (service === "toggle") return setOn(e, e.state !== "on");
        if (service === "turn_off") return setOn(e, false);
        return setOn(e, true, data.brightness_pct as number | undefined);
      });
    }
    const next = hass();
    listeners.forEach((l) => l(next));
  },
});

export const connect = (listener: Listener) => {
  listeners.push(listener);
  listener(hass());
};
