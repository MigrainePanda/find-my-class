import { useState, useEffect, useRef, useCallback } from "react";

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import "./CoursesPage.css";

function CoursesPage() {
    const topCheckbox = useRef(null);
    const [allCourses, setAllCourses] = useState([]);
    const [myCourses] = useState(() => {
        return (JSON.parse(localStorage.getItem("mycoursesLocal") || "[]")) || [];
    });

    const [checkedByCRN, setCheckedByCRN] = useState(new Set());
    const [numChecked, setNumChecked] = useState(checkedByCRN.size);
    const numCoursesDisplayedDefault = 5;  //30;
    const [numCoursesDisplayed, setNumCoursesDisplayed] = useState(numCoursesDisplayedDefault);

    const memoLoadCourses = useCallback(
        async () => {
            const params = new URLSearchParams((window.location.search).toString());
            const queryStrings = params.toString();

            // if (queryStrings === "") {
            //     return;
            // }

            const response = await fetch("http://localhost:8800/courses?" + queryStrings);
            const courses = await response.json();
            console.log("loadcourses: ", courses)
            
            setNumChecked(0);
            setNumCoursesDisplayed(Math.min(numCoursesDisplayedDefault, courses.length));
            const displayedCourses = courses.slice(0, numCoursesDisplayed);
            setAllCourses(displayedCourses);
            
            if (params.has("crn") || params.has("code")) {
                console.log("uodateed allcoruseslocal")
                localStorage.setItem("allcoursesLocal", JSON.stringify(displayedCourses));
            }
        }, 
        [numCoursesDisplayed]
    );

    useEffect(() => {
        memoLoadCourses();
    }, []);

    const handleOnChange = (crn) => {
        const updatedCheckedByCRN = new Set(checkedByCRN);
        if (updatedCheckedByCRN.has(crn)) {
            updatedCheckedByCRN.delete(crn);
        } else {
            updatedCheckedByCRN.add(crn);
        }
        setCheckedByCRN(updatedCheckedByCRN);
        
        // sets selectAll checkbox to indeterminate state if only some checkboxes are selected
        const updatedNumChecked = updatedCheckedByCRN.size;
        topCheckbox.current.indeterminate = updatedNumChecked > 0 && updatedNumChecked < numCoursesDisplayed;
        setNumChecked(updatedNumChecked);
    };

    const handleSelectDeselectAll = (event) => {
        if (event.target.checked) {
            const allChecked = new Set(allCourses.map((course) => {
                return course["crn"]
            }));
            setCheckedByCRN(allChecked);
            setNumChecked(allChecked.size);
        } else {
            setCheckedByCRN(new Set());
            setNumChecked(0);
        }
    };

    const handleShowMyCourses = () => {
        if (myCourses.length <= 0) {
            return "";
        }
        let resp = "";
        for (const course of myCourses) {
            resp += course["crn"] + " "
        }
        return resp.substring(0, resp.length-1);
    }

    const handleSubmitCourses = () => {
        const currLocal = JSON.parse(localStorage.getItem("mycoursesLocal") || "[]"); // arr of dicts
        const crn_arr = Array.from(checkedByCRN);

        // gets all crns
        const crns = new Set();
        for (let i=0; i<currLocal.length; i++) {
            crns.add(currLocal[i]["crn"]);
        }
        for(let i=0; i<crn_arr.length; i++) {
            crns.add(crn_arr[i]);
        }
        const crns_arr = Array.from(crns);

        // gets all objects from crns
        const res = new Set();
        for (let i=0; i<currLocal.length; i++) {
            res.add(currLocal[i]);
        }

        const all_arr = Array.from(allCourses);
        for (let i=0; i<all_arr.length; i++) {
            if (crns_arr.indexOf(all_arr[i]["crn"]) != -1) {
                res.add(all_arr[i]);
            }
        }
        // console.log("res: ", JSON.stringify(Array.from(res)));
        localStorage.removeItem("mycoursesLocal");
        localStorage.setItem("mycoursesLocal", JSON.stringify(Array.from(res)));

        return "";
    }

    return (
        <>
            <main className="main">
                <p className="page-main-description">Find your class around Oregon State University.</p>

                <div className="form-container">
                    <form method="get" className="form-input" >
                        <input type="text" id="crn" name="crn" className="courseInputs" placeholder="CRN..."/>
                        <input type="text" id="code" name="code" className="codeInputs" placeholder="Code..."/>
                        <input type="submit" value="Search" />
                    </form>
                    <form method="get" className="form-input" >
                        <button id="show-mycourses" name="mycourses" value={handleShowMyCourses()}
                        >Show My Courses</button>
                        {/* value={handleShowMyCourses(myCourses) */}
                    </form>
                </div>
                

                <div className="form-table-wrapper">
                    <table id="courses" className="form-table">
                        <thead>
                            <tr className="form-table-head-select">
                                <th colSpan={2}>
                                    <div className="select-box-wrapper">
                                        <input 
                                            type="checkbox" 
                                            ref={topCheckbox}
                                            className="select-box"
                                            checked={numCoursesDisplayed === numChecked}
                                            onChange={handleSelectDeselectAll}
                                        />
                                    </div>
                                </th>
                                <th colSpan={4}>
                                    {
                                        numChecked
                                        ? `${numChecked} selected`
                                        : "None selected"
                                    }
                                </th>
                                <th colSpan={3}>
                                    <form method="get" className="form-input" >
                                        <button id="submit-mycourses" name="mycourses" value={handleSubmitCourses()}
                                        >Submit Selection</button>
                                    </form>
                                </th>
                            </tr>
                            <tr className="form-table-head">
                                <th>Select</th>
                                <th>CRN</th>
                                <th>Title</th>
                                <th>Code</th>
                                <th>Section No.</th>
                                <th>Session Offered</th>
                                <th>Instructor</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCourses.map((course, i) =>
                                <tr key={i}>
                                    <td>
                                        <div className="select-box-wrapper">
                                            <input 
                                                type="checkbox" 
                                                className="select-box" 
                                                checked={checkedByCRN.has(course["crn"])}
                                                id={course["crn"]} 
                                                value={course["crn"]} 
                                                onChange={() => handleOnChange(course["crn"])} 
                                            />
                                        </div>
                                    </td>
                                    <td>{course["crn"]}</td>
                                    <td>{course["title"]}</td>
                                    <td>{course["code"]}</td>
                                    <td>{course["sectionNo"]}</td>
                                    <td>{course["srcdb"]}</td>
                                    <td>{course["instructor"]}</td>
                                    <td>{course["startDate"]}</td>
                                    <td>{course["endDate"]}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );}

export default CoursesPage;