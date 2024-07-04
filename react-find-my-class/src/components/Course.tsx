

function Course({ course }) {
    return (
        <tr>
            <td>
                <div className="select-box-wrapper">
                    <input type="checkbox" className="select-box" />
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