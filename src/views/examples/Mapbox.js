import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom";

import {	
	Button,
	Row,
	Col	
} from "reactstrap";

import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import 'mapbox-gl/dist/mapbox-gl.css'; 

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
mapboxgl.workerClass = MapboxWorker;

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';



const MapBox = ({data}) => {

    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    const [projection, setProjection] = useState('mercator');

    const changeProjection = () => {
        if(projection === 'mercator'){
            setProjection('globe')
        }else{
            setProjection('mercator')
        }       
    };


    useEffect(() => {
     
        const mapBox = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [lng, lat],
            zoom: zoom
        });
        
    });


   
    return(
        <div>   
            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginTop: "10px" }} />
        </div>
    )
}



export default MapBox