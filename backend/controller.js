import express from 'express'
import cors from 'cors'

import {db} from './setup.js'
import * as courses from './courses.js';
import * as location from './location.js';
import * as majors from './majors.js';
import * as terms from './terms.js';
import * as token from './token.js';


const app = express()
app.use(express.json())
app.use(cors())

app.get('/courses', (req, res) => {
  let query_strings = req.query;
  let keys = Object.keys(query_strings);
  // console.log("query_strings: ", query_strings)

  if (keys.length === 0) {
    handleCoursesResponse(courses.retrieveAllCourses(), req, res);
    return;
  }

  if (keys.indexOf('mycourses') > -1) {
    if (query_strings['mycourses'] === "") {
      handleCoursesResponse(courses.retrieveAllCourses(), req, res);
      return;
    }
    handleCoursesResponse(courses.retrieveCoursesByCRN(query_strings['mycourses']), req, res);
    return;
  }

  if (keys.indexOf('code') > -1 && query_strings['code'] !== "") {
    handleCoursesResponse(courses.retrieveCoursesByKeyword(query_strings['code']), req, res);
    return;
  }

  if (keys.indexOf('crn') > -1 && query_strings['crn'] !== "") {
    handleCoursesResponse(courses.retrieveCourseByCRN(query_strings['crn']), req, res);
    return;
  }
});

app.get('/map', (req, res) => {
  // const query_strings = req.query;
  // const keys = Object.keys(query_strings);

  // if (keys.length == 0) {
  //   console.log("no query string keys");
  // }

  location.fetchAllLocations()
    .then(locations => {
      if (locations !== null) {
        console.log(`All locations were retrieved from the collection.`);
        res.json(locations);
      } else {
        res.status(404).json({ Error: 'There were no locations found on this server.' });
      }         
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ Error: 'Server could not process or recognize the retrieval request.' });
    });
});



app.listen(8800, () => {
  console.log("Server running on port 8800.")
})


function handleCoursesResponse(func, req, res) {
  func
    .then(courses => {
      if (courses !== null) {
        console.log(`All courses were retrieved from the collection.`);
        res.json(courses);
      } else {
        res.status(404).json({ Error: 'There were no courses found on this server.' });
      }         
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ Error: 'Server could not process or recognize the retrieval request.' });
    });
}

