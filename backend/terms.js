import { db, makeRequest } from './setup.js'
import handleToken from './token.js'


const TERMS_URL = "https://api.oregonstate.edu/v1/terms"



async function handleTermData() {
  const term_data = await fetchTermData();
  // console.log("term_data: ", term_data);
  
  const formatted_term_data = await formatTermData(term_data);
  // console.log("formatted term: ", formatted_term_data);
  
  for (let i=0; i<formatted_term_data.length; i++) {
    let response = await storeTermData(formatted_term_data[i])
    console.log(`term ${i} response: `, response);
  }

  return formatted_term_data;
}

async function fetchTermData() {
  const query_string = "?page%5Bnumber%5D=1&page%5Bsize%5D=25&status=open"
  const token = await handleToken();
  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json'
  };
  const payload = {
    method: 'GET',
    headers: headers,
  }

  const response = await makeRequest(TERMS_URL + query_string, payload);
  return response;
}

async function formatTermData(term_data) {
  let response = await [];
  for (let i=0; i<term_data["data"].length; i++) {
    let data = term_data["data"][i];
    let attributes = data["attributes"];
    let term = {
      "id": data["id"],
      "description": attributes["description"],
      "startDate": attributes["startDate"],
      "endDate": attributes["endDate"],
      "registrationStartDate": attributes["registrationStartDate"],
      "registrationEndDate": attributes["registrationEndDate"],
    };
    response.push(term);
  }
  return response;
}

async function storeTermData(data) {
  let q = `INSERT IGNORE INTO terms (id, description, startDate, endDate, registrationStartDate, registrationEndDate) VALUES (?, ?, ?, ?, ?, ?)`;
  let values = [data["id"], data["description"], data["startDate"], data["endDate"], data["registrationStartDate"], data["registrationEndDate"]];
  return new Promise((resolve, reject) => {
    db.query(q, values, (err, res) => {
      if (err) reject(err);
      if (res["affectedRows"] === 0) {
        resolve(`database queried but not changed (${res["info"]})`)
      }
      resolve(`updated database (${res["info"]})`);
    })
  });  
}

// handleTermData();

export default handleTermData; 