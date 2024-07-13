import { db, makeRequest } from './setup.js'
import handleToken from './token.js'


const LOCATIONS_URL = "https://api.oregonstate.edu/v1/locations"



async function fetchAllLocations() {
  const campus = `campus=corvallis`;
  const type = `type=building`;
  const pages = `page%5Bsize%5D=1000`;
  const query_string = `?${campus}&${type}&${pages}&pretty=true`
  const token = await handleToken();
  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json'
  };
  const payload = {
    method: 'GET',
    headers: headers,
  }

  const response = await makeRequest(LOCATIONS_URL + query_string, payload);
  const data = response["data"];

  const formattedData = [];
  for (let i=0; i<data.length; i++) {
    const attr = data[i]["attributes"];
    if (attr["latitude"] !== null) {
      formattedData.push(
        {
          name: attr["name"] || "none",
          short: attr["abbreviation"] || "none",
          lat: Number(attr["latitude"]) || 0,
          long: Number(attr["longitude"]) || 0,
          bldgID: attr["bldgID"] || "none",
        }
      )
    }
  }

  return formattedData;
}

async function fetchLocationByAbbr(abbr) {
  const campus = `campus=corvallis`;
  const type = `type=building`;
  const pages = `page%5Bsize%5D=1000`;
  const query_string = `?q=${abbr}&${campus}&${type}&${pages}&pretty=true`
  const token = await handleToken();
  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json'
  };
  const payload = {
    method: 'GET',
    headers: headers,
  }

  const response = await makeRequest(LOCATIONS_URL + query_string, payload);
  return response["data"];
}

// const res = await fetchAllLocations();
// console.log('res: ', res)

// const res = await fetchLocationByAbbr();
// console.log("res: ", res);

export { fetchAllLocations, fetchLocationByAbbr };