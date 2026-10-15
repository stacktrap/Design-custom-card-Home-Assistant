# Luxury Cards

Custom card minimaliste per Home Assistant: tema scuro, accento oro, tipografia sottile.

| Card | Tipo | Stato |
|---|---|---|
| Gruppo luci | `custom:luxury-light-group-card` | ✅ |
| Luce singola | `custom:luxury-light-card` | ✅ |
| Dimmer | `custom:luxury-dimmer-card` | ✅ |
| Riscaldamento | — | in arrivo |
| Tapparella | — | in arrivo |
| Energia | — | in arrivo |

## Installazione

### HACS (repository personalizzato)
1. HACS → menu ⋮ → *Repository personalizzati* → URL di questo repository, categoria **Dashboard**.
2. Installa **Luxury Cards** e ricarica il browser.

### Manuale
1. Copia `dist/luxury-cards.js` in `config/www/`.
2. *Impostazioni → Dashboard → ⋮ → Risorse* → aggiungi `/local/luxury-cards.js` come **Modulo JavaScript**.
3. Ricarica il browser (svuotando la cache).

## Configurazione

### Gruppo luci
```yaml
type: custom:luxury-light-group-card
title: Soggiorno
columns: 2          # opzionale, default 2
master: true        # opzionale, interruttore generale (default true)
entities:
  - light.lampadario
  - entity: light.piantana
    name: Piantana
    icon: floor
```
Tocco: accende/spegne · Pressione prolungata: apre il dettaglio dell'entità.

### Luce singola
```yaml
type: custom:luxury-light-card
entity: light.comodino
room: Camera        # opzionale
name: Comodino      # opzionale
icon: table         # opzionale
brightness: true    # opzionale: false nasconde lo slider
```
Lo slider compare in automatico solo se la luce supporta la luminosità. Funziona anche con `switch.*`.

### Dimmer
```yaml
type: custom:luxury-dimmer-card
entity: light.lampada_studio
room: Studio        # opzionale
name: Lampada       # opzionale
```

### Icone
Icone integrate: `bulb`, `chandelier`, `floor`, `table`, `ceiling`, `spot`, `strip`.
Puoi usare anche qualsiasi icona di Home Assistant, es. `icon: mdi:lamp`.

## Personalizzazione colori
Tutti i colori si possono sovrascrivere da un tema di Home Assistant:

```yaml
luxury:
  lux-accent: "#C8A46A"
  lux-accent-hi: "#E8D3A6"
  lux-accent-lo: "#8A6C40"
  lux-card-top: "#171614"
  lux-card-bottom: "#11100F"
  lux-text: "#EEE9E1"
  lux-radius: 28px
```

## Sviluppo
```bash
npm install
npm run dev     # anteprima su http://localhost:5173/dev/ con hass simulato
npm run build   # genera dist/luxury-cards.js
```

Struttura:
- `src/shared/` stili, icone, slider e logica comuni a tutte le card
- `src/cards/` una card per file
- `dev/` pagina di sviluppo con Home Assistant simulato
- `design/preview.html` mockup di design di riferimento
