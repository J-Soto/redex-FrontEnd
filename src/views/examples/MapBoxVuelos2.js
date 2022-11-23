/* eslint-disable react-hooks/exhaustive-deps */
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from '@turf/turf';
import PlaneImage from '../../assets/img/icons/common/Plane4.png'

import PlaneImage1 from '../../assets/img/icons/common/airplane-mode.png'
import PlaneImage2 from '../../assets/img/icons/common/airplane-mode2.png'
import PlaneImage3 from '../../assets/img/icons/common/airplane-mode3.png'
import PlaneImage4 from '../../assets/img/icons/common/airplane-mode4.png'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ClockTime from './ClockTime';
import { couldStartTrivia } from "typescript";

mapboxgl.workerClass = MapboxWorker;





const MapBox = ({dataVuelos,startDate,endDate}) => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';

    const mapBox = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    //const [currentTime, setCurrentTime] = useState(new Date())
    const [currentTime, setCurrentTime] = useState(startDate)
    const [counterFlight, setCounterFlight] = useState(-1);
    const [vuelos, setVuelos] = useState([]);
    const [cargado, setCargado] = useState(0);

    var cantVuelos = 50;
    var steps = 100;

    
    const addFlight = () => { 

        vuelos.forEach((vuelo) =>{
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
                        "line-width": 1.5,
                        "line-color": "#007cbf",
                    },
                });
            
                mapBox.current.addLayer({
                    id: "point"+vuelo.id,
                    source: "point"+vuelo.id,
                    type: "symbol",
                    layout: {
                        "icon-image": vuelo.capacidadUsada === 0 ? "plane1" : "plane2",
                        "icon-size": 1.5,
                        'icon-rotate': ['get', 'bearing'],
                        "icon-rotation-alignment": "map",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                    },
                    paint:{
                        "icon-color": "#186a7a"
                    }
                });    
    
            })   

            mapBox.current.on('mouseenter', 'point'+vuelo.id, (e) => {      
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;
                popup.setLngLat(coordinates).setHTML(description).addTo(mapBox.current);
            });
          
            mapBox.current.on('mouseleave', 'point'+vuelo.id, () => {
                popup.remove();
            });

        })
    }

    const animate = (featureIdx, cntr, time) => {

        setTimeout(() => {

            if (!mapBox.current.getLayer("route"+featureIdx)){
                return;
            }else{
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
            }

            

            mapBox.current.getSource("point"+featureIdx)._options.data.features[0].geometry.coordinates = mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr];
            
            mapBox.current.getSource("point"+featureIdx)._options.data.features[0].properties.bearing = turf.bearing(
                turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr - 1 : cntr]),
                turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr : cntr + 1])
            );

            mapBox.current.getSource("point"+featureIdx).setData(mapBox.current.getSource("point"+featureIdx)._options.data);

            if (cntr < steps) {
                animate(featureIdx, cntr + 1, time);
            }else{
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
            }
       }, time);
        
    }


    const incrementCounter = useCallback(() => {
        setCounterFlight((v) => v + 1);
    });
    

    // const orderFlights = (vuelosDatos) => {
	// 	var length=vuelosDatos.length;
	// 	for(var i=0; i<length; i++){
	// 		for(var j=0;j<length-1-i;j++){
	// 			if(vuelosDatos[j].takeOffTime>vuelosDatos[j+1].takeOffTime){
	// 				vuelosDatos = exchangePos(vuelosDatos,j);
	// 			}
	// 		}
	// 	}
	// }

	// const exchangePos = (orderedFlights,j) => {
	// 	var posJ=orderedFlights[j];
	// 	orderedFlights[j]=orderedFlights[j+1]
	// 	orderedFlights[j+1]=posJ;
	// 	return orderedFlights;
	// }


    
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

        mapBox.current.loadImage(PlaneImage1,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane1', image, {
              "sdf": "true"
            });        
          }
        );

        mapBox.current.loadImage(PlaneImage2,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane2', image, {
              "sdf": "true"
            });        
          }
        );

        mapBox.current.loadImage(PlaneImage3,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane3', image, {
              "sdf": "true"
            });        
          }
        );

        mapBox.current.loadImage(PlaneImage4,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane4', image, {
              "sdf": "true"
            });        
          }
        );



    },[]);

    useEffect(() =>{
        if(dataVuelos.length>0){
            dataVuelos.splice(cantVuelos);
            setVuelos(dataVuelos);   
            console.log(vuelos);

        }  
    }, [dataVuelos])

    useEffect(() =>{        
        if(vuelos.length > 0){
            console.log(vuelos);
            addFlight();
        }
    }, [vuelos])

    useEffect(() =>{
        if(currentTime.getDate() < startDate.getDate()+4){
            if(counterFlight >= 0 && counterFlight < cantVuelos && vuelos.length > 0){
                let h, m;            

                h = currentTime.getHours();
                m = currentTime.getMinutes();

                if( (vuelos[counterFlight].hP0 === (h)) && (vuelos[counterFlight].mP<=(m)) ){           
                    setTimeout(() => {
                        animate(counterFlight, 0, vuelos[counterFlight].duracion*8.9);
                    }, 500);
    
                    if (Math.random() > 0.01) {
                        incrementCounter();
                    }
                }
                
                if((currentTime.getHours() === 23 && currentTime.getMinutes() >= 0) ){
                    if (!cargado) {
                        addFlight(); 
                        setCargado(1);
                    } 
                }


                if((currentTime.getHours() === 23 && currentTime.getMinutes() >= 50) ){
                    setCounterFlight(0);
                    setCargado(0);
                }
                
            }else{
                
                if((currentTime.getHours() === 23 && currentTime.getMinutes() >= 50) ){
                    setCounterFlight(0);
                    setCargado(0);
                }
            }
        }

        


    },[counterFlight, currentTime])


   
    return(
        <div>

           <ClockTime setCurrentTime={setCurrentTime} startDate={startDate}/>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginBottom: "10px" }} />
        </div>
    )
}



export default MapBox