import { db, makeRequest } from './setup.js'
import handleToken from './token.js'


const MAJORS_URL = "https://api.oregonstate.edu/v1/academic-disciplines"



async function fetchMajors() {
  const query_string = `?major=true`;
  const token = await handleToken();
  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json'
  };
  const payload = {
    method: 'GET',
    headers: headers,
  }

  const response = await makeRequest(MAJORS_URL + query_string, payload);
  return response["data"];
}

// const res = await fetchMajors();
// console.log("res: ", res.length);

export { fetchMajors };