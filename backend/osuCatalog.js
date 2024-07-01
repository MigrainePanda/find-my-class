import axios from 'axios'
import cheerio, { text } from 'cheerio'
import puppeteer from 'puppeteer';

const BASE_URL = "https://catalog.oregonstate.edu/courses/"




function formatMajors(fullText) {
  let list = fullText.split("\n");
  list = list.slice(4)
  
  let res = {}
  for (let i=0; i<list.length; i++) {
    if (i % 2) {
      continue;
    }
    let letter = list[i];
    let majors = list[i+1];

    majors = (majors.slice(0, majors.length-1)).split(")").map(str => {
      if (str.length == 0) {
        return;
      }
      return str + ")";
    })

    let majors_dict = {};
    for (let i=0; i<majors.length; i++) {
      let text = majors[i];
      let idx = text.indexOf("(");
      let course_name = text.substring(0, idx-1);
      let course_abbr = text.substring(idx+1, text.length-1);
      let key = course_name + ", " + course_abbr;
      majors_dict[key] = {};
    }
    res[letter] = majors_dict;
  }
  return res;
}

async function getMajors() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(BASE_URL);
  await page.setViewport({width: 1080, height: 1024});

  const selector = await page
    .locator('.az_sitemap')
    .waitHandle();
  const fullText = await selector?.evaluate(el => el.textContent);

  await browser.close();

  return formatMajors(fullText)
}

getMajors()
  .then(result => {
    console.log(result)
  })
  .catch(err => console.log(err));


  
// getMajors()
//   .then(result => {
//     console.log(result)
//   })
//   .catch(err => console.log(err));





// async function scrapeSite() {
// 	const data = await axios.get(BASE_URL);
//   const $ = cheerio.load(data);


// 	const all_text = $('div.az_sitemap').find("ul").find('li').find('a').text();
//   let text_split = all_text.split(')');
//   text_split.shift();
//   text_split.pop();

//   console.log($('div.az_sitemap'))
  

//   const dict = {};
//   for (let i=0; i<text_split.length; i++) {
//     text_split[i] += ")";
//     const class_name = text_split[i];
//     dict[class_name] = { id: i };
//   }
  
// 	return dict;
// }

// scrapeSite().then(result => {
//   console.log(result)
// }).catch(err => console.log(err));




