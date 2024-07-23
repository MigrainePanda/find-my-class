import { useState, useRef } from "react";

function Table( props ) {
    const courses = props.courses;
    const title = props.title;
    const buttonLabel = props.buttonLabel;

    const topCheckbox = useRef<any>();
    const [checkedByCRN, setCheckedByCRN] = useState(new Set());
    const [numChecked, setNumChecked] = useState(checkedByCRN.size);
    const [numCoursesDisplayed] = useState(props.numCoursesDisplayedDefault);


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
            const allChecked = new Set(courses.map((course) => {
                return course["crn"]
            }));
            setCheckedByCRN(allChecked);
            setNumChecked(allChecked.size);
        } else {
            setCheckedByCRN(new Set());
            setNumChecked(0);
        }
    };

    function handleClick() {
        props.parentHandleClick(checkedByCRN);
        setCheckedByCRN(new Set());
        setNumChecked(0);
    }

    return (
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
                            {
                                numChecked
                                ? `${numChecked} selected`
                                : "None selected"
                            }
                        </div>
                    </th>
                    <th colSpan={6}>
                        {title}
                    </th>
                    <th>
                        <button name="add-course" onClick={handleClick}>{buttonLabel}</button>
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
                {courses.map((course, i) =>
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
    );
}

export default Table;