/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './Map.css';
import './Popup.css';

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

export function FullscreenInfoBox({darkMode}) {
  const map = useMap();
  const currentTime = new Date();

  // CSS styles for the info box
  const infoBoxStyle = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
    padding: '0px 10px',
    lineHeight: '0.75',
    backgroundColor: darkMode ? '#121212' : 'white',
    color: darkMode ? 'white' : 'black',
    zIndex: '1000',
    fontSize: '14px',
    textAlign: 'center',
    borderBottom: '1px solid #8C67AC'
  };

  // Renders the info box when the map is in full screen mode
  if (map.isFullscreen()) {
    return (
      <div style={infoBoxStyle}>
        <p>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
        </p>
        <p>
          {currentTime.toLocaleDateString('nb-NO', { month: 'long', day: 'numeric' })}
        </p>
      </div>
    );
  }

  return null;
}

// Adds the isMobileDevice function here
function isMobileDevice() {
  return window.innerWidth <= 768;
}

export function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    map.addControl(new L.Control.Fullscreen());
  }, [map]);

  return null;
}

// Set zoom on carousel start
export function SetZoomOnCarouselActive({ isActive }) {
  const map = useMap();

  useEffect(() => {
    if (isActive) {
      map.setZoom(16);
    } else {
      map.setZoom(14);
    }
  }, [isActive, map]);

  return null;
}

// Takes a 'position' prop and renders a ZoomControl component with the given position
export function CustomZoomControl({ position }) {
  return <ZoomControl position={position} />;
}

// Takes a 'position' prop and renders a CustomZoomControl component only if the map is not in fullscreen mode.
export function ConditionalZoomControl({ position }) {
  const map = useMap();

  // Checks if the map is not in fullscreen mode
  if (!map.isFullscreen()) {
    return <CustomZoomControl position={position} />;
  }

  return null;
}

