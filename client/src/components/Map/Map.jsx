import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
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

// Carousel

function PanToMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    map.panTo(position);
  }, [position]);

  return null;
}

function Map({ darkMode }) {
  // Defines state variables to store ship-data
  const [ships, setShips] = useState([]);

  // Defines function to map ship type number to corresponding text
  function getShipTypeText(shipTypeNumber) {
    switch (shipTypeNumber) {
      case 38:
        return 'Reservert';
      case 40:
        return 'Høyhastighetsfartøy';
      case 50:
        return 'Losbåt';
      case 51:
        return 'Redningsskøyte';
      case 52:
        return 'Taubåt';
      case 59:
        return 'Spesialfartøy';
      case 60:
        return 'Passasjerfartøy';
      case 69:
        return 'Passasjerfartøy';
      case 70:
        return 'Fraktefartøy';
      case 80:
        return 'Tankskip';
      case 90:
        return 'Annen fartøytype';
      case 99:
        return 'Annen fartøytype';
      default:
        return shipTypeNumber.toString();
    }
  }

  // Carousel
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  useEffect(() => {
    if (ships.length > 0) {
      const interval = setInterval(() => {
        setActiveMarkerIndex((prevIndex) => (prevIndex + 1) % ships.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [ships]);



   // Sets up event source for Server-Sent Events (SSE) and handles incoming data
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse');
    //const eventSource = new EventSource('http://10.212.173.142:5000/sse');

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
  const purpleIcon = new L.Icon({
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
    return diffInMinutes < 15;
  })
  .map((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime - msgTime) / 1000);

    // Creates markers for each ship with a popup containing ship information
    return (
      <Marker key={ship.mmsi} position={[ship.latitude, ship.longitude]} icon={purpleIcon}>
        <Popup className={darkMode ? 'custom-popup' : ''}>
          <div>
            <h2>{ship.name}</h2>
            <p>MMSI: {ship.mmsi}</p>
            <p>Ship Type: {getShipTypeText(ship.shipType)}</p>
            <p>Speed: {ship.speedOverGround === 0 ? 'None' : `${ship.speedOverGround} knots`}</p>
            <p>Heading: {ship.trueHeading === null ? 'None' : `${ship.trueHeading}°`}</p>
            <p>Course: {ship.courseOverGround == null ? 'None' : (ship.courseOverGround === 0 ? 'None' : `${ship.courseOverGround}°`)}</p>
            <p>Last update: {diffInSeconds < 15 ? 'Now' : diffInSeconds < 60 ? `${diffInSeconds} seconds ago` : `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`}</p>
          </div>
        </Popup>
      </Marker>
    );
  });

  // Carousel
  const markerPositions = markers.map((marker) => [marker.props.position[0], marker.props.position[1]]);

  // This function renders the MapContainer component with the ship markers
  return (
      <div className="map-container">
        <MapContainer
            center={markerPositions.length > 0 ? markerPositions[0] : [73.48, 10.4]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
          <TileLayer url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" : "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"} />
          {markers}
          <FullscreenControl />
          {ships.length > 0 && (
          <PanToMarker position={[ships[activeMarkerIndex].latitude, ships[activeMarkerIndex].longitude]} />
        )}
        </MapContainer>
      </div>
  );
}

export default Map;
