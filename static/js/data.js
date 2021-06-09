const COLORS = {
    confirmed: '#ff0000',
    recovered: '#008000',
    deaths: '#373c43',
}

let body = document.querySelector('body')
let all_time_chart, recover_rate_chart, death_rate_chart, population_chart

window.onload = async () => {
    console.log('ready...')
    /* Input for location of data */
    let location = 'south-africa'
    loadData(location)
}

async function loadSummary(country) {
    let summaryData = await covidApi.getSummary()
    console.log(summaryData)
    let summary = summaryData.Global
    if (!(country === 'Global')) {
        summary = summaryData.Countries.filter(e => e.Slug === country)[0]
    }
    console.log(summary);

    showTotalConfirmed(summary.TotalConfirmed)
    showTotalRecovered(summary.TotalRecovered)
    showTotalDeaths(summary.TotalDeaths)
    showNewConfirmed(summary.NewConfirmed)
    showNewRecovered(summary.NewRecovered)
    showNewDeaths(summary.NewDeaths)
}

async function loadCountryData(country) {
    const confirmed = await covidApi.getCountryData(country, 'confirmed')
    const recovered = await covidApi.getCountryData(country, 'recovered')
    console.log(recovered)
    const deaths = await covidApi.getCountryData(country, 'deaths')
    let countryData = {
        cases: [],
        recovered: [],
        deaths: [],
        dates: []
    }
    confirmed.forEach(element => {
        countryData.cases.push(element.Cases)
        countryData.dates.push(element.Date.substr(0, 10))
    });
    recovered.forEach(element => {
        countryData.recovered.push(element.Cases)
    });
    deaths.forEach(element => {
        countryData.deaths.push(element.Cases)
    });
    console.log(countryData)
    return countryData
}

async function loadData(country) {
    await loadSummary(country)
    await initializeLineChart(country);
}

async function initializeLineChart(country) {
    let data = await loadCountryData(country)
    var ctx = document.getElementById('line_chart').getContext('2d');
    var line_chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Confirmed',
                data: data.cases,
                fill: false,
                borderColor: 'rgb(255, 0, 0)',
                tension: 0.1
              },
              {
                label: 'Recovered',
                data: data.recovered,
                fill: false,
                borderColor: 'rgb(0, 128, 0)',
                tension: 0.1
              },
              {
                label: 'Deaths',
                data: data.deaths,
                fill: false,
                borderColor: 'rgb(55, 60, 67)',
                tension: 0.1
              }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            layout: {
                padding: {
                    left: 25,
                    right: 25
                }
            }
        }
    });
}

/* update html */
function showTotalConfirmed(data) {
    document.querySelector('#total_confirmed').textContent = data
}

function showTotalRecovered(data) {
    document.querySelector('#total_recovered').textContent = data
}

function showTotalDeaths(data) {
    document.querySelector('#total_deaths').textContent = data
}

function showNewConfirmed(data) {
    document.querySelector('#new_confirmed').textContent = data
}

function showNewRecovered(data) {
    document.querySelector('#new_recovered').textContent = data
}

function showNewDeaths(data) {
    document.querySelector('#new_deaths').textContent = data
}

/* Country Select */
const selected = document.querySelector('.selected')
const optionsContainer = document.querySelector('.options_container')

const optionsList = document.querySelectorAll(".option")
console.log(optionsList)
;
selected.addEventListener("click", () => {
    console.log("hi")
    optionsContainer.classList.toggle('active');
})

optionsList.forEach(element =>{

    element.addEventListener("click", () => {
        console.log("hi")
        selected.innerHTML = element.querySelector("label").innerHTML
        optionsContainer.classList.remove("active")
    })
})

