import { config } from "dotenv";
import { db, makeRequest } from './setup.js'
config();


const OATH2_URL = "https://api.oregonstate.edu/oauth2/token"




async function handleToken() {
  const token_data = await getAccessToken();
  const access_token = token_data["access_token"]
  // console.log("access_token: ", access_token);

  const response = await storeToken(access_token);
  console.log("handle token: ", response)
  return access_token;
}

async function storeToken(access_token) {
  const q = `UPDATE tokens SET access_token='${access_token}' WHERE short_name='OATH2'`;
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      resolve(`updated database (${res["info"]})`);
    })
  });
}

async function checkTokenInDB() {
  const q = `IF EXISTS(SELECT 1 FROM tokens WHERE short_name='OATH2')`;
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      resolve(`token: ${res[0]}`);
    })
  });
}

async function getAccessToken() {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      accept: "application/json",
    };

    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("client_secret", process.env.CLIENT_SECRET);

    const response = await fetch(OATH2_URL, {
      method: "POST",
      headers: headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      console.log("response: ", response);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // console.log("token data: ", data);
    return data;
  } 
  catch (err) {
    console.error("Fetch error: ", err);
  }
}

// handleToken()

export default handleToken;