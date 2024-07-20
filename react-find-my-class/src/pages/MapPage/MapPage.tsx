// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { useCallback, useState, useEffect } from 'react';

import "./MapPage.css"
import Map from "../../components/Map.tsx"

function MapPage() {

    const [myCoursesCRN] = useState(() => {
        const local = (JSON.parse(localStorage.getItem("mycoursesLocal") || "[]")) || [];
        const uniqueCRNS = new Set();
        for (let i=0; i<local.length; i++) {
            if (!(uniqueCRNS.has(local[i]["crn"]))) {
                uniqueCRNS.add(local[i]["crn"]);
            }
        }
        const arrFromUniqueCRNS = Array.from(uniqueCRNS);
        return arrFromUniqueCRNS;
    });

    const [myCourses] = useState(() => {
        const local = (JSON.parse(localStorage.getItem("mycoursesLocal") || "[]")) || [];
        const res: object[] = [];
        for (let i=0; i< myCoursesCRN.length; i++) {
            for (let j=0; j<local.length; j++) {
                if (myCoursesCRN[i] === local[j]["crn"]) {
                    res.push(local[j]);
                    break;
                }
            }
        }
        return res;
    });

    const [locations, setLocations] = useState([]);
    const memoLoadLocations = useCallback(
        async() => {
            const query_strings = "mycourses=" + myCoursesCRN.toString();
            const response = await fetch("http://localhost:8800/map?" + query_strings);
            const locations_resp = await response.json();
            console.log("loadlocations: ", locations_resp)

            setLocations(locations_resp);
        },
        [myCoursesCRN]
    );
    
    useEffect(() => {
        memoLoadLocations();
    }, [memoLoadLocations]);

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
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myCourses.map((course, i) => 
                                <tr key={i}>
                                    <td>{course["crn"]}</td>
                                    <td>{course["title"]}</td>
                                    <td>{course["code"]}</td>
                                    <td>{course["sectionNo"]}</td>
                                    <td>{course["srcdb"]}</td>
                                    <td>{course["instructor"]}</td>
                                    <td>{course["startDate"]}</td>
                                    <td>{course["endDate"]}</td>
                                    <td></td>
                                </tr>

                            )}
                        </tbody>
                    </table>
                </div>

                <div className="map-wrapper">
                    <Map locations={locations} />
                </div>
            </main>
        </>
    );}

export default MapPage;