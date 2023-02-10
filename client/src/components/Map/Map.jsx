// Map.jsx
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const defaultLocation = [63.486112, 10.3980667];

const Map = () => {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    fetch("/coordinates")
      .then((res) => res.json())
      .then((data) => setCoordinates(data));
  }, []);

  return (
    <MapContainer
      style={{ height: "450px", width: "50%" }}
      center={defaultLocation}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

      {coordinates.map((coordinate, index) => (
        <Marker key={index} position={coordinate}>
          <Popup>
            Latitude: {coordinate[0]} <br />
            Longitude: {coordinate[1]}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
