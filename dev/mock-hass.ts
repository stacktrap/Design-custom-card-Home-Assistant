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

const sensor = (id: string, value: number, unit: string): HassEntity => ({
  entity_id: id,
  state: String(value),
  attributes: { unit_of_measurement: unit },
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
    {
      entity_id: "climate.soggiorno",
      state: "heat",
      attributes: {
        friendly_name: "Termostato soggiorno",
        hvac_modes: ["off", "heat"],
        hvac_action: "heating",
        min_temp: 16,
        max_temp: 28,
        target_temp_step: 0.5,
        temperature: 21.5,
        current_temperature: 20.4,
        current_humidity: 48,
      },
    },
    {
      entity_id: "cover.camera",
      state: "open",
      // 15 = open, close, set position, stop
      attributes: { friendly_name: "Tapparella", current_position: 65, supported_features: 15 },
    },
    sensor("sensor.home_power", 1840, "W"),
    sensor("sensor.solar_power", 3.2, "kW"),
    sensor("sensor.battery_power", 600, "W"),
    sensor("sensor.battery_soc", 82, "%"),
    sensor("sensor.energy_today", 12.4, "kWh"),
    sensor("sensor.solar_energy_today", 18.9, "kWh"),
    sensor("sensor.grid_import_today", 1.7, "kWh"),
  ].map((e) => [e.entity_id, e]),
);

const listeners: Listener[] = [];
const publish = () => {
  const next = hass();
  listeners.forEach((l) => l(next));
};

const update = (id: string, patch: (e: HassEntity) => HassEntity) => {
  const current = states[id];
  if (!current || current.state === "unavailable") return;
  states = { ...states, [id]: patch(current) };
};

const setAttrs = (id: string, attrs: Record<string, unknown>, state?: string) =>
  update(id, (e) => ({ ...e, state: state ?? e.state, attributes: { ...e.attributes, ...attrs } }));

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

// Climate: heats when the room is colder than the target
const refreshClimate = (id: string) => {
  const a = states[id].attributes;
  const off = states[id].state === "off";
  const heating = !off && (a.current_temperature as number) < (a.temperature as number);
  setAttrs(id, { hvac_action: off ? "off" : heating ? "heating" : "idle" });
};

// Cover: moves 2% every 120 ms toward the target, like a real motor
let coverTimer: number | undefined;
const moveCover = (id: string, target: number) => {
  clearInterval(coverTimer);
  const step = () => {
    const pos = states[id].attributes.current_position as number;
    if (pos === target) {
      clearInterval(coverTimer);
      setAttrs(id, {}, pos === 0 ? "closed" : "open");
    } else {
      const next = pos + Math.sign(target - pos) * Math.min(2, Math.abs(target - pos));
      setAttrs(id, { current_position: next }, target > pos ? "opening" : "closing");
    }
    publish();
  };
  coverTimer = window.setInterval(step, 120);
};

const handlers: Record<string, (id: string, data: Record<string, unknown>) => void> = {
  "homeassistant.toggle": (id) => update(id, (e) => setOn(e, e.state !== "on")),
  "homeassistant.turn_on": (id) => update(id, (e) => setOn(e, true)),
  "homeassistant.turn_off": (id) => update(id, (e) => setOn(e, false)),
  "light.turn_on": (id, d) => update(id, (e) => setOn(e, true, d.brightness_pct as number | undefined)),
  "climate.set_temperature": (id, d) => {
    setAttrs(id, { temperature: d.temperature }, (d.hvac_mode as string) ?? states[id].state);
    refreshClimate(id);
  },
  "climate.set_hvac_mode": (id, d) => {
    setAttrs(id, {}, d.hvac_mode as string);
    refreshClimate(id);
  },
  "cover.open_cover": (id) => moveCover(id, 100),
  "cover.close_cover": (id) => moveCover(id, 0),
  "cover.set_cover_position": (id, d) => moveCover(id, d.position as number),
  "cover.stop_cover": (id) => {
    clearInterval(coverTimer);
    setAttrs(id, {}, "open");
  },
};

// A plausible day of household consumption, in watts
const homeProfile = (hour: number) =>
  350 + 900 * Math.exp(-((hour - 8) ** 2) / 3) + 1400 * Math.exp(-((hour - 20) ** 2) / 5) + 120 * Math.sin(hour * 3.4);

const hass = (): HomeAssistant => ({
  states,
  async callService(domain, service, data = {}) {
    console.log("callService", domain, service, data);
    const handler = handlers[`${domain}.${service}`];
    // Simulate network latency, like a real instance
    await new Promise((r) => setTimeout(r, 250));
    for (const id of ([] as string[]).concat(data.entity_id as string | string[])) handler?.(id, data);
    publish();
  },
  async callWS<T>(message: Record<string, unknown>) {
    if (message.type !== "history/history_during_period") throw new Error(`WS non simulato: ${message.type}`);
    const start = new Date(message.start_time as string).getTime();
    const result: Record<string, Array<{ s: string; lu: number }>> = {};
    for (const id of message.entity_ids as string[]) {
      const changes = [];
      for (let t = start; t <= Date.now(); t += 5 * 60 * 1000) {
        const hour = (t - start) / 3_600_000;
        changes.push({ s: String(Math.round(homeProfile(hour))), lu: t / 1000 });
      }
      result[id] = changes;
    }
    return result as T;
  },
});

// Live sensors drift a little every 2 seconds
window.setInterval(() => {
  const jitter = (id: string, delta: number, min: number, max: number, digits = 0) => {
    const v = Math.min(max, Math.max(min, parseFloat(states[id].state) + (Math.random() - 0.5) * delta));
    update(id, (e) => ({ ...e, state: v.toFixed(digits) }));
  };
  jitter("sensor.home_power", 250, 1200, 2600);
  jitter("sensor.solar_power", 0.3, 2.4, 3.8, 2);
  jitter("sensor.battery_soc", 0.2, 0, 100, 1);
  publish();
}, 2000);

export const connect = (listener: Listener) => {
  listeners.push(listener);
  listener(hass());
};
