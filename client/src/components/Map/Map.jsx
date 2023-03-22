import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap , useRef} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './Map.css';
import './Popup.css';

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    map.addControl(new L.Control.Fullscreen());
  }, [map]);

  return null;
}

function Map({ darkMode }) {
  // Defines state variables to store ship-data
  const [ships, setShips] = useState([]);

   // Sets up event source for Server-Sent Events (SSE) and handles incoming data
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse');

    // When a new message is received from SSE, update the state of the ships
    eventSource.onmessage = (event) => {
      console.log('EventSource.onmessage activated.');
      const data = event.data;
      try {
        const parsedData = JSON.parse(data);
        setShips(parsedData);

        // Caches the latest ship-data in local storage
        console.log('Writing latest data to localstorage.');
        localStorage.setItem('ships', data);
      } catch (error) {
        console.error('Error parsing JSON data', error);
      }
    };

    // Retrieves stored ship-data from local storage if available
    const storedShips = localStorage.getItem('ships');
    if (storedShips) {
      try {
        const parsedData = JSON.parse(storedShips);
        setShips(parsedData);
      } catch (error) {
        console.error('Error parsing JSON data', error);
      }
    }
  }, []);

  // Defines custom icons for the ship markers
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Filters out ships based on time difference and maps them to markers
  const markers = ships
  .filter((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInMinutes = Math.floor((currentTime - msgTime) / 1000 / 60);

    // Only returns ships with data updated within the last 10 minutes
    return diffInMinutes < 10;
  })
  .map((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime - msgTime) / 1000);

    // Creates markers for each ship with a popup containing ship information
    return (
      <Marker key={ship.mmsi} position={[ship.latitude, ship.longitude]} icon={greenIcon}>
        <Popup>
          <div>
            <h2>{ship.name}</h2>
            <p>MMSI: {ship.mmsi}</p>
            <p>Ship Type: {ship.shipType}</p>
            <p>Speed: {ship.speedOverGround === 0 ? 'None' : `${ship.speedOverGround} knots`}</p>
            <p>Heading: {ship.trueHeading === null ? 'None' : `${ship.trueHeading}°`}</p>
            <p>Course: {ship.courseOverGround === 0 ? 'None' : `${ship.courseOverGround}°`}</p>
            <p>Last update: {diffInSeconds < 15 ? 'Now' : `${diffInSeconds} seconds ago`}</p>
          </div>
        </Popup>
      </Marker>
    );
  });


  // This function renders the MapContainer component with the ship markers
  return (
      <div className="map-container">
        <MapContainer
            center={[63.48, 10.4]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
          <TileLayer url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" : "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"} />
          {markers}
          <FullscreenControl />
        </MapContainer>
      </div>
  );
}

export default Map;
