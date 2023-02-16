import ReactDOMServer from 'react-dom/server';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import {MapContainer, TileLayer, Popup, Marker, useMapEvent} from "react-leaflet";
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import Leaflet from "leaflet";
import css from './SecondMap.module.css'
import {useEffect, useState} from "react";
import {Paper, Typography} from "@mui/material";

const defaultLocation = [63.486112, 10.3980667]

function SecondMap({mode}) {
    const iconHTML = ReactDOMServer.renderToString(<DirectionsBoatIcon/>)
    const customMarkerIcon = new Leaflet.DivIcon({
        html: iconHTML,
        className: "dummy", // Needed for removing a white box which comes behind the icon
    });

    // usestate for setting a javascript
    // object for storing and using data
    const [data, setData] = useState({
        courseOverGround: "Testing",
        latitude: 63.566167,
        longitude: 9.898367,
        mmsi: 0,
        msgtime: "Today",
        name: "SUNDBÅTEN SYVER",
        rateOfTurn: 0,
        shipType: 0,
        speedOverGround: 0,
        trueHeading: 0
    });

    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setData({
                    courseOverGround: data.courseOverGround,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    mmsi: data.mmsi,
                    msgtime: data.msgtime,
                    name: data.name,
                    rateOfTurn: data.rateOfTurn,
                    shipType: data.shipType,
                    speedOverGround: data.speedOverGround,
                    trueHeading: data.trueHeading
                });
            })
        );
    }, []);

    if (mode === true) {
        return <Paper style={{height: "79vh"}}>
            <MapContainer
                className={`${css.mapDark}`}
                center={defaultLocation}
                zoom={10}
                scrollWheelZoom={true}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[data.latitude, data.longitude]} icon={customMarkerIcon}>
                    <Popup>
                        A marker which can show ship info <br/> Easily customizable with info and icons. <br/> Now in
                        dark mode.
                    </Popup>
                </Marker>
            </MapContainer>

        </Paper>
    } else return (
        <Paper style={{height: "79vh"}}>
            <MapContainer
                className={`${css.map}`}
                center={defaultLocation}
                zoom={10}
                scrollWheelZoom={true}
            >
                <MyComponent/>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[63.437237, 10.395087]} icon={customMarkerIcon}>
                    <Popup>
                        <ReturnData data={data}/>
                    </Popup>
                </Marker>
                <Marker position={[63.566167, 9.898367]} icon={customMarkerIcon}>
                    <Popup>
                        Testing interval!
                    </Popup>
                </Marker>
            </MapContainer>
        </Paper>
    );
}

/** Alternative map solutions. They are noe free.
 http://leaflet-extras.github.io/leaflet-providers/preview/
 https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
 https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png
 /*

 /**
 Function for returning data in the pop-up window
 TODO: Make it so that this data is presented more beautiful and that the data is gotten from the back-end
 */
function ReturnData({data}) {
    return (
        <Typography variant="body2">
            <ul>
                <li>courseOverGround: {data.courseOverGround}</li>
                <li>latitude: {data.latitude}</li>
                <li>longitude: {data.longitude}</li>
                <li>mmsi: {data.mmsi}</li>
                <li>msgtime: {data.msgtime}</li>
                <li>name: {data.name}</li>
                <li>rateOfTurn: {data.rateOfTurn}</li>
                <li>shipType: {data.shipType}</li>
                <li>speedOverGround: {data.speedOverGround}</li>
                <li>trueHeading: {data.trueHeading}</li>
            </ul>
        </Typography>
    )
}

/**
 * Uses the "useMapEvent" from react-leaflet to fly to a location on the map if that is clicked.
 * TODO: Make it so it recognizes markers to fly to
 * TODO: Make it so it goes to the next marker using an interval
 * @constructor
 */
function MyComponent() {
    const map = useMapEvent('click', () => {
        map.on({
            click: function (e) {
                map.flyTo(e.latlng, 15)
            }
        });
    })
}

export default SecondMap