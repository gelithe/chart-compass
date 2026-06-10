# Chart Compass

Your natal chart, alive in conversation.

A single-file astrology companion. Enter your birth data once — the app calculates your full natal chart in the browser (planets, Chiron, true lunar node, Placidus houses, aspects) and opens a conversation with an AI companion that knows your specific chart, plus the live sky: current transits, retrogrades, and the exact aspects they make to your natal placements.

## Try it

Open the app, enter your name, birth date, time, and city, and add an Anthropic API key (yours, or one shared with you for the trial). Everything — your birth data, your chart, your key, your conversations — stays in your own browser. The only network calls are to the astronomy libraries, the city lookup, and the Anthropic API for the conversation itself. There is no server and no database.

## How the chart is calculated

- Planetary positions: [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT)
- Chiron: Moshier ephemeris via [ephemeris](https://www.npmjs.com/package/ephemeris) (MIT)
- True lunar node: computed from the Moon's orbital state
- Houses: Placidus, computed from birth data (equal houses above polar latitudes)
- Historical timezones: the browser's IANA timezone database
- City lookup: [Open-Meteo geocoding](https://open-meteo.com/) (free, no key)

Positions are tropical and geocentric, accurate to the arcminute.

## Running locally

It is one HTML file. Open `index.html` in a browser, or serve it with any static server.
