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
};

/**
 * Renders a built-in icon by name, or a Home Assistant icon when the
 * name starts with "mdi:" (e.g. "mdi:lamp").
 */
export const renderIcon = (name = "bulb"): TemplateResult => {
  if (name.includes(":")) return html`<ha-icon .icon=${name}></ha-icon>`;
  return html`<svg class="icon" viewBox="0 0 24 24">${ICONS[name] ?? ICONS.bulb}</svg>`;
};
