import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom";

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
            zoom: zoom,
            projection: 'mercator'
        });


        var route = {
            type: "FeatureCollection",
            features: [],
        };

        var point = {
            type: "FeatureCollection",
            features: [],
        };

        for(var k=0; k<50; k++){
            route.features.push( 
                {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: [[data[k].takeOffAirport.longitude, data[k].takeOffAirport.latitude], [data[k].arrivalAirport.longitude, data[k].arrivalAirport.latitude]],
                    }
                }
            )

            point.features.push(
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Point",
                        coordinates: [data[k].takeOffAirport.longitude, data[k].takeOffAirport.latitude]
                    },
                }
            )    

        }


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
      
        var steps = 500;
    
        for (var j = 0; j<route.features.length; j++){
            var lineDistance = turf.length(route.features[j]);
            var arc = [];

            for (var i = 0; i < lineDistance; i += lineDistance / steps) {
                var segment = turf.along(route.features[j], i);
                arc.push(segment.geometry.coordinates);
            }

            route.features[j].geometry.coordinates = arc;
        }

       

        // Used to increment the value of the point measurement against the route.
        var counter = 0;
    
        mapBox.on("load", function () {
            // Add a source and layer displaying a point which will be animated in a circle.
            mapBox.addSource("route", {
                type: "geojson",
                data: route,
            });
        
            mapBox.addSource("point", {
                type: "geojson",
                data: point,
            });
        
            mapBox.addLayer({
                id: "route",
                source: "route",
                type: "line",
                paint: {
                    "line-width": 2,
                    "line-color": "#007cbf",
                },
            });
        
            mapBox.addLayer({
                id: "point",
                source: "point",
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
        
            function animate(featureIdx, cntr) {
                // Update point geometry to a new position based on counter denoting
                // the index to access the arc.
                if (
                    cntr >= route.features[featureIdx].geometry.coordinates.length - 1
                ) {
                    return;
                }
                point.features[featureIdx].geometry.coordinates = route.features[featureIdx].geometry.coordinates[cntr];
                
                point.features[featureIdx].properties.bearing = turf.bearing(
                    turf.point(route.features[featureIdx].geometry.coordinates[cntr >= steps ? cntr - 1 : cntr]),
                    turf.point(route.features[featureIdx].geometry.coordinates[cntr >= steps ? cntr : cntr + 1])
                );
        
                // Update the source with this new data
                mapBox.getSource("point").setData(point);
        
                // Request the next frame of animation as long as the end has not been reached
                if (cntr < steps) {
                    requestAnimationFrame(function () {
                        animate(featureIdx, cntr + 1);
                    });
                }
            }
        
            document.getElementById("replay").addEventListener("click", function () {
                // Set the coordinates of the original point back to origin
                point.features[0].geometry.coordinates = origin;
        
                // Update the source layer
                mapBox.getSource("point").setData(point);
        
                // Reset the counter
                counter = 0;
        
                // Restart the animation
                for(var l=0; l<50; l++){
                    animate(l, counter);
                }
            });
        
            // Start the animation

            for(var l=0; l<50; l++){
                animate(l, 0);
            }

            // animate(0, 0);
            // animate(1, 0);


        });



        mapBox.addControl(new mapboxgl.NavigationControl(), "top-right");

        return () => mapBox.remove();

    });


   
    return(
        <div>

            <Row>
                <Col className="text-right">
                    <Button
                        id="replay"
                        className="btn-icon btn-3"
                        color="dark"
                        type="button"
                    >                        
                        <span className="btn-inner--text">Replay</span>
                    </Button> 

                </Col>
            </Row>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginTop: "10px" }} />
        </div>
    )
}



export default MapBox