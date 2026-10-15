# Luxury Cards

Custom card minimaliste per Home Assistant: tema scuro, accento oro, tipografia sottile.

| Card | Tipo | Stato |
|---|---|---|
| Gruppo luci | `custom:luxury-light-group-card` | ✅ |
| Luce singola | `custom:luxury-light-card` | ✅ |
| Dimmer | `custom:luxury-dimmer-card` | ✅ |
| Riscaldamento | `custom:luxury-thermostat-card` | ✅ |
| Tapparella | `custom:luxury-cover-card` | ✅ |
| Energia | `custom:luxury-energy-card` | ✅ |

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

### Riscaldamento
```yaml
type: custom:luxury-thermostat-card
entity: climate.soggiorno
room: Soggiorno                         # opzionale
name: Riscaldamento                     # opzionale
humidity_entity: sensor.umidita_soggiorno  # opzionale, se il termostato non ha l'umidità
min: 16                                 # opzionali: di default letti dall'entità
max: 28
step: 0.5
```
Trascina l'arco o usa −/+ (la richiesta parte quando smetti di premere). L'interruttore alterna `heat` / `off`; cambiare la temperatura da spento riaccende il riscaldamento.

### Tapparella
```yaml
type: custom:luxury-cover-card
entity: cover.camera
room: Camera            # opzionale
presets: [25, 50, 75]   # opzionale, pulsanti "Apertura N%"
```
Trascina la finestra in verticale per scegliere la posizione. Se la tapparella non supporta la posizione restano solo su/stop/giù.

### Energia
```yaml
type: custom:luxury-energy-card
title: Energia
room: Casa
entities:
  home: sensor.consumo_casa             # potenza istantanea (W o kW)
  solar: sensor.produzione_fv           # opzionale
  grid: sensor.potenza_rete             # opzionale: + prelievo, − immissione
  battery: sensor.potenza_batteria      # opzionale: + in carica
  battery_soc: sensor.batteria_percentuale  # opzionale
  consumption_today: sensor.energia_consumata_oggi  # opzionale (kWh)
  production_today: sensor.energia_prodotta_oggi    # opzionale (kWh)
  grid_import_today: sensor.energia_prelevata_oggi  # opzionale, per l'autonomia
invert_grid: false      # opzionale, se il tuo sensore usa il segno opposto
invert_battery: false
history: true           # grafico del consumo di oggi (richiede entities.home)
```
Se manca uno tra `home` e `grid`, viene calcolato dagli altri valori. L'autonomia è `1 − prelievo / consumo` della giornata.

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
