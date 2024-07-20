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
  let queryStrings = req.query;
  let keys = Object.keys(queryStrings);
  // console.log("queryStrings: ", queryStrings)

  if (keys.length === 0) {
    handleCoursesResponse(courses.retrieveAllCourses(), req, res);
    return;
  }

  if (keys.indexOf('mycourses') > -1) {
    if (queryStrings['mycourses'] === "") {
      handleCoursesResponse(courses.retrieveAllCourses(), req, res);
      return;
    }
    handleCoursesResponse(courses.retrieveCoursesByCRN(queryStrings['mycourses']), req, res);
    return;
  }

  if (keys.indexOf('code') > -1 && queryStrings['code'] !== "") {
    handleCoursesResponse(courses.retrieveCoursesByKeyword(queryStrings['code']), req, res);
    return;
  }

  if (keys.indexOf('crn') > -1 && queryStrings['crn'] !== "") {
    handleCoursesResponse(courses.retrieveCourseByCRN(queryStrings['crn']), req, res);
    return;
  }
});

app.get('/map', (req, res) => {
  const queryStrings = req.query;
  const keys = Object.keys(queryStrings);

  if (keys.indexOf('mycourses') > -1 && queryStrings['mycourses'] !== "") {
    const coursesArr = queryStrings['mycourses'].split(',');

    (async () => {
      const allLocations = await location.fetchAllLocations();

      if (coursesArr.length === 0) {
        console.log("All possible locations retrieved.");
        res.json(allLocations);
      }
      let userLocations = await location.getUserLocations(coursesArr);
      console.log(userLocations);
      console.log("All user locations retrieved.");
      
      userLocations = userLocations.filter(function(element) {
        return element !== undefined;
      });
      userLocations = userLocations.map(function(element) {
        const crnidx = element.indexOf("|")-1;
        const crn = element.substring(0, crnidx);
        const shortidx = element.indexOf("in") + 3;
        const shortUpper = element.substring(shortidx, shortidx+4);
        for (let i=0; i<allLocations.length; i++) {
          if (shortUpper === allLocations[i]["short"]) {
            let temp = allLocations[i];
            temp["crn"] = crn;
            return temp;
          }
        }
        return crn + " | " + shortUpper;
      });

      // console.log("all: ", allLocations)
      console.log("data: ", userLocations);
      res.json(userLocations);
    })(coursesArr);
    
  }
});



app.listen(8800, () => {
  console.log("Server running on port 8800.");
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

