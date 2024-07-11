import { useEffect } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Map( { props } ) {

    useEffect(() => {
        console.log(props)
        const container = L.DomUtil.get('map');
        if(container != null && container.classList.length !== 0){
            // console.log(container)
            // console.log(container.classList.length)
            return
        }

        // 44.56457931466407, -123.2821439925128
        const current_lat = 44.56457931466407;
        const current_long = -123.2821439925128;
        const current_zoom = 16;
        const center_lat = current_lat;
        const center_long = current_long;
        const center_zoom = current_zoom;

        const map = L.map("map", {
            center: [center_lat, center_long],
            zoom: center_zoom,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

    }, [props]);

    return (
        <>
            <div id="map"></div>
        </>
    );
}

export default Map;


// <div id="map">
//     <p>map</p>
//     <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
//         <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={[51.505, -0.09]}>
//             <Popup>
//                 A pretty CSS3 popup. <br /> Easily customizable.
//             </Popup>
//         </Marker>
//     </MapContainer>
// </div>