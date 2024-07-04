import Course from './Course';

// Change the function names and parameters 
// to fit your portfolio topic and schema.

function CourseList({ courses }) {
    return (
        <table id="courses">
            <thead>
                <tr>
                    <th>Title</th>
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