import { countriesData } from "./countries-data.js"

window.onload = async () => {
    await initMap()
}

async function initMap() {
    const summaryData = await covidApi.getSummary()

    //add cases to countries Data
    countriesData.features.forEach(i => {
        summaryData.Countries.forEach(j => {
            if (i.properties.name === j.Country) {
                i.properties.cases = j.TotalConfirmed
            }
        })
        if (i.properties.cases == null) {
            i.properties.cases = null
        }
    });

    console.log(countriesData);

    var map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=9Nvo0KiD7dG0zZ8NTVtl', {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
    }).addTo(map);

    L.geoJson(countriesData).addTo(map);
}