import { useState } from 'react';

function Course({ course }) {
    const [checked, setChecked] = useState(false);
    
    return (
        <tr>
            <td>
                <div className="select-box-wrapper">
                    <input type="checkbox" className="select-box" id={course.crn} value={course.crn} onClick={() => setChecked(!checked)} />
                </div>
            </td>
            <td>{course.crn}</td>
            <td>{course.title}</td>
            <td>{course.code}</td>
            <td>{course.sectionNo}</td>
            <td>{course.srcdb}</td>
            <td>{course.instructor}</td>
            <td>{course.startDate}</td>
            <td>{course.endDate}</td>
        </tr>
    );
}

export default Course;