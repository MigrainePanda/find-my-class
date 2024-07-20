import { db, makeRequest } from './setup.js'
import handleToken from './token.js'
import puppeteer from 'puppeteer';


const LOCATIONS_URL = "https://api.oregonstate.edu/v1/locations"
const COURSES_URL = "https://classes.oregonstate.edu"


async function getUserLocations(crn_arr) {
  let data = [];
  for (let i=0; i<crn_arr.length; i++) {
    const location = await scrapeLocationByCRN(crn_arr[i]);
    await data.push(location);
  }
  return data;
}

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
    
    let short = attr["abbreviation"] || "none";
    if (short !== "none") {
      short = short.toUpperCase();
    }
    
    if (attr["latitude"] !== null) {
      formattedData.push(
        {
          name: attr["name"] || "none",
          short: short,
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

async function scrapeLocationByCRN(crn) {
  const time_delay = 1;
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto(COURSES_URL);
    await page.setViewport({width: 1920, height: 1080});
    
    await page.type("input[id='crit-keyword']", crn);
    await page.click("button[id='search-button']");
  
    const course = await page.locator('body > main > div.panel.panel--kind-results.panel--visible > div > div.panel__body > div.result.result--group-start > a');
    await course.click();
    await new Promise(r => setTimeout(r, time_delay));
    
    const meeting_selector = "body > main > div.panel.panel--2x.panel--kind-details.panel--visible > div > div.panel__body > div:nth-child(30) > div > div > div";
    await page.waitForSelector(meeting_selector, {timeout: 1000});
    const meeting_element = await page.$(meeting_selector);
    const meeting_times = await page.evaluate(el => el.textContent, meeting_element);
    
    await new Promise(r => setTimeout(r, time_delay));
    await browser.close();
    // console.log("mt: ", meeting_times);
    return crn + " | " + meeting_times;
  }
  catch {
    console.log("No meeting time found.");
  }

}

// const res = await fetchAllLocations();
// console.log('res: ', res)

// const res = await fetchLocationByAbbr();
// console.log("res: ", res);

// const res = await scrapeLocationByCRN('10182');
// console.log("res: ", res);

export { fetchAllLocations, fetchLocationByAbbr, scrapeLocationByCRN, getUserLocations };