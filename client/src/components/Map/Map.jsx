import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './Map.css';

function Map() {
  const [ships, setShips] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse');

    eventSource.onmessage = (event) => {
      console.log('EventSource.onmessage activated.');
      const data = event.data;
      try {
        const parsedData = JSON.parse(data);
        setShips(parsedData);

        console.log('Writing latest data to localstorage.');
        localStorage.setItem('ships', data);
      } catch (error) {
        console.error('Error parsing JSON data', error);
      }
    };

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

  const boatIcon = L.icon({
    iconUrl: process.env.PUBLIC_URL + '/boat-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const markers = ships
  .filter((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInMinutes = Math.floor((currentTime - msgTime) / 1000 / 60);

    return diffInMinutes < 15;
  })
  .map((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime - msgTime) / 1000);

    return (
      <Marker key={ship.mmsi} position={[ship.latitude, ship.longitude]} icon={boatIcon}>
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


  return (
    <MapContainer center={[63.48, 10.4]} zoom={10} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers}
    </MapContainer>
  );
}

export default Map;
