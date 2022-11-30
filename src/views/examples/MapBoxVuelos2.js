/* eslint-disable react-hooks/exhaustive-deps */
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import * as turf from '@turf/turf';

import PlaneImage1 from '../../assets/img/icons/common/airplane-mode.png'
import PlaneImage2 from '../../assets/img/icons/common/airplane-mode3.png'
import PlaneImage3 from '../../assets/img/icons/common/airplane-mode4.png'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ClockTime from './ClockTime';
import Legend from './Legend';
import APIShipment from  "../../apis/APIShipment.js";

import {	
	Alert,
    Row,
    Card,
    CardFooter,
    Table,	
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";

mapboxgl.workerClass = MapboxWorker;


var moment = require("moment");
require("moment/locale/es");


const MapBox = ({dataVuelos, startDate, endDate, zip}) => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VybnV0ZWh6IiwiYSI6ImNsOXVuYjMzMzAwNG8zdWxhY2dlZzJhMzEifQ.rEKkvxvnjNKLc5Q8uSlZ1A';

    const mapBox = useRef(null);
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(1.2);
    //const [currentTime, setCurrentTime] = useState(new Date())
    const [currentTime, setCurrentTime] = useState(startDate)
    const [counterFlight, setCounterFlight] = useState(-1);
    const [counterFlightA, setCounterFlightA] = useState(-1);
    const [vuelos, setVuelos] = useState([]);
    const [vuelosD, setVuelosD] = useState([]);
    const [envios, setEnvios] = useState([]);
    const [paginas, setPaginas] = useState(0);
    const [pagina, setPagina] = useState(0);
    const [paginasItems, setPaginasItems] = useState([]);
    const [semaforo, setSemaforo] = useState(true);
    const [cargado, setCargado] = useState(true);
    const [respuesta, setRespuesta] = useState(true);
    const [simulacion, setSimulacion] = useState(true);

    const shipmentService = new APIShipment();

    let archivo_vuelos;
    let cantVuelos = 50;
    let steps = 100;
    let counter = 0;
    let day = 0;
    let vuelosDatos = [];
    let pointerId = 0;
    let cargando = true;
  
    let iniPage = 0;
    let finPage = 10;
    let items = [];
     let x;

    
    
    const addFlight = (vuelo, counterFlight, start, duracion) => { 

        // var vuelosPointer = vuelos.filter(function (el) { return el.id >= (pointerId) });
        

        // vuelos.forEach((vuelo) =>{
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
                            description: `FROM: <b>${vuelo.takeOffAirportD}</b> TO: <b>${vuelo.arrivalAirportD}</b> USED CAPACITY: <b>${vuelo.capacidadEmpleada}%</b>`
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

            //mapBox.current.on('load', function() {    
                mapBox.current.addSource("route"+counterFlight, {
                    type: "geojson",
                    data: route,
                });
        
                mapBox.current.addSource("point"+counterFlight  , {
                    type: "geojson",
                    data: point,
                });
        
                mapBox.current.addLayer({
                    id: "route"+counterFlight,
                    source: "route"+counterFlight,
                    type: "line",
                    paint: {
                        "line-width": 1.5,
                        "line-color": vuelo.capacidadEmpleada <= 20 ? "#008000" : vuelo.capacidadEmpleada <= 60 ? "#FFFF00" : "#B22222" ,
                    },
                });
            
                mapBox.current.addLayer({
                    id: "point"+counterFlight,
                    source: "point"+counterFlight,
                    type: "symbol",
                    layout: {
                        "icon-image": vuelo.capacidadEmpleada <= 20 ? "plane1" : vuelo.capacidadEmpleada <= 60 ? "plane2" : "plane3" ,
                        "icon-size": 1.5,
                        'icon-rotate': ['get', 'bearing'],
                        "icon-rotation-alignment": "map",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                    }
                });    
    
            //})   

            mapBox.current.on('mouseenter', 'point'+counterFlight, (e) => {      
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;
                popup.setLngLat(coordinates).setHTML(description).addTo(mapBox.current);
            });
          
            mapBox.current.on('mouseleave', 'point'+counterFlight, () => {
                popup.remove();
            });

            setTimeout(() => {                 
                animate(counterFlight, start, duracion);
            }, 100);

        // })
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
    
    const dispatchTable = async () => {
        const infoShipments = await shipmentService.listShipmentsAll();
        if (infoShipments["estado"].length < 3) {
            let pageItems = infoShipments["resultado"].slice(0, 10);
            setEnvios(infoShipments);
            setPaginas(Math.ceil(infoShipments["resultado"].length / 10));
            setPaginasItems(pageItems);
        }
    }

    const loadData = async () => {
        console.log("Hola desde loadData");
        if(semaforo){
            console.log("Entre a loadData");

            var new_date = moment(startDate, "DD-MM-YYYY").add(day, 'days');
    
            var new_date2 = JSON.stringify(new_date._d);

            console.log(new_date2);
            console.log(currentTime.getHours());
            
            const formData = new FormData();
            formData.append("file", zip);
            formData.append("date", new_date2);    
            
            console.log(new_date2);

            var requestOptions = {
                method: "POST",
                body: formData,
                redirect: "follow",
            };
            var requestOptions2 = {
                method: "GET",
                body: {"fecha": new_date2},
                redirect: "follow",
            };
    
            let uploadFile;
            console.log("procesando zip");
                
            const uploadFileAns = await fetch(
                "http://localhost:8090/dp1/api/dispatch/upload/zip",
                requestOptions
            );
    
            uploadFile = await uploadFileAns.json();
            
            if (uploadFile["estado"].length < 3) {
                console.log("entro");
                setRespuesta(true);
                
                const simulacion = await fetch(
                    "http://localhost:8090/dp1/api/airport/flight/plan/allDay?fecha=" + new_date2,
                  
                );
                    
                archivo_vuelos = await simulacion.json();
                
                console.log(archivo_vuelos);

                if (archivo_vuelos["resultado"].length > 0) {
                    
                    vuelosDatos = [];
                   
                    let takeOff,
                        arrival,
                        takeOff_hh,
                        takeOff_mi,
                        arrival_hh,
                        arrival_mi,
                        duracionH,
                        duracionM,
                        duracionT;
                    
                    let takeOff_hh_utc0,
                        arrival_hh_utc0,
                        utc0P,
                        utc0D,
                        caltakeOffTime,
                        capacidadUsada;
                    
                    archivo_vuelos = archivo_vuelos["resultado"];    
                    console.log(archivo_vuelos);
    
                    counter = 0;
                    archivo_vuelos.forEach((element) => {
                        takeOff = new Date();
                        [takeOff_hh, takeOff_mi] = element.flight.takeOffTime.split(/[/:\-T]/);
                        arrival = new Date();
                        [arrival_hh, arrival_mi] = element.flight.arrivalTime.split(/[/:\-T]/);
    
                        utc0P = element.flight.takeOffAirport.city.country.utc;
                        takeOff_hh_utc0 =
                            takeOff_hh - utc0P > 24
                                ? takeOff_hh - utc0P - 24
                                : takeOff_hh - utc0P > 0
                                ? takeOff_hh - utc0P
                                : 24 - takeOff_hh - utc0P;
                        utc0D = element.flight.arrivalAirport.city.country.utc;
                        arrival_hh_utc0 =
                            arrival_hh - utc0D > 24
                                ? arrival_hh - utc0D - 24
                                : arrival_hh - utc0D > 0
                                ? arrival_hh - utc0D
                                : 24 - arrival_hh - utc0D;
    
                        caltakeOffTime = parseInt(
                            takeOff_hh_utc0 * 100 + parseInt(takeOff_mi)
                        );
                        duracionH =
                            takeOff_hh > arrival_hh
                                ? (24 - takeOff_hh + arrival_hh) * 60
                                : (arrival_hh - takeOff_hh) * 60;

                        duracionM =
							parseInt(takeOff_mi) > parseInt(arrival_mi)
								? (60 - parseInt(takeOff_mi) + parseInt(arrival_mi))
								: (parseInt(arrival_mi) - parseInt(takeOff_mi));

                        duracionT = Math.round(((duracionH + duracionM) * 1.6) / 10);
    
                        capacidadUsada =
                            parseInt(parseFloat(element.occupiedCapacity / element.flight.capacity) * 100);
    
                        vuelosDatos.push({
                            takeOffAirportLo: element.flight.takeOffAirport.longitude,
                            takeOffAirportLa: element.flight.takeOffAirport.latitude,
                            takeOffAirportD: element.flight.takeOffAirport.description,
                            arrivalAirportLo: element.flight.arrivalAirport.longitude,
                            arrivalAirportLa: element.flight.arrivalAirport.latitude,
                            arrivalAirportD: element.flight.arrivalAirport.description,
                            fechaPartida: takeOff,
                            hP: takeOff_hh,
                            hP0: takeOff_hh_utc0,
                            mP: takeOff_mi,
                            fechaDestino: arrival,
                            hD: arrival_hh,
                            hD0: arrival_hh_utc0,
                            mD: arrival_mi,
                            capacidad: element.flight.capacity,
                            capacidadEmpleada: capacidadUsada,
                            id: counter,
                            duracion: duracionT,
                            takeOffTime: caltakeOffTime,
                            idReal: element.flight.idFlight,
                        });
    
                        counter = counter + 1;
                    });
    
                    orderFlights(vuelosDatos);
    
                    setVuelosD(vuelosDatos);
                }
    
            }else{
                if (uploadFile["estado"].length > 6){
                    console.log("COLAPSO LOGISTICO  :c");
                } 
            }

        }

    }

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


    const handlePrevPage = () => {
        var pageItems = envios.slice( iniPage - 10,  finPage - 10 );
        setPaginasItems(pageItems);
        setPagina(pagina-1);     
    }

    const handleNextPage = () => {        
        var pageItems = envios.slice( iniPage + 10, finPage + 10 );
        setPaginasItems(pageItems);
        setPagina(pagina+1);         
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

        mapBox.current.loadImage(PlaneImage1,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane1', image);        
          }
        );

        mapBox.current.loadImage(PlaneImage2,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane2', image);        
          }
        );

        mapBox.current.loadImage(PlaneImage3,
            (error, image) => {
            if (error) throw error;
              
            mapBox.current.addImage('plane3', image);        
          }
        );

        mapBox.current.setRenderWorldCopies(false);      

        if(dataVuelos.length > 0){
            setCounterFlight(counterFlight+1);
            dispatchTable();
        }

    },[]);

    

    useEffect(() =>{
        if(dataVuelos.length>0){
            // dataVuelos.splice(cantVuelos);
            setVuelos(dataVuelos);   
            console.log(vuelos);

        }  
    }, [dataVuelos])

    useEffect(() =>{        
        if(vuelos.length > 0){
            console.log(vuelos);
            dispatchTable();
        }
    }, [vuelos])

    useEffect(()=> {
        if(envios.length > 0){
            
            items = [];
            dispatchTable();
           
            if (pagina % 10 === 0) {
                x = Math.floor(pagina / 10) - 1;
            } else {
                x = Math.floor(pagina / 10);
            }

            let ini = 1 + x * 10;
            let y = 0;
            let fin = 1 + x * 10;

            if (paginas <= 10) {
                fin = paginas;
            } else {
                fin = 10 + x * 10;
            }
          
            for (let number = ini; number <= paginas; number++) {
                items.push(
                <PaginationItem
                    value={number}
                    className={pagina === number ? "active" : "disabled"}
                >
                    <PaginationLink>{number}</PaginationLink>
                </PaginationItem>
                );
            }
             
            
        }
        
    }, [envios])


    useEffect(() =>{
        if(currentTime.getDate() < endDate.getDate()+1){
            if(counterFlight >= 0 && vuelos.length > 0){
                let h, m;            

                h = currentTime.getHours();
                m = currentTime.getMinutes();


                if( (vuelos[counterFlight].hP0 === (h)) && (vuelos[counterFlight].mP<=(m) || vuelos[counterFlight].mP >= 50) ){   
                    console.log("Vuelo actual: " + counterFlight);
                    console.log("Vuelo antiguo: " + counterFlightA);
                    if (counterFlightA !== counterFlight){
                        addFlight(vuelos[counterFlight], counterFlight, 0, vuelos[counterFlight].duracion*8.9);
                        setCounterFlightA(counterFlightA+1);
                    }
                                        
    
                    // if (Math.random() > 0.01) {
                    //     incrementCounter();
                    // }
                    
                    setCounterFlight(counterFlight+1);

                    if(counterFlight === (vuelos.length-1)){
                        setVuelos(vuelosD);
                        setCounterFlight(0);
                        setCounterFlightA(-1);
                    }
                }

                if(semaforo){                    
                    setSemaforo(false);
                    if( (currentTime.getHours() === 2) ){             
                        day = day + 1;
                        loadData();                 
                    }
                }

                if(currentTime.getHours() !== 2){
                    setSemaforo(true);
                }

                if(currentTime.getHours() === 23 && vuelosD.length === 0){
                    setRespuesta(false);
                }
               
            }
            
            
            
        }else{
            setSimulacion(false);
        }

        


    },[counterFlight, currentTime])


   
    return(
        <div>

            {!simulacion ? <Alert style={{display: "flex", justifyContent: "center", fontSize:"20px"}}>Simulacion terminada correctamente</Alert> : ""}

           <ClockTime setCurrentTime={setCurrentTime} startDate={startDate} endDate={endDate} bandera={respuesta}/>

            <div ref={mapContainer} style={{ height: "650px", overflow: "hidden", marginBottom: "10px" }} />

            <Legend/>

            <Row style={{marginTop: "30px", marginBottom: "10px", font: "caption", display: "flex", justifyContent: "center"}}>
                <h3 style={{fontSize: "20px"}}>Resultado de la simulación</h3>
            </Row>

            <Row style={{marginBottom: "10px"}}>
                <h3>Seguimiento de los envíos</h3>
            </Row>

            <Card className="shadow">
                <Row>                    
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                            <tr>
                            <th scope="col">COD. RASTREO</th>
                            <th scope="col">ESTADO</th>
                            <th scope="col">PAÍS, CIUDAD ORIGEN</th>
                            <th scope="col">PAÍS, CIUDAD DESTINO</th>
                            <th scope="col">FECHA REGISTRO</th>
                            <th scope="col">ACCIONES</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginasItems.map((shipment) => {
                            return (
                                <tr key={shipment["id"]}>
                                <th>{shipment["trackingCode"]}</th>
                                <td>{shipment["status"]}</td>
                                <td>
                                    {
                                    shipment["originAirport"]["city"]["country"][
                                        "name"
                                    ]
                                    }
                                    , {shipment["originAirport"]["city"]["name"]}
                                </td>
                                <td>
                                    {
                                    shipment["destinationAirport"]["city"]["country"][
                                        "name"
                                    ]
                                    }
                                    , {shipment["destinationAirport"]["city"]["name"]}
                                </td>                        
                                <td>{shipment["registerDate"].substring(0, 10)}</td>
                                
                                </tr>
                            );
                            })}
                        </tbody>
                    </Table>


                </Row>
            </Card>

            <CardFooter className="py-4">
                <nav aria-label="...">
                <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                >
                    <PaginationItem
                        className={pagina - 1 === 0 ? "disabled" : ""}
                    >
                    <PaginationLink
                        onClick={() => handlePrevPage()}
                        tabIndex="-1"
                    >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                    </PaginationLink>
                    </PaginationItem>
                        {items}
                    <PaginationItem
                        className={pagina === paginas ? "disabled" : ""   }
                    >
                    <PaginationLink onClick={() => handleNextPage()}>
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                    </PaginationLink>
                    </PaginationItem>
                </Pagination>
                </nav>
            </CardFooter>

        </div>
    )
}



export default MapBox