function Map({ darkMode, isCarouselActive }) {
  // Defines state variables to store ship-data
  const [ships, setShips] = useState([]);

  const markerRefs = useRef([]);

  // Defines a function that maps ship type number to corresponding text
function getShipTypeText(shipTypeNumber) {
  switch (shipTypeNumber) {
    case 0:
    return 'Ikke tilgjengelig (standard)';
    case 19:
    return 'Reservert for fremtidig bruk';
    case 20:
    return 'Vinge i sjøen (WIG)';
    case 21:
    return 'Vinge i sjøen (WIG), Farlig kategori A';
    case 22:
    return 'Vinge i sjøen (WIG), Farlig kategori B';
    case 23:
    return 'Vinge i sjøen (WIG), Farlig kategori C';
    case 24:
    return 'Vinge i sjøen (WIG), Farlig kategori D';
    case 29:
    return 'Vinge i sjøen (WIG)';
    case 30:
    return 'Fiskeskøyte';
    case 31:
    return 'Tauing';
    case 32:
    return 'Tauing: lengde overstiger 200m eller bredde overstiger 25m';
    case 33:
    return 'Graving eller undervannsoperasjoner';
    case 34:
    return 'Dykkeroperasjoner';
    case 35:
    return 'Militære operasjoner';
    case 36:
    return 'Seiling';
    case 37:
    return 'Fritidsfartøy';
    case 38:
    case 39:
    return 'Reservert';
    case 40:
    return 'Høyhastighetsfartøy';
    case 41:
    return 'Høyhastighetsfartøy, Farlig kategori A';
    case 42:
    return 'Høyhastighetsfartøy, Farlig kategori B';
    case 43:
    return 'Høyhastighetsfartøy, Farlig kategori C';
    case 44:
    return 'Høyhastighetsfartøy, Farlig kategori D';
    case 48:
    return 'Høyhastighetsfartøy';
    case 49:
    return 'Høyhastighetsfartøy';
    case 50:
    return 'Losbåt';
    case 51:
    return 'Søk- og redningsfartøy';
    case 52:
    return 'Slepebåt';
    case 53:
    return 'Havnearbeider';
    case 54:
    return 'Anti-forurensningsutstyret';
    case 55:
    return 'Lovhåndhevelse';
    case 56:
    case 57:
    return 'Spare - Lokalt skip';
    case 58:
    return 'Medisinsk transport';
    case 59:
    return 'Ikke-stridende skip i henhold til RR-resolusjon nr. 18';
    case 60:
    return 'Passasjer';
    case 61:
    return 'Passasjer, Farlig kategori A';
    case 62:
    return 'Passasjer, Farlig kategori B';
    case 63:
    return 'Passasjer, Farlig kategori C';
    case 64:
    return 'Passasjer, Farlig kategori D';
    case 68:
    return 'Passasjer';
    case 69:
    return 'Passasjer';
    case 70:
    return 'Last';
    case 71:
    return 'Last, Farlig kategori A';
    case 72:
    return 'Last, Farlig kategori B';
    case 73:
    return 'Last, Farlig kategori C';
    case 74:
    return 'Last, Farlig kategori D';
    case 78:
    return 'Last';
    case 79:
    return 'Last';
    case 80:
    return 'Tanker';
    case 81:
    return 'Tanker, Farlig kategori A';
    case 82:
    return 'Tanker, Farlig kategori B';
    case 83:
    return 'Tanker, Farlig kategori C';
    case 84:
    return 'Tanker, Farlig kategori D';
    case 88:
    return 'Tanker';
    case 89:
    return 'Tanker';
    case 90:
    return 'Annen type';
    case 91:
    return 'Annen type, Farlig kategori A';
    case 92:
    return 'Annen type, Farlig kategori B';
    case 93:
    return 'Annen type, Farlig kategori C';
    case 94:
    return 'Annen type, Farlig kategori D';
    case 98:
    return 'Annen type';
    case 99:
    return 'Annen type';
    default:
    return 'Ukjent skipstype';
  }
}

  // Carousel
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    if (isCarouselActive && ships.length > 0) {
      const interval = setInterval(() => {
        setActiveMarkerIndex((prevIndex) => (prevIndex + 1) % ships.length);

        // Closes the popup of the previous marker
        if (markerRefs.current[activeMarkerIndex]) {
          setActivePopup(null);
          markerRefs.current[activeMarkerIndex].openPopup();
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [ships, isCarouselActive, activeMarkerIndex]);

  // Opens the popup for the active marker when activeMarkerIndex changes
  useEffect(() => {
    if (markerRefs.current[activeMarkerIndex]) {
      if (isCarouselActive || activeMarkerIndex === 0) {
        if (activePopup) {
          activePopup.closePopup();
        }
        const newPopup = markerRefs.current[activeMarkerIndex].openPopup();
        setActivePopup(newPopup);
      }
    }
  }, [activeMarkerIndex, isCarouselActive, activePopup]);

  // Sets up event source for Server-Sent Events (SSE) and handles incoming data
  useEffect(() => {
   const eventSource = new EventSource('http://localhost:5000/sse');

    // When a new message is received from SSE, update the state of the ships
    eventSource.onmessage = (event) => {
      console.log('EventSource.onmessage activated.');
      const data = event.data;
      try {
        const parsedData = JSON.parse(data);
        // Wipes and replace the current ships with the new ones
        setShips(() => {
          return [...parsedData];
        });

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

  const boatIcon = new L.Icon({
    iconUrl: darkMode ? '/boat-icon-white.png' : '/boat-icon.png',
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
      .filter((ship) => {
    const msgTime = new Date(ship.msgtime);
    const currentTime = new Date();
    const diffInMinutes = (currentTime - msgTime) / 1000 / 60;
    return diffInMinutes <= 15;
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
          icon={boatIcon}
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
            autoPanPadding={
              isMobileDevice()
                ? L.point(20, 200)
                : window.innerWidth >= 1280 && window.innerWidth <= 1440
                ? L.point(300, 50)
                : L.point(300, 200)
            }
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
            <p><span className="bolded-text">Skipstype: </span><span className="normal-text">{getShipTypeText(ship.shipType)}</span></p>
            <p><span className="bolded-text">Fart: </span><span className="normal-text">{ship.speedOverGround === 0 ? 'Ingen' : `${ship.speedOverGround} knop`}</span></p>
            <p><span className="bolded-text">Stevning: </span><span className="normal-text">{ship.trueHeading === null ? 'Ingen' : `${ship.trueHeading}°`}</span></p>
            <p><span className="bolded-text">Kurs: </span><span className="normal-text">{ship.courseOverGround == null ? 'Ingen' : (ship.courseOverGround === 0 ? 'Ingen' : `${ship.courseOverGround}°`)}</span></p>
            <p><span className="bolded-text">Sist oppdatert: </span><span className="normal-text">{diffInSeconds < 15 ? 'Nå' : diffInSeconds < 60 ? `${diffInSeconds} sekunder siden` : `${Math.floor(diffInSeconds / 60)} minutt${Math.floor(diffInSeconds / 60) > 1 ? 'er' : ''} siden`}</span></p>
          </div>
        </Popup>
      </Marker>
    );
  });

  // Carousel
  const markerPositions = markers.map((marker) => [marker.props.position[0], marker.props.position[1]]);

  // Renders the MapContainer component with the ship markers
  return (
      <div className="map-container">
        <MapContainer
            center={markerPositions.length > 0 ? markerPositions[0] : [63.442593, 10.4]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            maxZoom={19}
            minZoom={5}
            attributionControl={false}
        >
          <TileLayer url={darkMode ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"} />
          {markers}
          <FullscreenControl />
          <FullscreenInfoBox darkMode={darkMode} />
          <SetZoomOnCarouselActive isActive={isCarouselActive} />
          <ConditionalZoomControl position="bottomright" />
        </MapContainer>
      </div>
  );
}

export default Map;
