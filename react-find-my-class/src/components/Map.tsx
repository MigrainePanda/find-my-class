import { useEffect } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Map( { locations } ) {

    useEffect(() => {
        if (locations.length == 0) {
            return;
        }
        const container = L.DomUtil.get('map');
        if(container != null && container.classList.length !== 0){
            return
        }

        const center_lat = 44.5635;
        const center_long = -123.283;
        const center_zoom = 16;

        const map = L.map("map", {
            center: [center_lat, center_long],
            zoom: center_zoom,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        
        for (let i=0; i<locations.length; i++) {
            const curr = locations[i];
            const marker = L.marker([curr["lat"], curr["long"]]).addTo(map);
            marker.bindPopup(`<b>${curr["name"]} (${curr["short"]})</b><br>
                Building ID: ${curr["bldgID"]}<br>
                For Course ${curr["crn"]}`);
        }

        // const popup = L.popup();
        // function onMapClick(e) {
        //     popup
        //         .setLatLng(e.latlng)
        //         .setContent("You clicked the map at " + e.latlng.toString())
        //         .openOn(map);
        // }
        // map.on('click', onMapClick);

    }, [locations]);

    return (
        <>
            <div id="map"></div>
        </>
    );
}

export default Map;
