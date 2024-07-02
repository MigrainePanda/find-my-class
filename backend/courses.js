import { db, makeRequest } from './setup.js'



const COURSES_URL = "https://classes.oregonstate.edu/api/?page=fose&route=search"



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

  const courses = await fetchCourseHelper(requestBody);
  return courses;
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
  return course;
}

async function fetchCourseByTerm(term) {
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
  const course = await fetchCourseHelper(requestBody);
  return course;
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

// console.log(await fetchCourseByCRN("15512"))

export { fetchCoursesByKeyword, fetchCourseByCRN, fetchCourseByTerm };