const covid_api_url = 'https://api.covid19api.com/'

async function fetchRequest(url){
    const response = await fetch(url)
    return response.json()
}

const api_links = {
    summary(){
        return covid_api_url + 'summary'
    },
    countryData(country, status){
        console.log(covid_api_url + 'country/' + country + '/status/' + status)
        return covid_api_url + 'country/' + country + '/status/' + status
    }
}

const covidApi = {
    async getSummary(){
        return await fetchRequest(api_links.summary())
    },
    async getCountryData(country, status){
        return await fetchRequest(api_links.countryData(country, status))
    }
}

