import { db, makeRequest } from './setup.js'



const COURSES_URL = "https://classes.oregonstate.edu/api/?page=fose&route=search"



const retrieveAllCourses = async () => {
  // const q = "SELECT DISTINCT title FROM courses";
  const q = "SELECT * FROM courses WHERE title IN (SELECT max(title) FROM courses GROUP BY title)";
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      resolve(res)
    });
  });
}

const retrieveCoursesByKeyword = async (keyword) => {
  const q = `SELECT * FROM courses WHERE code LIKE '%${keyword}%'`;
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      console.log(res);
      resolve(res)
    });
  });
}

const retrieveCourseByCRN = async (crn) => {
  const q = `SELECT * FROM courses WHERE crn=${crn}`;
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      resolve(res)
    });
  });
}

const retrieveCoursesByTerm = async (term) => {
  // add term formatting bc fall 2024 -> 202501
  const q = `SELECT * FROM courses WHERE srcdb=${term}`;
  return new Promise((resolve, reject) => {
    db.query(q, (err, res) => {
      if (err) reject(err);
      resolve(res)
    });
  });
}



async function fetchCoursesByKeyword(keyword) {
  const requestBody = {
    other: {
      srcdb: "999999"
    },
    criteria: [
      {
        field: "alias",
        value: keyword
      }
    ]
  };

  let courses = await fetchCourseHelper(requestBody);
  courses = courses["results"];
  let response = "";
  for (let i=0; i<courses.length; i++) {
    let db_response = await storeCourse(courses[i]);
    response += `course ${i} response:  ${db_response}\n`;
  }
  return response;
}

async function fetchCourseByCRN(crn) {
  const requestBody = {
    other: {
      srcdb: "999999"
    },
    criteria: [
      {
        field: "crn",
        value: crn
      }
    ]
  };
  const course = await fetchCourseHelper(requestBody);
  const response = await storeCourse(course["results"][0])
  return response;
}

async function fetchCoursesByTerm(term) {
  const requestBody = {
    other: {
      srcdb: "999999"
    },
    criteria: [
      {
        field: "srcdb",
        value: term
      },
      {
        field: "stat",
        value: "A",
      }
    ]
  };

  let courses = await fetchCourseHelper(requestBody);
  courses = courses["results"];
  for (let i=0; i<courses.length; i++) {
    let db_response = await storeCourse(courses[i]);
  }
  let response = `updated database with ${courses.length} entries`
  return response;
}

async function fetchCourseHelper(requestBody) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const payload = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  }

  const response = await makeRequest(COURSES_URL, payload);
  return response;
}

async function storeCourse(course) {
  if (course["title"][0] === "*") {
    course["title"] = course["title"].substring(1);
  }
  const q = `INSERT IGNORE INTO courses (crn, title, code, sectionNo, srcdb, instructor, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [course["crn"], course["title"], course["code"], course["no"], course["srcdb"], course["instr"], course["start_date"], course["end_date"]];
  return new Promise((resolve, reject) => {
    db.query(q, values, (err, res) => {
      if (err) reject(err);
      if (res["affectedRows"] === 0) {
        resolve(`database queried but not changed (${res["info"]})`)
      }
      resolve(`updated database (${res["info"]})`);
    });
  });
}

// console.log(await fetchCoursesByKeyword("cs 101"))
// console.log(await fetchCourseByCRN("15512"))
// console.log(await fetchCoursesByTerm("202501"))

export { fetchCoursesByKeyword, fetchCourseByCRN, fetchCoursesByTerm, retrieveAllCourses, retrieveCoursesByKeyword, retrieveCourseByCRN, retrieveCoursesByTerm };