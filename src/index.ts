import { LuxButtonCard } from "./cards/button-card";
import { LuxCoverCard } from "./cards/cover-card";
import { LuxDimmerCard } from "./cards/dimmer-card";
import { LuxEnergyCard } from "./cards/energy-card";
import { LuxLightCard } from "./cards/light-card";
import { LuxLightGroupCard } from "./cards/light-group-card";
import { LuxThermostatCard } from "./cards/thermostat-card";
import { LuxThermostatMiniCard } from "./cards/thermostat-mini-card";

const VERSION = "0.4.0";

const CARDS = [
  {
    tag: "luxury-light-group-card",
    cls: LuxLightGroupCard,
    name: "Luxury · Gruppo luci",
    description: "Le luci di una stanza in riquadri, con contatore e interruttore generale.",
  },
  {
    tag: "luxury-light-card",
    cls: LuxLightCard,
    name: "Luxury · Luce",
    description: "Una singola luce: acceso/spento e, se supportata, luminosità.",
  },
  {
    tag: "luxury-dimmer-card",
    cls: LuxDimmerCard,
    name: "Luxury · Dimmer",
    description: "Dimmer grande con slider della luminosità.",
  },
  {
    tag: "luxury-thermostat-card",
    cls: LuxThermostatCard,
    name: "Luxury · Riscaldamento",
    description: "Termostato solo riscaldamento con quadrante circolare.",
  },
  {
    tag: "luxury-cover-card",
    cls: LuxCoverCard,
    name: "Luxury · Tapparella",
    description: "Tapparella con finestra trascinabile, su/stop/giù e aperture rapide.",
  },
  {
    tag: "luxury-energy-card",
    cls: LuxEnergyCard,
    name: "Luxury · Energia",
    description: "Flusso solare, casa e rete, batteria, grafico di oggi e totali.",
  },
  {
    tag: "luxury-thermostat-mini-card",
    cls: LuxThermostatMiniCard,
    name: "Luxury · Riscaldamento mini",
    description: "Riga con temperatura attuale e impostata; al tocco apre il termostato completo.",
  },
  {
    tag: "luxury-button-card",
    cls: LuxButtonCard,
    name: "Luxury · Pulsante",
    description: "Pulsante per qualsiasi azione: chiudi tutte le tapparelle, spegni tutte le luci, scene…",
  },
];

for (const card of CARDS) {
  if (!customElements.get(card.tag)) customElements.define(card.tag, card.cls);
}

window.customCards = window.customCards ?? [];
for (const card of CARDS) {
  if (!window.customCards.some((c) => c.type === card.tag)) {
    window.customCards.push({ type: card.tag, name: card.name, description: card.description, preview: true });
  }
}

// Load the collection's typeface once per page
if (!document.querySelector("link[data-luxury-cards-font]")) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600&display=swap";
  link.dataset.luxuryCardsFont = "";
  document.head.appendChild(link);
}

console.info(`%c LUXURY CARDS %c v${VERSION} `, "background:#C8A46A;color:#1A1714;font-weight:600", "color:#C8A46A");
