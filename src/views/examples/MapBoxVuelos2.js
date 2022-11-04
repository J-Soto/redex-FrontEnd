import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from '@turf/turf';
import React, { useRef, useEffect, useState } from 'react';
import ClockTime from './ClockTime';

mapboxgl.workerClass = MapboxWorker;

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';



const MapBox = ({dataVuelos}) => {

    const mapBox = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    const [currentTime, setCurrentTime] = useState(new Date().getTime())

    const [counterFlight, setCounterFlight] = useState(-1);

    var activo = [];
    var cantVuelos = 40;

    var steps = 80;

    
    useEffect(() =>{
        if(dataVuelos.length > 0){
            setCounterFlight(counterFlight+1);
        }
            
    },[dataVuelos])


    useEffect(() =>{
        if(counterFlight >= 0 && counterFlight < cantVuelos && dataVuelos.length > 0){
            addFlight(counterFlight);
            setCounterFlight(counterFlight+1);
        }
    },[counterFlight])

    
    useEffect(() => {                
        if(mapBox.current) return;
        mapBox.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            dragRotate: false
        });

        mapBox.current.setRenderWorldCopies(false);

        

    });



    function addFlight(featureIdx){
        const route = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[dataVuelos[featureIdx].takeOffAirport.longitude, dataVuelos[featureIdx].takeOffAirport.latitude], [dataVuelos[featureIdx].arrivalAirport.longitude, dataVuelos[featureIdx].arrivalAirport.latitude]],

                    }
                }
            ]
        };
    
        const point = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        description: `FROM: ${dataVuelos[featureIdx].takeOffAirport.description} To: ${dataVuelos[featureIdx].arrivalAirport.description}`
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [dataVuelos[featureIdx].takeOffAirport.longitude, dataVuelos[featureIdx].takeOffAirport.latitude]
                    }
                }
            ]
        };


        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });
      

        var lineDistance = turf.length(route.features[0]);
        var arc = [];

        for (var i = 0; i < lineDistance; i += lineDistance / steps) {
            var segment = turf.along(route.features[0], i);
            arc.push(segment.geometry.coordinates);
        }

        route.features[0].geometry.coordinates = arc;

        mapBox.current.on('load', () => {

            mapBox.current.addSource("route"+featureIdx, {
                type: "geojson",
                data: route,
            });
    
            mapBox.current.addSource("point"+featureIdx, {
                type: "geojson",
                data: point,
            });
    
            mapBox.current.addLayer({
                id: "route"+featureIdx,
                source: "route"+featureIdx,
                type: "line",
                paint: {
                    "line-width": 2,
                    "line-color": "#007cbf",
                },
            });
        
            mapBox.current.addLayer({
                id: "point"+featureIdx,
                source: "point"+featureIdx,
                type: "symbol",
                layout: {
                    "icon-image": "airport-15",
                    "icon-size": 1.5,
                    'icon-rotate': ['get', 'bearing'],
                    "icon-rotation-alignment": "map",
                    "icon-allow-overlap": true,
                    "icon-ignore-placement": true,
                },
            });    

        })
        

        mapBox.current.on('mouseenter', 'point'+featureIdx, (e) => {      
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            popup.setLngLat(coordinates).setHTML(description).addTo(mapBox.current);
          });
      
          mapBox.current.on('mouseleave', 'point'+featureIdx, () => {
            popup.remove();
          });

        setTimeout(() => {
            animate(featureIdx, 0, featureIdx);
        }, 1000);

    }

    function animate(featureIdx, cntr, time) {
        setTimeout(() => {
            if (
                cntr >= mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates.length - 1
            ) {
                if(mapBox.current.getLayer("route"+featureIdx)){
                    mapBox.current.removeLayer("route"+featureIdx);
                }
                if(mapBox.current.getLayer("point"+featureIdx)){
                    mapBox.current.removeLayer("point"+featureIdx);
                }
                if(mapBox.current.getSource("route"+featureIdx)){
                    mapBox.current.removeSource("route"+featureIdx);
                }
                if(mapBox.current.getSource("point"+featureIdx)){
                    mapBox.current.removeSource("point"+featureIdx);
                }
                return;
            }

            mapBox.current.getSource("point"+featureIdx)._options.data.features[0].geometry.coordinates = mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr];
            
            mapBox.current.getSource("point"+featureIdx)._options.data.features[0].properties.bearing = turf.bearing(
                turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr - 1 : cntr]),
                turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr : cntr + 1])
            );

            mapBox.current.getSource("point"+featureIdx).setData(mapBox.current.getSource("point"+featureIdx)._options.data);

            if (cntr < steps) {
                requestAnimationFrame(function () {
                    animate(featureIdx, cntr + 1, time);
                });
            }
       }, 1000 + time*100);
        
    }




   
    return(
        <div>

           <ClockTime setCurrentTime={setCurrentTime}/>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginBottom: "10px" }} />
        </div>
    )
}



export default MapBox