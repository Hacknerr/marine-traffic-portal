import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
/**
 * This map is an example of a map that uses markers and automatically pans between them on an interval of 2 seconds.
 * I am unsure how to implement this into the already written code, but this example works with an array of markers.
 * @returns {JSX.Element}
 * @constructor
 */
function MyMap() {
    const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
    const markers = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.515, -0.11]
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMarkerIndex((prevIndex) => (prevIndex + 1) % markers.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer center={markers[0]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((position) => (
                <Marker position={position} />
            ))}
            <PanToMarker position={markers[activeMarkerIndex]} />
        </MapContainer>
    );
}

function PanToMarker({ position }) {
    const map = useMap();

    useEffect(() => {
        map.panTo(position);
    }, [position]);

    return null;
}