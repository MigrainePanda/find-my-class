import Course from './Course';

// Change the function names and parameters 
// to fit your portfolio topic and schema.

function CourseList({ courses }) {
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
                {courses.slice(0, 10).map((course, i) => 
                    <Course 
                        course={course}
                        key={i}
                    />)}
            </tbody>
        </table>
    );
}

export default CourseList;