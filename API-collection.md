# API-Collection

Breve compendio delle API che ci servono.\

## Verso Home Assistant => GET smart switch

`url = "http://supervisor/core/api/states"`\
il return è un array di oggetti, di cui l'info per noi più importante in questo caso è l' `entity_id`. Se questa è `switch.*`, allora l'oggetto è uno smart switch.

## Verso Home Assistant => POST per settare temperatura

`url = "http://supervisor/core/api/states/<entity_id>"`\
`data = {"state": "on"}`
Bearer Tocken è la variabile di environment process.env.SUPERVISOR_TOKEN

## Da Home Assistant => GET

URL: /end-point?fuori-soglia=on
mandato ogni volta in cui la soglia è superata

URL: /end-point?fuori-soglia=off
mandato appena si rientra dal fuori soglia. Mandato una sola volta.
