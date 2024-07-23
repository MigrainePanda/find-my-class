import { useState, useEffect, useCallback } from "react";
import Table from "../../components/Table.tsx"

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import "./CoursesPage.css";

function CoursesPage() {
    const numCoursesDisplayedDefault = 20;
    const [allCourses, setAllCourses] = useState<any>([]);
    const [userCourses, setUserCourses] = useState<any>([
        {
            crn: "10001"
        },
        {
            crn: "10005"
        }
    ]);

    const allCoursesTableProps = {
        courses: allCourses.length > 0 
                ? allCourses.slice(0, numCoursesDisplayedDefault)
                : allCourses,
        title: "All Available Courses",
        buttonLabel: "Add to Your Courses",
        numCoursesDisplayedDefault,
        parentHandleClick: handleChildClickAdd,
    }
    const userCoursesTableProps = {
        courses: userCourses,
        title: "Your Courses",
        buttonLabel: "Remove from Your Courses",
        numCoursesDisplayedDefault,
        parentHandleClick: handleChildClickRm,
    }

    const memoLoadCourses = useCallback(
        async (queryStrings) => {
            const response = await fetch("http://localhost:8800/courses?" + queryStrings);
            const courses = await response.json();
            console.log("loadcourses: ", courses)
            setAllCourses(courses);
        }, 
        []
    );

    useEffect(() => {
        const params = new URLSearchParams((window.location.search).toString());
        const queryStrings = params.toString();
        memoLoadCourses(queryStrings);
    }, [memoLoadCourses]);

    function checkUserTable() {
        if (userCourses.length > 0) {
            return <Table {...userCoursesTableProps} />;
        }
        return;
    }

    function handleChildClickAdd(checkedByCRN) {
        const curr: any = new Set(userCourses);
        const currCRNs = new Set();
        for (const obj of curr) {
            currCRNs.add(obj["crn"]);
        }
        
        const toAddCRNs: any = Array.from(checkedByCRN);
        toAddCRNs.map((crn) => {
            if (!currCRNs.has(crn)) {
                curr.add(crn);
            }
        });
        
        const res: any = Array.from(curr);
        for (let i=0; i<res.length; i++) {
            if (typeof res[i] === "string") {
                const objIdx = (allCourses.slice(0, numCoursesDisplayedDefault)).findIndex(
                    (temp) => temp["crn"] === res[i]
                );
                res[i] = allCourses[objIdx];
                continue;
            }
        }
        setUserCourses(res);
    }

    function handleChildClickRm(checkedByCRN) {
        const curr: any = new Set(userCourses);
        for (const obj of curr) {
            if (checkedByCRN.has(obj["crn"])) {
                curr.delete(obj);
            }
        }
        console.log(curr);
        setUserCourses(Array.from(curr));
    }

    return (
        <>
            <main className="main">
                <p className="page-main-description">Find your class around Oregon State University.</p>
                
                <div className="form-table-wrapper">
                    {checkUserTable()}
                </div>

                <div className="form-table-wrapper">
                    <Table {...allCoursesTableProps} />
                </div>

            </main>
        </>
    );}

export default CoursesPage;