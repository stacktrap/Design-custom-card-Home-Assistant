import { html, svg, type SVGTemplateResult, type TemplateResult } from "lit";

/** Thin line icons drawn for the collection (24×24 grid). */
const ICONS: Record<string, SVGTemplateResult> = {
  bulb: svg`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`,
  chandelier: svg`<path d="M12 3v4M7 11a5 4 0 0 1 10 0M5 11h14l-2 4H7zM9 15v2M15 15v2M12 15v4"/>`,
  floor: svg`<path d="M8 3h8l2 6H6zM12 9v11M8 21h8"/>`,
  strip: svg`<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>`,
  ceiling: svg`<path d="M4 7h16M8 7l-2 6h12l-2-6M10 16.5l-.5 1.5M14 16.5l.5 1.5M12 17v2"/>`,
  spot: svg`<path d="M12 3v3M7 10l5-4 5 4-2 5H9zM9.5 18l-1 2M14.5 18l1 2M12 18v3"/>`,
  table: svg`<path d="M7 4h10l2 7H5zM12 11v7M8 20h8"/>`,
  flame: svg`<path d="M12 3c.5 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2.4 1.2-3.9 2.4-5 .1 1.6.8 2.6 1.8 3.1C11 9 11.2 6 12 3z"/>`,
  thermometer: svg`<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 9v7"/>`,
  blinds: svg`<path d="M4 4h16M5 4v12h14V4M5 8h14M5 12h14M12 16v3"/><circle cx="12" cy="20" r="1"/>`,
  blinds_open: svg`<path d="M4 4h16M5 4v4h14V4M12 18v-8M9 13l3-3 3 3"/>`,
  blinds_closed: svg`<path d="M4 4h16M5 4v14h14V4M5 8h14M5 12h14M5 15.5h14"/>`,
  power: svg`<path d="M12 3v8M7.5 6.2a7 7 0 1 0 9 0"/>`,
  scene: svg`<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>`,
  moon: svg`<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>`,
};

/**
 * Renders a built-in icon by name, or a Home Assistant icon when the
 * name starts with "mdi:" (e.g. "mdi:lamp").
 */
export const renderIcon = (name = "bulb"): TemplateResult => {
  if (name.includes(":")) return html`<ha-icon .icon=${name}></ha-icon>`;
  return html`<svg class="icon" viewBox="0 0 24 24">${ICONS[name] ?? ICONS.bulb}</svg>`;
};
