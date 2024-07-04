import { useState, useEffect } from "react";
import Navbar from "../../components/Navigation/Navigation"

import "./CoursesPage.css"
import CourseList from "../../components/CoursesList";

function CoursesPage() {
    
    const [courses, setCourses] = useState([]);

    const loadCourses = async () => {
        const response = await fetch("http://localhost:8800/courses?" + 
            new URLSearchParams((window.location.search).toString()).toString()
        );
        const courses = await response.json();
        setCourses(courses);
    }

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <div className="outer-wrapper">
            <Navbar />
            <main className="main">
                <p className="page-description">Find your class around Oregon State University.</p>
                <div className="form-container">
                    <form method="get" className="form-input">
                        <input type="text" id="crnInput" name="crnInput" className="courseInputs" placeholder="CRN..."/>
                        <input type="text" id="codeInput" name="codeInput" className="codeInputs" placeholder="Code..."/>
                        <input type="submit" />
                    </form>
                    <div className="form-table-wrapper">
                        <CourseList
                            courses={courses}
                        />
                    </div>
                </div>
            </main>
        </div>
    );}

export default CoursesPage;