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
        return covid_api_url + 'country/' + country + '/status/' + status
    },
    countries(){
        return covid_api_url + 'countries'
    }
}

const covidApi = {
    async getSummary(){
        return await fetchRequest(api_links.summary())
    },
    async getCountryData(country, status){
        return await fetchRequest(api_links.countryData(country, status))
    },
    async getCountries(){
        return await fetchRequest(api_links.countries())
    }
}

