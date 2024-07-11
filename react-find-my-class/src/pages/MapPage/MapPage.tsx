// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { useState } from 'react';

import "./MapPage.css"
import Map from "../../components/Map.tsx"

function MapPage() {
    const [allCourses] = useState(() => {
        return (JSON.parse(localStorage.getItem("coursesLocal") || '{}')) || "noLocal";
    });

    return (
        <>
            <main className="main">
                <p className="page-main-description">Mappa.</p>
                <p className="page-description">cool.</p>

                <div className="form-table-wrapper">
                    <table id="courses" className="form-table">
                        <thead>
                            <tr className="form-table-head">
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

                <div className="map-wrapper">
                    <Map props={"props for later"} />
                </div>
            </main>
        </>
    );}

export default MapPage;