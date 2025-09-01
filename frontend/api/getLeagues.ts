import axios from 'axios'

export async function getLeagues() {
    try {
        const res = await axios.get('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
        return res.data.leagues;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getLeagueTable(idLeague: string, season: string) {
    try {
        const res = await axios.get(`https://www.thesportsdb.com///api/v1/json/3/lookuptable.php?l=${idLeague}&s=${season}`)
        return res.data.table;
    } catch (error) {
        console.log(error)
        return null
    }

}


export async function getLeaguesEvents(idLeague: string) {
    try {
        const res = await axios.get(`https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=${idLeague}`)
        return res.data.events;

    } catch (err) {
        console.log(err)
        return null
    }
}