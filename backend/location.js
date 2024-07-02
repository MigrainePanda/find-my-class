import { db, makeRequest } from './setup.js'
import handleToken from './token.js'


const LOCATIONS_URL = "https://api.oregonstate.edu/v1/locations"



async function fetchAllLocations() {
  const query_string = "?campus=corvallis&page%5Bsize%5D=10&pretty=true"
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

async function fetchLocationByAbbr(abbr) {
  const query_string = `?q=${abbr}&campus=corvallis&page%5Bsize%5D=10&pretty=true`
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

// const res = await fetchLocationByAbbr();
// console.log("res: ", res);

export { fetchAllLocations, fetchLocationByAbbr };