import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const SOCKET_URL = 'http://localhost:5000';

function Map() {
  // State variable that holds an array of ship data
  const [ships, setShips] = useState([]);

  useEffect(() => {
    // Connects to the WebSocket server using the given URL.
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    // Event handler for when the client connects to the WebSocket server.
    socket.on('connect', function() {
       console.log('Client is now connected to server.');
       socket.emit('user_connected');
    });

    // Event handler for when the WebSocket server disconnects.
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Event handler for receiving data from the WebSocket server.
    socket.on('data', (data) => {
      // Parses the received data as JSON.
      const shipData = JSON.parse(data);
      // Updates the state of the component with the received data.
      setShips(shipData);
      // Stores the received data in localStorage for caching.
      localStorage.setItem('ships', JSON.stringify(shipData));
    });

    // Checks if there are cached ships in localStorage and load them into state if present.
    const storedShips = localStorage.getItem('ships');
    if (storedShips) {
      setShips(JSON.parse(storedShips));
    }
  }, []);

  // Creates an array of Marker components based on the ships' data in state.
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

  // Renders a MapContainer component from the react-leaflet library, which contains the TileLayer and Markers.
  return (
    <MapContainer center={[63.4, 10.4]} zoom={10} style={{ height: "90vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers}
    </MapContainer>
  );
}

export default Map;