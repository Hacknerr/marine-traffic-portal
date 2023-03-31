import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './Map.css';
import './Popup.css';

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

function FullscreenInfoBox() {
  const map = useMap();
  const currentTime = new Date();

  // CSS styles for the info box
  const infoBoxStyle = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
    padding: '0px 10px',
    lineHeight: '0.75',
    backgroundColor: 'white',
    zIndex: '1000',
    fontSize: '14px',
    textAlign: 'center',
    borderBottom: '1px solid #8C67AC'
  };

  // Render the info box when the map is in full screen mode
  if (map.isFullscreen()) {
    return (
      <div style={infoBoxStyle}>
        <p>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <p>
          {currentTime.toLocaleDateString('nb-NO', { month: 'long', day: 'numeric' })}
        </p>
      </div>
    );
  }

  return null;
}

// Add the isMobileDevice function here
function isMobileDevice() {
  return window.innerWidth <= 768;
}

function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    map.addControl(new L.Control.Fullscreen());
  }, [map]);

  return null;
}

// Carousel
function PanToMarker({ position, isActive }) {
  const map = useMap();
  const positionWithOffset = [position[0] + 0.005, position[1]];

  useEffect(() => {
    if (isActive) {
      // map.flyTo(positionWithOffset, 15);
    }
  }, [position, isActive]);

  return null;
}

// Set zoom on carousel start
function SetZoomOnCarouselActive({ isActive }) {
  const map = useMap();

  useEffect(() => {
    if (isActive) {
      map.setZoom(16);
    } else {
      map.setZoom(13);
    }
  }, [isActive, map]);

  return null;
}


function Map({ darkMode, isCarouselActive }) {
  // Defines state variables to store ship-data
  const [ships, setShips] = useState([]);

  const markerRefs = useRef([]);

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
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    if (isCarouselActive && ships.length > 0) {
      const interval = setInterval(() => {
        setActiveMarkerIndex((prevIndex) => (prevIndex + 1) % ships.length);

        // Close the popup of the previous marker
        if (markerRefs.current[activeMarkerIndex]) {
          setActivePopup(null);
          markerRefs.current[activeMarkerIndex].openPopup();
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [ships, isCarouselActive, activeMarkerIndex]);


  // Open the popup for the active marker when activeMarkerIndex changes
  useEffect(() => {
    if (markerRefs.current[activeMarkerIndex]) {
      if (isCarouselActive || activeMarkerIndex === 0) {
        if (activePopup) {
          activePopup.closePopup(); // Close active popup if there is one
        }
        const newPopup = markerRefs.current[activeMarkerIndex].openPopup();
        setActivePopup(newPopup); // Update active popup
      }
    }
  }, [activeMarkerIndex, isCarouselActive, activePopup]);

  // Sets up event source for Server-Sent Events (SSE) and handles incoming data
  useEffect(() => {
    //const eventSource = new EventSource('http://localhost:5000/sse');
    const eventSource = new EventSource('http://10.212.173.142:5000/sse');

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
    return ship.name && !ship.name.includes(".");
  })
  .map((ship, index) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime - msgTime) / 1000);

    // Creates markers for each ship with a popup containing ship information
    return (
      <Marker
          key={ship.mmsi}
          position={[ship.latitude, ship.longitude]}
          icon={purpleIcon}
          ref={(marker) => {
            if (marker) {
              markerRefs.current[index] = marker;
            }
          }}
      >
        <Popup
            key={`${ship.mmsi}-${isCarouselActive}`}
            className={darkMode ? 'custom-popup-darkmode' : 'custom-popup'}
            autoPan={isCarouselActive}
            autoPanPadding={isMobileDevice() ? L.point(20, 200) : L.point(300, 200)}
        >
          <div>
            <h2>{ship.name ? ship.name : 'Ukjent'}</h2>
            {ship.name && !ship.name.includes("/") && !ship.name.includes(".") && (
              <img
                className="popup-image"
                src={`images/${ship.name}.jpg`}
                alt={ship.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            )}
            <p><span className="bolded-text">MMSI: </span>{ship.mmsi}</p>
            <p><span className="bolded-text">Skipstype: </span>{getShipTypeText(ship.shipType)}</p>
            <p><span className="bolded-text">Fart: </span>{ship.speedOverGround === 0 ? 'Ingen' : `${ship.speedOverGround} knop`}</p>
            <p><span className="bolded-text">Stevning: </span>{ship.trueHeading === null ? 'Ingen' : `${ship.trueHeading}°`}</p>
            <p><span className="bolded-text">Kurs: </span>{ship.courseOverGround == null ? 'Ingen' : (ship.courseOverGround === 0 ? 'Ingen' : `${ship.courseOverGround}°`)}</p>
            <p><span className="bolded-text">Sist oppdatert: </span>{diffInSeconds < 15 ? 'Nå' : diffInSeconds < 60 ? `${diffInSeconds} sekunder siden` : `${Math.floor(diffInSeconds / 60)} minutt${Math.floor(diffInSeconds / 60) > 1 ? 'er' : ''} siden`}</p>
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
            center={markerPositions.length > 0 ? markerPositions[0] : [63.45, 10.4]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
        >
          <TileLayer url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" : "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"} />
          {markers}
          <FullscreenControl />
          <FullscreenInfoBox />
          {markers.length > 0 && (
          <PanToMarker position={[ships[activeMarkerIndex].latitude, ships[activeMarkerIndex].longitude]} isActive={isCarouselActive} />
        )}
          <SetZoomOnCarouselActive isActive={isCarouselActive} />
        </MapContainer>
      </div>
  );
}

export default Map;
