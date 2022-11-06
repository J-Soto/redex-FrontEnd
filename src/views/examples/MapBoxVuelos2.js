/* eslint-disable react-hooks/exhaustive-deps */
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from '@turf/turf';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ClockTime from './ClockTime';

mapboxgl.workerClass = MapboxWorker;





const MapBox = ({dataVuelos}) => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';

    const mapBox = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    const [currentTime, setCurrentTime] = useState(new Date())
    const [counterFlight, setCounterFlight] = useState(299);
    const [vuelos, setVuelos] = useState([]);

    var cantVuelos = 45;
    var steps = 80;

    const addFlight = () => { 
        let featureIdx = 0

        vuelos.forEach((vuelo) =>{

            console.log(vuelo);

            const route = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[vuelo.takeOffAirportLo, vuelo.takeOffAirportLa], [vuelo.arrivalAirportLo,vuelo.arrivalAirportLa]],
    
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
                            description: `FROM: ${vuelo.takeOffAirportD} To: ${vuelo.arrivalAirportD} ID: ${vuelo.id}`
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [vuelo.takeOffAirportLo, vuelo.takeOffAirportLa]
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
    
            mapBox.current.on('load', function() {    
                mapBox.current.addSource("route"+vuelo.id, {
                    type: "geojson",
                    data: route,
                });
        
                mapBox.current.addSource("point"+vuelo.id, {
                    type: "geojson",
                    data: point,
                });
        
                mapBox.current.addLayer({
                    id: "route"+vuelo.id,
                    source: "route"+vuelo.id,
                    type: "line",
                    paint: {
                        "line-width": 2,
                        "line-color": "#007cbf",
                    },
                });
            
                mapBox.current.addLayer({
                    id: "point"+vuelo.id,
                    source: "point"+vuelo.id,
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

        })
    }

    const animate = (featureIdx, cntr, time) => {

        // console.log(mapBox.current.getSource("route"+featureIdx));

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


    const incrementCounter = useCallback(() => {
        setCounterFlight((v) => v + 1);
    });
    
    
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

        if(dataVuelos.length > 0){
            setCounterFlight(counterFlight+1);
        }

    },[]);

    useEffect(() =>{
  
        if(dataVuelos.length>0){
            let takeOff, arrival, takeOff_hh, takeOff_mi, arrival_hh,arrival_mi;
            let vuelos = [];

            dataVuelos.forEach((element) => {
                takeOff = new Date();
                [takeOff_hh,takeOff_mi] = element.takeOffTime.split(/[/:\-T]/);       
                arrival = new Date();            
                [arrival_hh,arrival_mi] = element.takeOffTime.split(/[/:\-T]/);       

                vuelos.push({
                    takeOffAirportLo: element.takeOffAirport.longitude,
                    takeOffAirportLa: element.takeOffAirport.latitude,
                    takeOffAirportD: element.takeOffAirport.description,
                    arrivalAirportLo: element.arrivalAirport.longitude,
                    arrivalAirportLa: element.arrivalAirport.latitude,
                    arrivalAirportD: element.arrivalAirport.description,
                    fechaPartida: takeOff,
                    hP: takeOff_hh,
                    mP: takeOff_mi,
                    fechaDestino: arrival,    
                    hD: arrival_hh,
                    mD: arrival_mi,
                    capacidad: element.capacity,       
                    id: element.idFlight - 1         
                });

            });
            // vuelos.reverse();
            vuelos.splice(0, 300);
            vuelos.splice(100);
            setVuelos(vuelos);       
            
            console.log(vuelos);

        }

        

    }, [dataVuelos])

    useEffect(() =>{
        if(vuelos.length > 0){
            addFlight();
        }
    }, [vuelos])

    useEffect(() =>{
        if(counterFlight >= 0 && counterFlight < 351 && vuelos.length > 0){
            let h, m;            

            (currentTime.getHours() < 10) ?  h = "0" + currentTime.getHours() : h = currentTime.getHours();
            (currentTime.getMinutes() < 10) ?  m = "0" + currentTime.getMinutes() : m = currentTime.getMinutes();

            if( (vuelos[counterFlight-300].hP === (h)) && (vuelos[counterFlight-300].mP<=(m)) ){
                console.log(vuelos[counterFlight-300]);                
                setTimeout(() => {
                    animate(counterFlight, 0, counterFlight-300);
                }, 1000);

                if (Math.random() > 0.5) {
                    incrementCounter();
                }
            }                 
        }
    },[counterFlight, currentTime])


   
    return(
        <div>

           <ClockTime setCurrentTime={setCurrentTime}/>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginBottom: "10px" }} />
        </div>
    )
}



export default MapBox