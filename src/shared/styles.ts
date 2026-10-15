import { css } from "lit";

/**
 * Design tokens. Every value can be overridden from a Home Assistant theme
 * through the public `--lux-*` variables.
 */
export const tokens = css`
  :host {
    --card-top: var(--lux-card-top, #171614);
    --card-bottom: var(--lux-card-bottom, #11100f);
    --surface: var(--lux-surface, #1c1b18);
    --surface-hi: var(--lux-surface-hi, #24221f);
    --line: var(--lux-line, rgba(255, 240, 220, 0.07));
    --line-2: var(--lux-line-strong, rgba(255, 240, 220, 0.13));

    --text: var(--lux-text, #eee9e1);
    --muted: var(--lux-muted, #8c857a);
    --faint: var(--lux-faint, #57524b);

    --gold: var(--lux-accent, #c8a46a);
    --gold-hi: var(--lux-accent-hi, #e8d3a6);
    --gold-lo: var(--lux-accent-lo, #8a6c40);
    --gold-tint: var(--lux-accent-tint, rgba(200, 164, 106, 0.09));
    --gold-edge: var(--lux-accent-edge, rgba(200, 164, 106, 0.28));
    --on-gold: var(--lux-on-accent, #1a1714);

    --radius: var(--lux-radius, 28px);
    --radius-sm: var(--lux-radius-sm, 16px);
    --ease: cubic-bezier(0.22, 0.8, 0.24, 1);
    --font: var(--lux-font, "Manrope", -apple-system, "Helvetica Neue", sans-serif);

    display: block;
    font-family: var(--font);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }
`;

export const cardStyles = css`
  * { box-sizing: border-box; }
  button { font-family: inherit; color: inherit; }

  .card {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
    padding: 24px;
    background: linear-gradient(180deg, var(--card-top), var(--card-bottom));
    border: 1px solid var(--line);
    box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.035);
    user-select: none;
    -webkit-user-select: none;
    height: 100%;
    transition: border-color 0.4s var(--ease);
  }

  .card-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  .card-title { font-size: 15px; font-weight: 500; margin: 0; }
  .card-sub {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 5px;
  }
  .clickable { cursor: pointer; }

  /* Switch */
  .switch {
    width: 46px;
    height: 26px;
    border-radius: 99px;
    border: 1px solid var(--line-2);
    background: var(--surface);
    position: relative;
    cursor: pointer;
    padding: 0;
    flex: none;
    transition: background 0.4s var(--ease), border-color 0.4s var(--ease);
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--faint);
    transition: transform 0.4s var(--ease), background 0.4s var(--ease);
  }
  .switch[aria-checked="true"] {
    background: linear-gradient(135deg, var(--gold-hi), var(--gold));
    border-color: transparent;
  }
  .switch[aria-checked="true"]::after { transform: translateX(20px); background: var(--on-gold); }
  .switch:disabled { opacity: 0.4; cursor: default; }

  /* Round icon badge */
  .ico {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 0;
    padding: 0;
    flex: none;
    display: grid;
    place-items: center;
    color: var(--faint);
    background: rgba(255, 255, 255, 0.03);
    transition: all 0.4s var(--ease);
    --mdc-icon-size: 20px;
  }
  .ico svg { width: 20px; height: 20px; }
  .on .ico {
    color: var(--on-gold);
    background: linear-gradient(135deg, var(--gold-hi), var(--gold));
    box-shadow: 0 0 24px rgba(232, 211, 166, 0.35);
  }

  .icon { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }

  .num { font-weight: 200; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
  .unit { color: var(--gold); font-weight: 300; }

  .warning { color: var(--muted); font-size: 13px; }
`;
