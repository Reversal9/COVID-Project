var line_chart
var pie_recovery
var initial = true
var summaryData

const body = document.querySelector("body")
const loaderWrapper = document.querySelector('.loader_wrapper')

window.onload = async () => {
    console.log('ready...')
    /* Input for location of data */
    let location = 'Global'
    loadData(location)
}

async function initSummaryData(){
    summaryData = await covidApi.getSummary()
}

async function loadSummary(country) {
    console.log(summaryData)
    let summary = summaryData.Global
    //console.log(summary);
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
        //console.log(confirmed);
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
        //console.log(world_data);
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
    startLoading()

    await initSummaryData()
    await loadSummary(country)
    await initLine(country)
    await initPieRecovery(country)
    await initializeCountrySelect()
    
    endLoading()
}

function startLoading(){
    loaderWrapper.classList.add('loading')
    body.style.overflow = "hidden"
    body.scrollTo(0, 0)
}

function endLoading(){
    loaderWrapper.classList.remove('loading')
    body.style.overflow = "initial"
}

async function initLine(country) {
    let data = await loadCountryData(country)
    line_chart = new Chart(document.getElementById('line_chart').getContext('2d'), {
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
                        size: 32
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

async function initPieRecovery(country) {
    let data = summaryData.Global
    //console.log(data);
    if (!(country === 'Global')) {
        data = summaryData.Countries.filter(e => e.Slug === country)[0]
    }
    const recoveryRate =(data.TotalRecovered / data.TotalConfirmed * 100).toFixed(2);
    console.log(recoveryRate);

    ctx = document.getElementById('pie_recovery').getContext('2d')

    pie_recovery = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['confirmed', 'recovered'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [100 - recoveryRate, recoveryRate],
                    backgroundColor: [
                        'rgba(0, 0, 0, 0.1)',
                        'rgb(0, 128, 0)'
                    ]
                }
            ],
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Current recovery rate',
                    color: '#2f3640',
                    padding: 20,
                    font: {
                        family: "'Montserrat', sans-serif",
                        size: 18
                    }
                },
                legend: {
                    display: true
                }
            
            }
        },
    });
}

function resetChart(){
    line_chart.destroy()
    pie_recovery.destroy()
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

function getAvaliableCountries() {
    countries = []
    summaryData.Countries.forEach(country => {
        countries.push(country.Country)
    })
    return countries.sort();
}
/* Initialize Country Select */
async function initializeCountrySelect() {
    countriesNames = await getCountries()
    countries = getAvaliableCountries()

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

    if(initial){
        countrySelectFunction()
    }
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
            initial = false
            if (location == null) {
                location = 'Global'
            }
            //console.log(location);

            loadData(location)
            resetChart()
        })
    })

    searchBox.addEventListener("keyup", event => {
        //console.log('key clicked');
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




