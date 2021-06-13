var ctx = document.getElementById('line_chart').getContext('2d')
var line_chart

window.onload = async () => {
    console.log('ready...')
    /* Input for location of data */
    let location = 'Global'
    loadData(location)
    await initializeCountrySelect()
}

async function loadSummary(country) {
    let summaryData = await covidApi.getSummary()
    console.log(summaryData)
    let summary = summaryData.Global
    console.log(summary);
    if (!(country === 'Global')) {
        summary = summaryData.Countries.filter(e => e.Slug === country)[0]
    }
    showTotalConfirmed(summary.TotalConfirmed)
    showTotalRecovered(summary.TotalRecovered)
    showTotalDeaths(summary.TotalDeaths)
    showNewConfirmed(summary.NewConfirmed)
    showNewRecovered(summary.NewRecovered)
    showNewDeaths(summary.NewDeaths)
}

async function loadCountryData(country) {
    let confirmed
    let recovered
    let deaths
    let countryData = {
        confirmed: [],
        recovered: [],
        deaths: [],
        dates: []
    }
    if (!(country === 'Global')) {
        confirmed = await covidApi.getCountryData(country, 'confirmed')
        console.log(confirmed);
        recovered = await covidApi.getCountryData(country, 'recovered')
        deaths = await covidApi.getCountryData(country, 'deaths')

        confirmed.forEach(element => {
            countryData.confirmed.push(element.Cases)
            countryData.dates.push(element.Date.substr(0, 10))
        });
        recovered.forEach(element => {
            countryData.recovered.push(element.Cases)
        });
        deaths.forEach(element => {
            countryData.deaths.push(element.Cases)
        });
    } else {
        world_data = await covidApi.getWorldData()
        world_data.sort((a, b) => new Date(a.Date) - new Date(b.Date))
        console.log(world_data);
        world_data.forEach(element => {
            countryData.confirmed.push(element.TotalConfirmed)
            countryData.recovered.push(element.TotalRecovered)
            countryData.deaths.push(element.TotalDeaths)
            countryData.dates.push(element.Date.substr(0, 10))
        })
    }
    return countryData
}

async function loadData(country) {
    await loadSummary(country)
    await initializeLineChart(country)
}

async function initializeLineChart(country) {
    let data = await loadCountryData(country)
    line_chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Confirmed',
                data: data.confirmed,
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
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Line chart of cases over time',
                    color: '#2f3640',
                    padding: 20,
                    font: {
                        family: "'Montserrat', sans-serif",
                        size: 24
                    }

                },
                tooltip: {
                    intersect: false,
                    mode: 'index'
                }
            },
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

/* Get list of all countries */
async function getCountries() {
    const countriesData = await covidApi.getCountries()
    return countriesData
}

function getAvaliableCountries(summaryData) {
    countries = []
    summaryData.Countries.forEach(country => {
        countries.push(country.Country)
    })
    return countries.sort();
}
/* Initialize Country Select */
async function initializeCountrySelect() {
    countriesNames = await getCountries()
    summary = await covidApi.getSummary()
    countries = getAvaliableCountries(summary)

    const optionsContainer = document.querySelector('.options_container')
    countries.forEach(country => {

        const inputTag = document.createElement('input')
        inputTag.setAttribute('type', 'radio')
        inputTag.setAttribute('id', country)
        inputTag.classList.add('radio')

        const labelTag = document.createElement('label')
        labelTag.setAttribute('for', country)
        labelTag.innerHTML = country

        const option = document.createElement('div')
        option.classList.add('option')

        option.appendChild(inputTag)
        option.appendChild(labelTag)

        optionsContainer.appendChild(option)

    })

    countrySelectFunction()
}

/* Country Select functionality*/
function countrySelectFunction() {
    const selected = document.querySelector('.selected')
    const optionsContainer = document.querySelector('.options_container')
    const searchBox = document.querySelector(".search_box input")
    const optionsList = document.querySelectorAll(".option")

    selected.addEventListener("click", () => {
        optionsContainer.classList.toggle('active');
        console.log("Select Clicked")
        searchBox.value = ''
        filterList('')

        if (optionsContainer.classList.contains('active')) {
            searchBox.focus()
        }
    })

    optionsList.forEach(element => {

        element.addEventListener("click", () => {
            console.log(element.textContent)
            selected.innerHTML = element.querySelector("label").innerHTML
            optionsContainer.classList.remove("active")
            let location
            countriesNames.forEach(item => {
                if (element.textContent === item.Country) {
                    location = item.Slug
                    
                }
            })
            if (location == null)
            {
                location = 'Global'
            }
            console.log(location);

            loadData(location)
            line_chart.destroy()
        })
    })

    searchBox.addEventListener("keyup", event => {
        console.log('key clicked');
        filterList(event.target.value)
    })

    const filterList = searchTerm => {
        searchTerm = searchTerm.toLowerCase()
        optionsList.forEach(option => {
            let label = option.firstElementChild.nextElementSibling.innerHTML.toLowerCase() /* access text in label tag */
            /* Check if searchTerm is in label */
            if (label.indexOf(searchTerm) != -1) {
                option.style.display = 'block'
            } else {
                option.style.display = 'none'
            }
        })
    }
}




