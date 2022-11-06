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

    const mapBox = useRef(null);
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

        if(mapBox.current) return;
        mapBox.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            dragRotate: false,
            projection: projection
        });

        mapBox.current.setRenderWorldCopies(false);

        data.forEach((airport) =>{

            if(airport.city.country.continent.id === 1){
                new mapboxgl.Marker({ color: 'red' })
                .setLngLat([airport.longitude, airport.latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
                    )
                )
                .addTo(mapBox.current);
            }else{
                if(airport.city.country.continent.id === 2){
                    new mapboxgl.Marker({ color: '#8395B2' })
                    .setLngLat([airport.longitude, airport.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
                        )
                    )
                    .addTo(mapBox.current);         
                }else{
                    new mapboxgl.Marker({ color: '#85DD86' })
                    .setLngLat([airport.longitude, airport.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
                        )
                    )
                    .addTo(mapBox.current); 
                }                      
            }           
            
        })

        // mapBox.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // return () => mapBox.remove();

    });


   
    return(
        <div>

            <Row>
                <Col className="text-right">
                    <Button
                        className="btn-icon btn-3"
                        color="dark"
                        type="button"
                        onClick={() => changeProjection()}>
                        <span className="btn-inner--icon">
                            <i className="fas fa-eye" />
                        </span>
                        <span className="btn-inner--text">Proyección</span>
                    </Button>                    
                </Col>
            </Row>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginTop: "10px" }} />
        </div>
    )
}



export default MapBox