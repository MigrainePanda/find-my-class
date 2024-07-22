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

        function getCenter() {
            const default_lat = 44.5635;
            const default_long = -123.283;
            let lat = 0;
            let long = 0;
            for (let i=0; i<locations.length; i++) {
                lat += locations[i]["lat"];
                long += locations[i]["long"];
            }
            lat = lat ? lat/locations.length : default_lat;
            long = long ? long/locations.length : default_long;
            return {"lat": lat, "long": long, "zoom": 17};
        }

        const center = getCenter();
        const center_lat = center["lat"];
        const center_long = center["long"];
        const center_zoom = center["zoom"];

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
