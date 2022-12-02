import React, { useRef, useEffect, useState } from 'react';
import AirportImage1 from '../../assets/img/icons/common/Airport_blue.png'
import AirportImage2 from '../../assets/img/icons/common/Airport_purple.png'
import Legend from './Legend';
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

        // mapBox.current.loadImage(AirportImage,
        //     (error, image) => {
        //     if (error) throw error;
              
        //     // Add the image to the map style.
        //     mapBox.current.addImage('airport', image, {
        //       "sdf": "true"
        //     });
        //   }
        // );

        mapBox.current.setRenderWorldCopies(false);

        data.forEach((airport) =>{
            let arrayHtml = [];

            if(airport.city.country.continent.id === 1){
                arrayHtml.push(document.createElement("div"));
                arrayHtml[0].className = "marker";
                arrayHtml[0].style.backgroundImage = `url(${AirportImage1})`;
                arrayHtml[0].style.width = `16px`;
                arrayHtml[0].style.height = `16px`;
                arrayHtml[0].style.backgroundSize = "100%";
                //arrayHtml[0].style.filter = "invert(10%) sepia(70%) saturate(3000%) hue-rotate(355deg) brightness(80%) contrast(10%)";    

                new mapboxgl.Marker(arrayHtml[0])
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
                    arrayHtml.push(document.createElement("div"));
                    arrayHtml[0].className = "marker";
                    arrayHtml[0].style.backgroundImage = `url(${AirportImage2})`;
                    arrayHtml[0].style.width = `16px`;
                    arrayHtml[0].style.height = `16px`;
                    arrayHtml[0].style.backgroundSize = "100%";
                    //arrayHtml[0].style.filter = "invert(38%) sepia(23%) saturate(6553%) hue-rotate(3deg) brightness(60%) contrast(20%)";    
    

                    new mapboxgl.Marker(arrayHtml[0])
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
        <>
            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginTop: "10px", marginBottom: "10px" }} />

            <Legend tipo={0}/>

        </>
    )
}



export default MapBox