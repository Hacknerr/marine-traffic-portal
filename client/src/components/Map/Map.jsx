import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const SOCKET_URL = 'http://localhost:5000'; // replace with your socket URL

function Map() {
  const [ships, setShips] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', function() {
       console.log('Client is now connected to server.');
       socket.emit('user_connected');
    });

    socket.on('data', (data) => {
      const shipData = JSON.parse(data);
      setShips(shipData);
      localStorage.setItem('ships', JSON.stringify(shipData));
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    const storedShips = localStorage.getItem('ships');
    if (storedShips) {
      setShips(JSON.parse(storedShips));
    }
  }, []);

  const markers = ships.map((ship) => (
    <Marker key={ship.mmsi} position={[ship.latitude, ship.longitude]}>
      <Popup>
        <div>
          <h2>{ship.name}</h2>
          <p>MMSI: {ship.mmsi}</p>
          <p>Ship Type: {ship.shipType}</p>
          <p>Speed: {ship.speedOverGround} knots</p>
          <p>Heading: {ship.trueHeading}°</p>
          <p>Course: {ship.courseOverGround}°</p>
        </div>
      </Popup>
    </Marker>
  ));

  return (
    <MapContainer center={[63.4, 10.4]} zoom={10} style={{ height: "90vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers}
    </MapContainer>
  );
}

export default Map;