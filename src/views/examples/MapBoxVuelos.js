import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import ClockTime from './ClockTime';
import {	
	Button,
	Row,
	Col	
} from "reactstrap";

import * as turf from '@turf/turf';
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import 'mapbox-gl/dist/mapbox-gl.css'; 

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
mapboxgl.workerClass = MapboxWorker;

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';



const MapBox = ({dataVuelos}) => {

    const mapBox = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    const [projection, setProjection] = useState('mercator');
    const [currentTime, setCurrentTime] = useState(new Date().getTime())
    const [cargando, setCargando] = useState(true);

    var activo = [];
    var cantVuelos = 50;


    const changeProjection = () => {
        if(projection === 'mercator'){
            setProjection('globe')
        }else{
            setProjection('mercator')
        }       
    };




    var steps = 500;


    
    


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

        mapBox.current.on('load', function(){
            for(var k=0; k<cantVuelos; k++){

                const route = {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: [[dataVuelos[k].takeOffAirport.longitude, dataVuelos[k].takeOffAirport.latitude], [dataVuelos[k].arrivalAirport.longitude, dataVuelos[k].arrivalAirport.latitude]],
    
                            }
                        }
                    ]
                };
            
                const point = {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: [dataVuelos[k].takeOffAirport.longitude, dataVuelos[k].takeOffAirport.latitude]
                            }
                        }
                    ]
                };
    
    
    
                // route.features.push( 
                //     {
                //         type: "Feature",
                //         geometry: {
                //             type: "LineString",
                //             coordinates: [[data[k].takeOffAirport.longitude, data[k].takeOffAirport.latitude], [data[k].arrivalAirport.longitude, data[k].arrivalAirport.latitude]],
                //         }
                //     }
                // )
    
                // point.features.push(
                //     {
                //         type: "Feature",
                //         properties: {},
                //         geometry: {
                //             type: "Point",
                //             coordinates: [data[k].takeOffAirport.longitude, data[k].takeOffAirport.latitude]
                //         },
                //     }
                // )
                
                var lineDistance = turf.length(route.features[0]);
                var arc = [];
    
                for (var i = 0; i < lineDistance; i += lineDistance / steps) {
                    var segment = turf.along(route.features[0], i);
                    arc.push(segment.geometry.coordinates);
                }
    
                route.features[0].geometry.coordinates = arc;
                
                console.log(dataVuelos[k].takeOffTime >= currentTime);
                
                // if(dataVuelos[k].takeOffTime >= currentTime){
    
                    mapBox.current.addSource("route"+k, {
                        type: "geojson",
                        data: route,
                    });
        
                    mapBox.current.addSource("point"+k, {
                        type: "geojson",
                        data: point,
                    });
        
                    mapBox.current.addLayer({
                        id: "route"+k,
                        source: "route"+k,
                        type: "line",
                        paint: {
                            "line-width": 2,
                            "line-color": "#007cbf",
                        },
                    });
                
                    mapBox.current.addLayer({
                        id: "point"+k,
                        source: "point"+k,
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
                              
                // }
                
                activo.push(0);

                animate(k, 0);

                // for(var l=0; l<cantVuelos; l++){ 
                //     // if(data[l].takeOffTime >= currentTime){
                //         if(activo[l] !== 1){
                //             console.log("Animando");
                            
                //             activo[l] = 1;
                            
                //         }
                //     // }          
                // }
            }
        });


        

        


        // data.forEach((flight) =>{

        //     if(airport.city.country.continent.id === 1){
        //         new mapboxgl.Marker({ color: 'red' })
        //         .setLngLat([airport.longitude, airport.latitude])
        //         .setPopup(
        //             new mapboxgl.Popup({ offset: 25 }) // add popups
        //             .setHTML(
        //                 `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
        //             )
        //         )
        //         .addTo(mapBox);
        //     }else{
        //         if(airport.city.country.continent.id === 2){
        //             new mapboxgl.Marker({ color: '#8395B2' })
        //             .setLngLat([airport.longitude, airport.latitude])
        //             .setPopup(
        //                 new mapboxgl.Popup({ offset: 25 }) // add popups
        //                 .setHTML(
        //                     `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
        //                 )
        //             )
        //             .addTo(mapBox);         
        //         }else{
        //             new mapboxgl.Marker({ color: '#85DD86' })
        //             .setLngLat([airport.longitude, airport.latitude])
        //             .setPopup(
        //                 new mapboxgl.Popup({ offset: 25 }) // add popups
        //                 .setHTML(
        //                     `<h3>${airport.description}</h3><p>${airport.city.name + ', ' + airport.city.country.name}</p>`
        //                 )
        //             )
        //             .addTo(mapBox); 
        //         }                      
        //     }           
            
        // })

        // var origin = [-122.414, 37.776];
        // var origin_2 = [-100, 37.676];

        // // Washington DC
        // var destination = [-77.032, 38.913];
        // var destination_2 = [-67.032, 58.913];

        // A simple line from origin to destination.
        // var route = {
        //     type: "FeatureCollection",
        //     features: [
        //         {
        //             type: "Feature",
        //             geometry: {
        //                 type: "LineString",
        //                 coordinates: [origin_2, destination_2],
        //             },
        //         },
        //         {
        //             type: "Feature",
        //             geometry: {
        //                 type: "LineString",
        //                 coordinates: [origin, destination],
        //             },
        //         },
        //     ],
        // };

        // var point = {
        //     type: "FeatureCollection",
        //     features: [
        //         {
        //             type: "Feature",
        //             properties: {},
        //             geometry: {
        //                 type: "Point",
        //                 coordinates: origin_2,
        //             },
        //         },
        //         {
        //             type: "Feature",
        //             properties: {},
        //             geometry: {
        //                 type: "Point",
        //                 coordinates: origin,
        //             },
        //         },
        //     ],
        // };
      
        
    
        // for (var j = 0; j<route.features.length; j++){
        //     var lineDistance = turf.length(route.features[j]);
        //     var arc = [];

        //     for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        //         var segment = turf.along(route.features[j], i);
        //         arc.push(segment.geometry.coordinates);
        //     }

        //     route.features[j].geometry.coordinates = arc;
        // }

       

        // Used to increment the value of the point measurement against the route.
        
    
        // mapBox.current.on("load", function () {
        //     // Add a source and layer displaying a point which will be animated in a circle.
        //     mapBox.current.addSource("route", {
        //         type: "geojson",
        //         data: route,
        //     });
        
        //     mapBox.current.addSource("point", {
        //         type: "geojson",
        //         data: point,
        //     });
        
        //     mapBox.current.addLayer({
        //         id: "route",
        //         source: "route",
        //         type: "line",
        //         paint: {
        //             "line-width": 2,
        //             "line-color": "#007cbf",
        //         },
        //     });
        
        //     mapBox.current.addLayer({
        //         id: "point",
        //         source: "point",
        //         type: "symbol",
        //         layout: {
        //             "icon-image": "airport-15",
        //             "icon-size": 1.5,
        //             'icon-rotate': ['get', 'bearing'],
        //             "icon-rotation-alignment": "map",
        //             "icon-allow-overlap": true,
        //             "icon-ignore-placement": true,
        //         },
        //     });
        
            
        
        //     document.getElementById("replay").addEventListener("click", function () {
        //         // Set the coordinates of the original point back to origin
        //         point.features[0].geometry.coordinates = origin;
        
        //         // Update the source layer
        //         mapBox.current.getSource("point").setData(point);
        
        //         // Reset the counter
        //         counter = 0;
        
        //         // Restart the animation
        //         for(var l=0; l<cantVuelos; l++){
        //             animate(l, counter);
        //         }
        //     });

       
        //     // Start the animation


        //     for(var l=0; l<cantVuelos; l++){ 
                
        //         if(activo[l] !== 1){
        //             animate(l, 0);
        //             activo[l] = 1;
                    
        //         }
                
        //     }

        // });
        


        
  
        

    });


    // useEffect(() =>{
    //     console.log(cargando);
    //     if(!cargando){
    //         console.log("Entrando");
    //         for(var l=0; l<cantVuelos; l++){ 
    //             // if(data[l].takeOffTime >= currentTime){
    //                 if(activo[l] !== 1){
    //                     console.log("Animando");
    //                     animate(l, 0);
    //                     activo[l] = 1;
                        
    //                 }
    //             // }          
    //         }
    //     }
        

    // },[currentTime])


    function animate(featureIdx, cntr) {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
       
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
            
            // mapBox.removeLayer("point"+featureIdx);
            // mapBox.removeSource("route"+featureIdx);
            // mapBox.removeSource("point"+featureIdx);

            return;
        }

        mapBox.current.getSource("point"+featureIdx)._options.data.features[0].geometry.coordinates = mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr];
        
        mapBox.current.getSource("point"+featureIdx)._options.data.features[0].properties.bearing = turf.bearing(
            turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr - 1 : cntr]),
            turf.point(mapBox.current.getSource("route"+featureIdx)._data.features[0].geometry.coordinates[cntr >= steps ? cntr : cntr + 1])
        );

        // Update the source with this new data
        mapBox.current.getSource("point"+featureIdx).setData(mapBox.current.getSource("point"+featureIdx)._options.data);

        // Request the next frame of animation as long as the end has not been reached
        if (cntr < steps) {
            requestAnimationFrame(function () {
                animate(featureIdx, cntr + 1);
            });
        }
    }




   
    return(
        <div>

           <ClockTime setCurrentTime={setCurrentTime}/>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginTop: "10px", marginBottom: "10px" }} />
        </div>
    )
}



export default MapBox