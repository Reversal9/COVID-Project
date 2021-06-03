const covid_api_url = 'https://api.covid19api.com/'

async function fetchRequest(url){
    const response = await fetch(url)
    return response.json()
}

const api_links = {
    summary(){
        return covid_api_url + 'summary'
    }
}

const covidApi = {
    async getSummary(){
        return await fetchRequest(api_links.summary())
    }
}

