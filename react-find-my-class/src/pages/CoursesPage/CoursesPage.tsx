import { useState, useEffect, useRef, useCallback } from "react";

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import "./CoursesPage.css"
// import CourseList from "../../components/CoursesList";

function CoursesPage() {
    const topCheckbox = useRef(null);
    const [allCourses, setAllCourses] = useState(() => {
        return (JSON.parse(localStorage.getItem("coursesLocal") || '{}')) || "noLocal";
    });
    const [checkedByCRN, setCheckedByCRN] = useState(new Set());
    const [numChecked, setNumChecked] = useState(checkedByCRN.size);
    const numCoursesDisplayedDefault = 5;  //30;
    const [numCoursesDisplayed, setNumCoursesDisplayed] = useState(numCoursesDisplayedDefault);

    const memo_loadCourses = useCallback(
        async () => {
            const queryStrings = new URLSearchParams((window.location.search).toString()).toString();
            if (allCourses !== "noLocal" && queryStrings === "") {
                return new Promise((resolve) => {resolve("")});
            }

            const response = await fetch("http://localhost:8800/courses?" + queryStrings);
            const courses = await response.json();
            console.log("loadcourses: ", courses)

            setNumCoursesDisplayed(Math.min(numCoursesDisplayedDefault, courses.length));
            const displayedCourses = courses.slice(0, numCoursesDisplayed);
            setAllCourses(displayedCourses);
            localStorage.setItem("coursesLocal", JSON.stringify(displayedCourses));
            setNumChecked(0);
        }, 
        [allCourses, numCoursesDisplayed]
    );

    useEffect(() => {
        memo_loadCourses();
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

    const handleCheckedByCRNToString = (coursesSet) => {
        let resp = "";
        for (const course of coursesSet.values()) {
            resp += course + " ";
        }
        return resp.substring(0, resp.length-1);
    }

    return (
        <>
            <main className="main">
                <p className="page-main-description">Find your class around Oregon State University.</p>

                <div className="form-container">
                    <form method="get" className="form-input">
                        <input type="text" id="crn" name="crn" className="courseInputs" placeholder="CRN..."/>
                        <input type="text" id="code" name="code" className="codeInputs" placeholder="Code..."/>
                        <input type="submit" value="Search" />
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
                                        <input 
                                            type="text"
                                            id="mycourses"
                                            name="mycourses"
                                            defaultValue={handleCheckedByCRNToString(checkedByCRN)}
                                            hidden
                                        />
                                        <input 
                                            type="submit" 
                                            value="Submit Selection"
                                        />
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