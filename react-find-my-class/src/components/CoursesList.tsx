import Course from './Course';

function CourseList({ courses }) {
    const num_courses_displayed = 20;
    return (
        <table id="courses" className="form-table">
            <thead>
                <tr>
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
                {courses.slice(0, num_courses_displayed).map((course, i) =>
                    <Course 
                        course={course}
                        key={i}
                    />)}
            </tbody>
        </table>
    );
}

export default CourseList;