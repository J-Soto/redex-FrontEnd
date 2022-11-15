/* eslint-disable react-hooks/exhaustive-deps */
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from '@turf/turf';
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
            console.log("CARGANDO");
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
                        "icon-image": "airport-15",
                        "icon-size": 1.5,
                        'icon-rotate': ['get', 'bearing'],
                        "icon-rotation-alignment": "map",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
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
    

    const orderFlights = (vuelosDatos) => {
		var length=vuelosDatos.length;
		for(var i=0; i<length; i++){
			for(var j=0;j<length-1-i;j++){
				if(vuelosDatos[j].takeOffTime>vuelosDatos[j+1].takeOffTime){
					vuelosDatos = exchangePos(vuelosDatos,j);
				}
			}
		}
	}

	const exchangePos = (orderedFlights,j) => {
		var posJ=orderedFlights[j];
		orderedFlights[j]=orderedFlights[j+1]
		orderedFlights[j+1]=posJ;
		return orderedFlights;
	}


    
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

        let counter = 0;

        if(dataVuelos.length>0){
            // let takeOff, arrival, takeOff_hh, takeOff_mi, arrival_hh, arrival_mi, duracionH, duracionM, duracionT;
            // let vuelosDatos = [];
            // let takeOff_hh_utc0, arrival_hh_utc0, utc0P, utc0D, caltakeOffTime;

            // dataVuelos.forEach((element) => {
            //     takeOff = new Date();
            //     [takeOff_hh,takeOff_mi] = element.takeOffTime.split(/[/:\-T]/);       
            //     arrival = new Date();            
            //     [arrival_hh,arrival_mi] = element.arrivalTime.split(/[/:\-T]/); 
                
            //     utc0P = element.takeOffAirport.city.country.utc;
            //     takeOff_hh_utc0 = (takeOff_hh - utc0P > 24) ? takeOff_hh - utc0P - 24 : (takeOff_hh - utc0P > 0) ? takeOff_hh - utc0P : 24 - takeOff_hh - utc0P;
            //     utc0D = element.arrivalAirport.city.country.utc;
            //     arrival_hh_utc0 = (arrival_hh - utc0D > 24) ? arrival_hh - utc0D - 24 : (arrival_hh - utc0D > 0) ? arrival_hh - utc0D : 24 - arrival_hh - utc0D;
                
            //     caltakeOffTime = parseInt(takeOff_hh_utc0*100 + parseInt(takeOff_mi));
            //     duracionH = (takeOff_hh > arrival_hh) ? (24-takeOff_hh+arrival_hh)*60 : (arrival_hh-takeOff_hh)*60;
            //     duracionM = (takeOff_mi > arrival_mi) ? (60-takeOff_mi+arrival_mi) : (arrival_mi-takeOff_mi);
            //     duracionT = Math.round(((duracionH + duracionM)*1.6/10));

            //     vuelosDatos.push({
            //         takeOffAirportLo: element.takeOffAirport.longitude,
            //         takeOffAirportLa: element.takeOffAirport.latitude,
            //         takeOffAirportD: element.takeOffAirport.description,
            //         arrivalAirportLo: element.arrivalAirport.longitude,
            //         arrivalAirportLa: element.arrivalAirport.latitude,
            //         arrivalAirportD: element.arrivalAirport.description,
            //         fechaPartida: takeOff,
            //         hP: takeOff_hh,
            //         hP0: takeOff_hh_utc0,
            //         mP: takeOff_mi,
            //         fechaDestino: arrival,    
            //         hD: arrival_hh,
            //         hD0: arrival_hh_utc0,
            //         mD: arrival_mi,
            //         capacidad: element.capacity,       
            //         id: counter,
            //         duracion: duracionT,
            //         takeOffTime: caltakeOffTime,
            //         idReal:  element.idFlight
            //     });

            //     counter = counter + 1;

            // });

            // orderFlights(vuelosDatos); 
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
            // console.log(currentTime.getDate());  
            // console.log(startDate.getDate()+4);  

            if(counterFlight >= 0 && counterFlight < cantVuelos && vuelos.length > 0){
                let h, m;            
    
                // (currentTime.getHours() < 10) ?  h = "0" + currentTime.getHours() : h = currentTime.getHours();
                // (currentTime.getMinutes() < 10) ?  m = "0" + currentTime.getMinutes() : m = currentTime.getMinutes();
                // console.log(h);
                // console.log(vuelos[counterFlight].hP0);


                h = currentTime.getHours();
                m = currentTime.getMinutes();

                if( (vuelos[counterFlight].hP0 === (h)) && (vuelos[counterFlight].mP<=(m)) ){
                    console.log(counterFlight);
                    // console.log(vuelos[counterFlight]);                
                    setTimeout(() => {
                        animate(counterFlight, 0, vuelos[counterFlight].duracion*8.9);
                    }, 500);
    
                    if (Math.random() > 0.01) {
                        incrementCounter();
                    }
                }
                
                if((currentTime.getHours() === 23 && currentTime.getMinutes() >= 0) ){
                    if (!cargado) {
                        console.log("CARGANDO VUELOS");
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