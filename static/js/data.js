const COLORS = {
    confirmed: '#ff0000',
    recovered: '#008000',
    deaths: '#373c43',
}

const CASE_STATUS = {
    confirmed: 'confirmed',
    recovered: 'recovered',
    deaths: 'deaths',
}

let body = document.querySelector('body')
let all_time_chart, recover_rate_chart, death_rate_chart, population_chart

window.onload = async () => {
    console.log('ready...')
    /* Input for location of data */
    loadData('Switzerland')
}

async function loadSummary(country){
    let summaryData = await covidApi.getSummary()
    console.log(summaryData)
    let summary = summaryData.Global
    if (!(country === 'Global')){
        summary = summaryData.Countries.filter(e => e.Country === country)[0]
    }
    console.log(summary);
    showTotalConfirmed(summary.TotalConfirmed)
    showTotalRecovered(summary.TotalRecovered)
    showTotalDeaths(summary.TotalDeaths)
    showNewConfirmed(summary.NewConfirmed)
    showNewRecovered(summary.NewRecovered)
    showNewDeaths(summary.NewDeaths)
}

async function loadData(country){
    await loadSummary(country)
}

function showTotalConfirmed(data){
    document.querySelector('#total_confirmed').textContent = data
}

function showTotalRecovered(data){
    document.querySelector('#total_recovered').textContent = data
}

function showTotalDeaths(data){
    document.querySelector('#total_deaths').textContent = data
}

function showNewConfirmed(data){
    document.querySelector('#new_confirmed').textContent = data
}

function showNewRecovered(data){
    document.querySelector('#new_recovered').textContent = data
}

function showNewDeaths(data){
    document.querySelector('#new_deaths').textContent = data
}