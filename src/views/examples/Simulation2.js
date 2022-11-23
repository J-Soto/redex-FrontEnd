/** @format */

import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)

// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Bar, Pie, HorizontalBar } from "react-chartjs-2";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactDatetime from "react-datetime";

import MapBox from "./Mapbox";
import MapBoxAirport from './MapBoxAirport';
import MapBoxVuelos from './MapBoxVuelos';


// reactstrap components
import {
	Alert,
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
	Modal,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Spinner,
	ListGroup,
	ListGroupItem,
	ListGroupItemHeading,
	Table,
} from "reactstrap";
// core components

import {
	chartOptions,
	parseOptions,
	chartExample1,
	chartExample3,
} from "variables/charts.js";
import Header from "components/Headers/Header.js";
import APISimulation from "./../../apis/APISimulation";
import APIIncident from "./../../apis/APIIncident.js";
import APIStorage from "./../../apis/APIStorage.js";
import APIAirport from "./../../apis/APIAirport.js";
import APICountry from "./../../apis/APICountry.js";
import APICity from "./../../apis/APICity.js";
var moment = require("moment");
require("moment/locale/es");

const serviceTimeline = new APISimulation();
const serviceIncident = new APIIncident();
const serviceStorage = new APIStorage();
const serviceCountry = new APICountry();
const serviceCity = new APICity();
const serviceAirport = new APIAirport();

const containerStyle = {
	width: '1000px',
	height: '650px'
};
  
const center = {
	lat: 0,
	lng: 0
};
  
const center1 = {
	lat: -12.016421992573788, 
	lng: -77.00842086314432
};


const locations = [
	{ lat: -31.56391, lng: 147.154312 },
	{ lat: -12.016421992573788, lng: -77.00842086314432 }
]

const options = {
	imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
}

function createKey(location) {
	return location.lat + location.lng
}


const options2 = {
	geodesic: true,
	strokeColor: '#FF0000',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#FF0000',
	fillOpacity: 0.35,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
	radius: 30000,
	paths: [
	  {lat: 37.772, lng: -122.214},
	  {lat: 21.291, lng: -157.821},
	  {lat: -18.142, lng: 178.431},
	  {lat: -27.467, lng: 153.027}
	],
	zIndex: 1
};




// Example 2 of Chart inside src/views/Index.js (Total orders - Card)
let chartExample2 = {
	options: {
		scales: {
			yAxes: [
				{
					ticks: {
						callback: function (value) {
							if (!(value % 10)) {
								//return '$' + value + 'k'
								return value;
							}
						},
					},
				},
			],
		},
		tooltips: {
			callbacks: {
				label: function (item, data) {
					var label = data.datasets[item.datasetIndex].label || "";
					var yLabel = item.yLabel;
					var content = "";
					if (data.datasets.length > 1) {
						content += label;
					}
					content += yLabel;
					return content;
				},
			},
		},
	},
};

var archivo_vuelos;

const useStyles = makeStyles({
	root: {
		width: 300,
	},
});

function valuetext(value) {
	return `${value}°C`;
}

let datos = [];

// let state = {
//     messageConfirmation: [],
//     fileSelection: [],
//     infoModal: [],
//     stateModal: false,
//     loading: false,
//     loaded: false,
//     queryDate: null,
//     labelsTimeLine: [],
//     legendTimeLine: [],
//     dataTimeLine: [],
//     maxTimeLine: [],
//     queryTimeline: false,
//     dataChart1: [],
//     labelsChart1: [],
//     legendChart1: [],
//     dataChart2: [],
//     labelsChart2: [],
//     legendChart2: [],
//     dataChart3: {},
//     dataChart4: [],
//     labelsChart4: [],
//     moreInfoWarehouses: false,
//     moreInfoFlights: false,
//     infoWarehouses: [],
//     infoFlights: [],
//     country: 0,
//     countries: [],
//     city: 0,
//     cities: [],
//     airportName: "Aeropuerto",
//     airportId: 0,
//     startDate: null,
//     endDate: null,
//     progress: [],
//     archivoAeropuertos: [],
//     archivoVuelos: []
// }

export default function Simulation2(){

    const [data, setData] = useState({
        messageConfirmation: [],
        fileSelection: [],
        infoModal: [],
        stateModal: false,
        loading: false,
        loaded: false,
        queryDate: null,
        labelsTimeLine: [],
        legendTimeLine: [],
        dataTimeLine: [],
        maxTimeLine: [],
        queryTimeline: false,
        dataChart1: [],
        labelsChart1: [],
        legendChart1: [],
        dataChart2: [],
        labelsChart2: [],
        legendChart2: [],
        dataChart3: {},
        dataChart4: [],
        labelsChart4: [],
        moreInfoWarehouses: false,
        moreInfoFlights: false,
        infoWarehouses: [],
        infoFlights: [],
        country: 0,
        countries: [],
        city: 0,
        cities: [],
        airportName: "Aeropuerto",
        airportId: 0,
        startDate: null,
        endDate: null,
        progress: [],
        archivoAeropuertos: [],
        archivoVuelos: []
    })

    // constructor(props),{
	// 	super(props);
		
	// 	//this.handleChange = this.handleChange.bind(this);
	// 	// this.handleChangeCountry = this.handleChangeCountry.bind(this);
	// 	// this.handleChangeCity = this.handleChangeCity.bind(this);
	// 	// this.submitFile = this.submitFile.bind(this);
	// 	// this.deleteData = this.deleteData.bind(this);
	// 	// this.moreInformationWarehouse = this.moreInformationWarehouse.bind(this);
	// 	// this.moreInformationFlights = this.moreInformationFlights.bind(this);
	// 	// //this.handleChangeSimulation = this.handleChangeSimulation.bind(this);
	// 	this.queryTimelineMoment = this.queryTimelineMoment.bind(this);
	// 	this.simulatebyAirport = this.simulatebyAirport.bind(this);
	// 	if (window.Chart) {
	// 		parseOptions(Chart, chartOptions());
	// 	}
	// }
    
    const handleChange = (event) => {
		setData({
            ...data,
			[event.target.name]: event.target.value,
			messageConfirmation: [],
		});
	};

    const transformDate = (dateToTransform) => {
		let year = dateToTransform.getFullYear();
		let month = dateToTransform.getMonth();
		if (month < 10) {
			month = "0" + (month + 1);
		}
		let date = dateToTransform.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		let dateSend = year.toString() + month.toString() + date.toString();
		return dateSend;
	};
    const simulatebyAirport = async () => {
		if (
			data.startDate != null &&
			data.endDate != null &&
			data.airportId != 0
		) {
			let startDate = new Date(data.startDate),
				endDate = new Date(data.endDate);
			let startDateT = transformDate(startDate);
			let endDateT = transformDate(endDate);
			const result = await serviceTimeline.getInformationAirport(
				data.airportId,
				startDateT,
				endDateT,
				true
			);
			if (result["estado"].length < 3) {
				let labelsChart4 = [],
					dataChart4 = [];
				result["resultado"].map((day) => {
					labelsChart4.push(day["date"]);
					dataChart4.push(day["count"]);
				});

				setData({
                    ...data,
					labelsChart4: labelsChart4,
					dataChart4: dataChart4,
				});
			}
		}
	};
    const handleChangeCity = async (event) => {
		let valueCity = event.target.value;
		if (event.target.value != 0) {
			const airportResponse = await serviceAirport.queryAirportByIdCity(
				event.target.value
			);
			let airport = airportResponse["resultado"];
			setData({
                ...data,
				city: valueCity,
				airportId: airport["id"],
				airportName: airport["description"],
			});
		} else {
			setData({
                ...data,
				city: 0,
				airportId: 0,
				airportName: "Aeropuerto",
			});
		}
	};

    const handleChangeCountry = async (event) => {
		let idCountry = event.target.value;
		if (idCountry != 0) {
			let idCity = sessionStorage.getItem("idCityAirport");
			const citiesA = await serviceCity.queryCitiesByIdCountry(
				idCountry,
				idCity
			);
			let cities = [];
			if (citiesA["estado"].length < 3) {
				cities.push(citiesA["resultado"]);
			}
			setData({
                ...data,
				country: idCountry,
				cities: cities,
			});
		} else {
			setData({
                ...data,
				city: 0,
				airportId: 0,
				airportName: "Aeropuerto",
				country: 0,
			});
		}
	};

    const moreInformationWarehouse = async () => {
		if (!data.moreInfoWarehouses) {
			const resultIncident = await serviceIncident.getDataAirports(true);
			if (resultIncident["estado"].length < 3) {
				setData({
                    ...data,
					infoWarehouses: resultIncident["resultado"],
					moreInfoWarehouses: true,
				});
			}
		} else {
			setData({
                ...data,
				moreInfoWarehouses: false,
			});
		}
	};
	const moreInformationFlights = async () => {
		if (!data.moreInfoFlights) {
			const resultIncident = await serviceIncident.getDataFlights(true);
			if (resultIncident["estado"].length < 3) {
				setData({
                    ...data,
					infoFlights: resultIncident["resultado"],
					moreInfoFlights: true,
				});
			}
		} else {
			setData({
                ...data,
				moreInfoFlights: false,
			});
		}
	};

	const deleteData = async () => {
		setData({ ...data, loading: true });
		const resultDelete = await serviceStorage.deleteSimulation();
		if (resultDelete["estado"].length < 3) {
			//se eliminó la data

			const resultIncident = await serviceIncident.getDashboards(true);
			let dataChart1 = [],
				labelsChart1 = [],
				legendChart1 = [],
				dataChart2 = [],
				labelsChart2 = [],
				legendChart2 = [];
			if (resultIncident["estado"].length < 3) {
				resultIncident["resultado"]["byairports"].map((airport) => {
					dataChart1.push(airport["count"]);
					labelsChart1.push(airport["code"]);
					legendChart1.push([
						airport["code"],
						airport["city"],
						airport["country"],
					]);
				});
				resultIncident["resultado"]["byflightplans"].map((flight) => {
					dataChart2.push(flight["count"]);
					labelsChart2.push(flight["idFlight"]);
					legendChart2.push([
						flight["idFlight"],
						flight["cityOrigin"],
						flight["countryOrigin"],
						flight["cityDestiny"],
						flight["countryDestiny"],
					]);
				});

				setData({
                    ...data,
					loading: false,
					loaded: true,
					dataChart1: dataChart1,
					labelsChart1: labelsChart1,
					legendChart1: legendChart1,
					dataChart2: dataChart2,
					labelsChart2: labelsChart2,
					legendChart2: legendChart2,
					dataChart3: resultIncident["resultado"]["summaryCase"],
					moreInfoWarehouses: false,
					moreInfoFlights: false,
				});
			} else {
				//si hay error porque no hay data
				setData({
                    ...data,
					loading: false,
					loaded: true,
					dataChart1: [0, 0, 0, 0, 0],
					labelsChart1: ["A1", "A2", "A3", "A4", "A5"],
					legendChart1: [
						["A1", "C1", "P1"],
						["A2", "C2", "P2"],
						["A3", "C3", "P3"],
						["A4", "C4", "P4"],
						["A5", "C5", "P5"],
					],
					dataChart2: [0, 0, 0, 0, 0],
					labelsChart2: ["V1", "V2", "V3", "V4", "V5"],
					legendChart2: [
						["V1", "OC1", "OP1", "DC1", "DP1"],
						["V2", "OC2", "OP2", "DC2", "DP2"],
						["V3", "OC3", "OP3", "DC3", "DP3"],
						["V4", "OC4", "OP4", "DC4", "DP4"],
						["V5", "OC5", "OP5", "DC5", "DP5"],
					],
					dataChart3: { ok: 0, fails: 0, late: 0 },
				});
			}
		}
	};
	const submitFile = async () => {
		//const fileInput = data.querySelector('#packs.generado.20220607') ;
		setData({...data, loading: true });
		const fileInput = document.querySelector("#input-fileSelectorPackages");
		const formData = new FormData();

		formData.append("file", fileInput.files[0]);

		//subir archivo

		var requestOptions = {
			method: "POST",
			body: formData,
			redirect: "follow",
		};

		var requestOptions2 = {
			method: "GET",
		};

		console.log("procesando zip");
		const uploadFileAns = await fetch(
			"http://localhost:8090/dp1/api/dispatch/upload/zip",
			requestOptions
		);

		const uploadFile = await uploadFileAns.json();
		console.log(uploadFile["resultado"]);
		

		if (uploadFile["estado"].length < 3) {

			console.log("entro");
			const simulacion = await fetch(
				"http://localhost:8090/dp1/api/airport/flight/all",
				requestOptions2
			);
			
			archivo_vuelos = await simulacion.json();
			setData({...data,archivoVuelos: archivo_vuelos, archivoAeropuertos: []});

			console.log(archivo_vuelos);	

			let alertMessage = <Alert>El archivo se subió de manera correcta</Alert>;

			const resultIncident = await serviceIncident.getDashboards(true);
			let dataChart1 = [],
				labelsChart1 = [],
				legendChart1 = [],
				dataChart2 = [],
				labelsChart2 = [],
				legendChart2 = [];
			if (resultIncident["estado"].length < 3) {
				resultIncident["resultado"]["byairports"].map((airport) => {
					dataChart1.push(airport["count"]);
					labelsChart1.push(airport["code"]);
					legendChart1.push([
						airport["code"],
						airport["city"],
						airport["country"],
					]);
				});

				resultIncident["resultado"]["byflightplans"].map((flight) => {
					dataChart2.push(flight["count"]);
					labelsChart2.push(flight["idFlight"]);
					legendChart2.push([
						flight["idFlight"],
						flight["cityOrigin"],
						flight["countryOrigin"],
						flight["cityDestiny"],
						flight["countryDestiny"],
					]);
				});

				setData({
                    ...data,
					messageConfirmation: alertMessage,
					loading: false,
					loaded: true,
					dataChart1: dataChart1,
					labelsChart1: labelsChart1,
					legendChart1: legendChart1,
					dataChart2: dataChart2,
					labelsChart2: labelsChart2,
					legendChart2: legendChart2,
					dataChart3: resultIncident["resultado"]["summaryCase"],
				});
			} else {
				//si hay error porque no hay data
				setData({
                    ...data,
					messageConfirmation: alertMessage,
					loading: false,
					loaded: true,
					dataChart1: [0, 0, 0, 0, 0],
					labelsChart1: ["A1", "A2", "A3", "A4", "A5"],
					legendChart1: [
						["A1", "C1", "P1"],
						["A2", "C2", "P2"],
						["A3", "C3", "P3"],
						["A4", "C4", "P4"],
						["A5", "C5", "P5"],
					],
					dataChart2: [0, 0, 0, 0, 0],
					labelsChart2: ["V1", "V2", "V3", "V4", "V5"],
					legendChart2: [
						["V1", "OC1", "OP1", "DC1", "DP1"],
						["V2", "OC2", "OP2", "DC2", "DP2"],
						["V3", "OC3", "OP3", "DC3", "DP3"],
						["V4", "OC4", "OP4", "DC4", "DP4"],
						["V5", "OC5", "OP5", "DC5", "DP5"],
					],
					dataChart3: { ok: 0, fails: 0, late: 0 },
				});
			}
		} else {
			let alertMessage = (
				<Alert color="primary">El archivo no se subió de manera correcta</Alert>
			);

			setData({
                ...data,
				messageConfirmation: alertMessage,
				loading: false,
			});
		}
	};
	const cargarData = async () => {

		var requestOptions = {
			method: "GET",
		};	

		const uploadFileAns = await fetch(
			"http://localhost:8090/dp1/api/airport/all",
			requestOptions
		);
	
		archivo_vuelos = await uploadFileAns.json();
		setData({...data,archivoAeropuertos: archivo_vuelos});

		console.log(data.archivoAeropuertos);

		if (archivo_vuelos["estado"].length < 3) {
	
			console.log("entro");
		
		} else {
			let alertMessage = (
				<Alert color="primary">No se cargó correctamente la data</Alert>
			);
	
			setData({
                ...data,
				messageConfirmation: alertMessage,
				loading: false,
			});
		}
	
	}

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    useEffect(() => {
        const fillCharts = async () => {
            const resultIncident = await serviceIncident.getDashboards(true);
            const resultCountries = await serviceCountry.queryAllCountries();
            if (resultCountries["estado"].length < 3) {
                setData({...data, countries: resultCountries["resultado"] });
            }
            let dataChart1 = [],
                labelsChart1 = [],
                legendChart1 = [],
                dataChart2 = [],
                labelsChart2 = [],
                legendChart2 = [];
            if (resultIncident["estado"].length < 3) {
                resultIncident["resultado"]["byairports"].map((airport) => {
                    dataChart1.push(airport["count"]);
                    labelsChart1.push(airport["code"]);
                    legendChart1.push([
                        airport["code"],
                        airport["city"],
                        airport["country"],
                    ]);
                });
                resultIncident["resultado"]["byflightplans"].map((flight) => {
                    dataChart2.push(flight["count"]);
                    labelsChart2.push(flight["idFlight"]);
                    legendChart2.push([
                        flight["idFlight"],
                        flight["cityOrigin"],
                        flight["countryOrigin"],
                        flight["cityDestiny"],
                        flight["countryDestiny"],
                    ]);
                });
                //console.log(dataChart1,labelsChart1,legendChart1);
                //console.log(dataChart2,labelsChart2,legendChart2);
                setData({
                    ...data,
                    dataChart1: dataChart1,
                    labelsChart1: labelsChart1,
                    legendChart1: legendChart1,
                    dataChart2: dataChart2,
                    labelsChart2: labelsChart2,
                    legendChart2: legendChart2,
                    dataChart3: resultIncident["resultado"]["summaryCase"],
                });
            } else {
                //si hay error porque no hay data
                setData({
                    ...data,
                    dataChart1: [0, 0, 0, 0, 0],
                    labelsChart1: ["A1", "A2", "A3", "A4", "A5"],
                    legendChart1: [
                        ["A1", "C1", "P1"],
                        ["A2", "C2", "P2"],
                        ["A3", "C3", "P3"],
                        ["A4", "C4", "P4"],
                        ["A5", "C5", "P5"],
                    ],
                    dataChart2: [0, 0, 0, 0, 0],
                    labelsChart2: ["V1", "V2", "V3", "V4", "V5"],
                    legendChart2: [
                        ["V1", "OC1", "OP1", "DC1", "DP1"],
                        ["V2", "OC2", "OP2", "DC2", "DP2"],
                        ["V3", "OC3", "OP3", "DC3", "DP3"],
                        ["V4", "OC4", "OP4", "DC4", "DP4"],
                        ["V5", "OC5", "OP5", "DC5", "DP5"],
                    ],
                    dataChart3: { ok: 0, fails: 0, late: 0 },
                });
            }
        }
        fillCharts()
	},[transformDate])
	const queryTimelineMoment = async () => {
		if (data.queryDate != null) {
			let year = data.queryDate.getFullYear();
			let month = data.queryDate.getMonth();
			if (month < 10) {
				month = "0" + (month + 1);
			}
			//console.log(month);

			console.log(data.queryDate.getDate());
			let date = data.queryDate.getDate();
			if (date < 10) {
				date = "0" + date;
			}

			//console.log(data.queryDate.getHours());
			let hours = data.queryDate.getHours();
			if (hours < 10) {
				hours = "0" + hours;
			}
			//console.log(hours);
			//console.log(data.queryDate.getMinutes());
			let min = data.queryDate.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			let dateSend = year.toString() + month.toString() + date.toString();
			let hourSend = hours.toString() + ":" + min.toString();
			//console.log(typeof dateSend);

			const resultTimeline = await serviceTimeline.getTimeline(
				dateSend,
				hourSend,
				true
			);
			//console.log(resultTimeline["resultado"]);
			let dataChart1 = [],
				labelsChart1 = [],
				legendChart1 = [];
			if (resultTimeline["estado"].length < 3) {
				resultTimeline["resultado"].map((airport) => {
					dataChart1.push(airport["percentage"]);
					labelsChart1.push(airport["code"]);
					legendChart1.push([
						airport["code"],
						airport["city"],
						airport["country"],
					]);
				});
				//console.log(dataChart1);
				//console.log(labelsChart1);
				setData({
                    ...data,
					dataTimeLine: dataChart1,
					labelsTimeLine: labelsChart1,
					legendTimeLine: legendChart1,
				});
			} else {
				setData({
                    ...data,
					dataTimeLine: [0, 0, 0, 0, 0],
					labelsChart1: ["A1", "A2", "A3", "A4", "A5"],
					legendTimeLine: [
						["A1", "C1", "P1"],
						["A2", "C2", "P2"],
						["A3", "C3", "P3"],
						["A4", "C4", "P4"],
						["A5", "C5", "P5"],
					],
				});
			}
			setData({...data, queryTimeline: true });
		}
	};




    for (let i = 0; i < data.dataTimeLine.length; i++) {
        data.maxTimeLine.push(100);
    }
    let mixedChart = {
        labels: data.labelsTimeLine,
        datasets: [
            {
                label: "% Ocupado: ",
                data: data.dataTimeLine,
            },
            {
                label: "% Máximo: ",
                data: data.maxTimeLine,
                type: "line",
            },
        ],
    };

    let data1 = {
        labels: data.labelsChart1,
        datasets: [
            {
                label: "# Incidencias",
                data: data.dataChart1,
                maxBarThickness: 10,
            },
        ],
    };
    let data2 = {
        labels: data.labelsChart2,
        datasets: [
            {
                label: "# Incidencias",
                data: data.dataChart2,
                maxBarThickness: 10,
            },
        ],
    };
    let data3 = {
        labels: ["# Éxitos", "# Tardanzas", "# Fallos"],
        datasets: [
            {
                label: "Procesamiento",
                backgroundColor: ["#87D7C0", "#5E72E4", "#f5365c"],
                data: [
                    data.dataChart3["ok"],
                    data.dataChart3["late"],
                    data.dataChart3["fails"],
                ],
                maxBarThickness: 10,
            },
        ],
    };
    let data4 = {
        labels: data.labelsChart4,
        datasets: [
            {
                label: "# Incidencias",
                data: data.dataChart4,
                maxBarThickness: 10,
            },
        ],
    };
    let countries = data.countries,
        optionItems = [],
        optionCities = [];
    if (countries.length > 0) {
        optionItems = countries.map((country) => (
            <option value={country["id"]}>{country["name"]}</option>
        ));
    }
    if (data.cities.length > 0) {
        optionCities = data.cities.map((city) => (
            <option value={city["id"]}>{city["name"]}</option>
        ));
    }
    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                {/* Form */}
                <Row>
                    <Card className="bg-secondary shadow" style={{ width: "80rem" }}>
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                                <Col xs="10" className="col-sm">
                                    <h3 className="mb-0">Simulación</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="pl-lg-4">
                                    <Row>
                                        <Col lg="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-fileSelectorPackages">
                                                    Registro de paquetes
                                                </label>
                                                <div>
                                                    <Input
                                                        type="file"
                                                        name="fileSelection"
                                                        placeholder="Seleccionar archivo"
                                                        id="input-fileSelectorPackages"
                                                        onChange={(ev) => handleChange(ev)}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="6"></Col>
                                    </Row>
                                    <Row>{data.messageConfirmation}</Row>

                                    <Row>

                                        

                                        <Col className="text-right">
                                            <Button
                                                className="btn-icon btn-3"
                                                color="primary"
                                                type="button"
                                                onClick={submitFile}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-file-upload" />
                                                </span>
                                                <span className="btn-inner--text">Subir</span>
                                            </Button>

                                            <Button
                                                className="btn-icon btn-3"
                                                color="#8395B2"
                                                type="button"
                                                onClick={cargarData}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-plane" />
                                                </span>
                                                <span className="btn-inner--text">Ver aeropuertos</span>
                                            </Button>
                                            
                                        </Col>
                                    </Row>

                                    
                                    <Row style={{display: "flex", justifyContent: "center", marginTop:"20px", marginBottom: "20px" }} >
                                        <div style={{ height: "700px", width: "100%" }}>
                                            
                                            {data.archivoAeropuertos["resultado"] ? 	

                                                <MapBoxAirport
                                                    data = {data.archivoAeropuertos["resultado"]}
                                                />

                                            :
                                                <>
                                                    {data.archivoVuelos["resultado"] ?
                                                        <MapBoxVuelos
                                                            data = {data.archivoVuelos["resultado"]}
                                                        />
                                                    :
                                                        <MapBox/>
                                                    }
                                                </>
                                                
                                            }

                                            

                                            {/* <LoadScript
                                                googleMapsApiKey="AIzaSyCCqt86Lysv0xy9Y3yni3TZkhCNYDVr0UI"
                                            >
                                                <GoogleMap
                                                    mapContainerStyle={containerStyle}
                                                    // center={center}
                                                    center={{lat: 18.559008, lng: -68.388881}}
                                                    zoom={16}
                                                >

                                                <Marker
                                                    icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
                                                    position={center1}
                                                />


                                                {data.progress && (
                                                    <>
                                                    
                                                        <Polyline
                                                            path={data.progress}
                                                            options={{ strokeColor: "#FF0000 " }}
                                                        />

                                                        <Marker
                                                            position={data.progress[data.progress.length - 1]}
                                                        />
                                                    
                                                    </>)
                                                }

                                                <Polyline	
                                                    path={locations}
                                                    options={options2}
                                                />
                                                

                                                <MarkerClusterer options={options}>
                                                    {(clusterer) =>
                                                        locations.map((location) => (
                                                        <Marker key={createKey(location)} position={location} clusterer={clusterer} />
                                                        ))
                                                    }
                                                </MarkerClusterer>
                                                
                                                </GoogleMap>
                                            </LoadScript> */}


                                        </div>
                                        
                                    </Row>




                                    <Row>
                                        {data.loading && <Spinner color="primary" />}
                                    </Row>
                                    <Row>
                                        <h3>Resultado de la simulación</h3>
                                    </Row>
                                    <br />
                                    <Row>
                                        <h3>TOP 5 Almacenes ocupados</h3>
                                    </Row>
                                    <Row>
                                        <Col lg="9">
                                            <div className="chart">
                                                <Bar data={data1} options={chartExample3.options} />
                                            </div>
                                        </Col>
                                        <Col lg="3">
                                            <ListGroup>
                                                <ListGroupItemHeading>
                                                    Aeropuertos
                                                </ListGroupItemHeading>
                                                {data.legendChart1.map((airport) => {
                                                    return (
                                                        <ListGroupItem>
                                                            {airport[0]}: {airport[1]}, {airport[2]}
                                                        </ListGroupItem>
                                                    );
                                                })}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col className="text-right">
                                            <Button
                                                className="btn-icon btn-3"
                                                color="primary"
                                                type="button"
                                                onClick={moreInformationWarehouse}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-eye"></i>
                                                </span>
                                                <span className="btn-inner--text">Ver más</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <br />

                                    


                                    {data.moreInfoWarehouses ? (
                                        <div>
                                            <Row>
                                                <Table
                                                    className="align-items-center table-flush"
                                                    responsive>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">Código Aeropuerto</th>
                                                            <th scope="col">Ciudad, País</th>
                                                            <th scope="col">Número Incidencias</th>
                                                            <th scope="col">Fecha Inicio</th>
                                                            <th scope="col">Fecha Fin</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.infoWarehouses.map((warehouse) => {
                                                            return (
                                                                <tr key={warehouse["code"]}>
                                                                    <th>{warehouse["code"]}</th>
                                                                    <td>
                                                                        {warehouse["city"]},{" "}
                                                                        {warehouse["country"]}
                                                                    </td>
                                                                    <td>{warehouse["count"]}</td>
                                                                    <td>{warehouse["ini"]}</td>
                                                                    <td>{warehouse["fin"]}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Row>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <br />
                                    <Row>
                                        <h3>Días de incidencias por aeropuerto</h3>
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-destinatioCountry">
                                                    País
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    type="select"
                                                    placeholder="País"
                                                    name="select"
                                                    id="input-destinationCountry"
                                                    value={data.country}
                                                    onChange={(ev) => {
                                                        handleChangeCountry(ev);
                                                    }}>
                                                    <option value={0}>Selecciona un país</option>
                                                    {optionItems}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-destinationCity">
                                                    Ciudad
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    type="select"
                                                    placeholder="Ciudad"
                                                    name="select"
                                                    id="input-destinationCity"
                                                    value={data.city}
                                                    onChange={(ev) => {
                                                        handleChangeCity(ev);
                                                    }}>
                                                    <option value={0}>Seleccionar ciudad</option>
                                                    {optionCities}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="input-destinationAirport">
                                                    Aeropuerto
                                                </label>
                                                <Input
                                                    disabled
                                                    className="form-control-alternative"
                                                    id="input-destinationAirport"
                                                    placeholder="Aeropuerto destino"
                                                    type="text"
                                                    value={data.airportName}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            {/*filtrar por fechas*/}
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    Fecha de inicio
                                                </label>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        inputProps={{
                                                            placeholder: "Seleccionar fecha",
                                                        }}
                                                        timeFormat={false}
                                                        renderDay={(props, currentDate, selectedDate) => {
                                                            let classes = props.className;
                                                            if (
                                                                data.startDate &&
                                                                data.endDate &&
                                                                data.startDate._d + "" ===
                                                                    currentDate._d + ""
                                                            ) {
                                                                classes += " start-date";
                                                            } else if (
                                                                data.startDate &&
                                                                data.endDate &&
                                                                new Date(data.startDate._d + "") <
                                                                    new Date(currentDate._d + "") &&
                                                                new Date(data.endDate._d + "") >
                                                                    new Date(currentDate._d + "")
                                                            ) {
                                                                classes += " middle-date";
                                                            } else if (
                                                                data.endDate &&
                                                                data.endDate._d + "" ===
                                                                    currentDate._d + ""
                                                            ) {
                                                                classes += " end-date";
                                                            }
                                                            return (
                                                                <td {...props} className={classes}>
                                                                    {currentDate.date()}
                                                                </td>
                                                            );
                                                        }}
                                                        onChange={(e) => setData({...data, startDate: e })}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    Fecha de fin
                                                </label>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        inputProps={{
                                                            placeholder: "Seleccionar fecha",
                                                        }}
                                                        timeFormat={false}
                                                        renderDay={(props, currentDate, selectedDate) => {
                                                            let classes = props.className;
                                                            if (
                                                                data.startDate &&
                                                                data.endDate &&
                                                                data.startDate._d + "" ===
                                                                    currentDate._d + ""
                                                            ) {
                                                                classes += " start-date";
                                                            } else if (
                                                                data.startDate &&
                                                                data.endDate &&
                                                                new Date(data.startDate._d + "") <
                                                                    new Date(currentDate._d + "") &&
                                                                new Date(data.endDate._d + "") >
                                                                    new Date(currentDate._d + "")
                                                            ) {
                                                                classes += " middle-date";
                                                            } else if (
                                                                data.endDate &&
                                                                data.endDate._d + "" ===
                                                                    currentDate._d + ""
                                                            ) {
                                                                classes += " end-date";
                                                            }
                                                            return (
                                                                <td {...props} className={classes}>
                                                                    {currentDate.date()}
                                                                </td>
                                                            );
                                                        }}
                                                        onChange={(e) => setData({...data, endDate: e })}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col className="text-right">
                                            <br />
                                            <Button
                                                className="btn-icon btn-3"
                                                color="primary"
                                                type="button"
                                                onClick={simulatebyAirport}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-play-circle"></i>
                                                </span>
                                                <span className="btn-inner--text">Simular</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="9">
                                            <div className="chart">
                                                <Bar data={data4} options={chartExample3.options} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <h3>Seguimiento de capacidades</h3>
                                    </Row>
                                    <Row>
                                        <FormGroup style={{ width: "30%" }}>
                                            <label className="form-control-label">Fecha</label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-calendar-grid-58" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <ReactDatetime
                                                    inputProps={{
                                                        placeholder: "Seleccionar fecha",
                                                    }}
                                                    timeFormat={true}
                                                    onChange={(e) => {
                                                        setData({...data, queryDate: new Date(e) });
                                                    }}
                                                />
                                                <InputGroupAddon addonType="prepend">
                                                    <Button
                                                        className="btn-icon btn-2"
                                                        color="primary"
                                                        outline
                                                        type="button"
                                                        onClick={queryTimelineMoment}>
                                                        <span className="btn-inner--icon">
                                                            <i className="ni ni-zoom-split-in" />
                                                        </span>
                                                    </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <Col lg="9">
                                            <div className="chart">
                                                <Bar
                                                    data={mixedChart}
                                                    options={chartExample2.options}
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="3">
                                            <ListGroup>
                                                <ListGroupItemHeading>
                                                    Aeropuertos
                                                </ListGroupItemHeading>
                                                {data.legendTimeLine.map((airport, index) => {
                                                    return (
                                                        <ListGroupItem key={index}>
                                                            {airport[0]}: {airport[1]}, {airport[2]}
                                                        </ListGroupItem>
                                                    );
                                                })}
                                            </ListGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <h3>TOP 5 Vuelos ocupados</h3>
                                    </Row>
                                    <Row>
                                        <Col lg="9">
                                            <div className="chart">
                                                <Bar data={data2} options={chartExample3.options} />
                                            </div>
                                        </Col>
                                        <Col lg="3">
                                            <ListGroup>
                                                <ListGroupItemHeading>Vuelos</ListGroupItemHeading>
                                                {data.legendChart2.map((flight) => {
                                                    return (
                                                        <ListGroupItem>
                                                            {flight[0]}: {flight[1]}, {flight[2]} -{" "}
                                                            {flight[3]}, {flight[4]}
                                                        </ListGroupItem>
                                                    );
                                                })}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col className="text-right">
                                            <Button
                                                className="btn-icon btn-3"
                                                color="primary"
                                                type="button"
                                                onClick={moreInformationFlights}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-eye"></i>
                                                </span>
                                                <span className="btn-inner--text">Ver más</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    {data.moreInfoFlights ? (
                                        <div>
                                            <Row>
                                                <Table
                                                    className="align-items-center table-flush"
                                                    responsive>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">Código Vuelo</th>
                                                            <th scope="col">Ciudad, País Origen</th>
                                                            <th scope="col">Ciudad, País Destino</th>
                                                            <th scope="col">Número incidencias</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.infoFlights.map((flight) => {
                                                            return (
                                                                <tr key={flight["idFlight"]}>
                                                                    <th>{flight["idFlight"]}</th>
                                                                    <td>
                                                                        {flight["cityOrigin"]},{" "}
                                                                        {flight["countryOrigin"]}
                                                                    </td>
                                                                    <td>
                                                                        {flight["cityDestiny"]},{" "}
                                                                        {flight["countryDestiny"]}
                                                                    </td>
                                                                    <td>{flight["count"]}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Row>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <Row>
                                        <h3>Resumen de la simulación</h3>
                                    </Row>
                                    <Row>
                                        <Col lg="9">
                                            <div className="chart">
                                                <Pie data={data3} />
                                            </div>
                                        </Col>
                                        <Col lg="3">
                                            <ListGroup>
                                                <ListGroupItemHeading>Resumen</ListGroupItemHeading>
                                                <ListGroupItem>Casos con éxito</ListGroupItem>
                                                <ListGroupItem>Casos con tardanza</ListGroupItem>
                                                <ListGroupItem>Casos con fallo</ListGroupItem>
                                            </ListGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className="text-right">
                                            <Button
                                                className="btn-icon btn-3"
                                                color="primary"
                                                type="button"
                                                onClick={deleteData}>
                                                <span className="btn-inner--icon">
                                                    <i className="fas fa-trash" />
                                                </span>
                                                <span className="btn-inner--text">Eliminar</span>
                                            </Button>
                                        </Col>
                                    </Row>

                                    {/*<Typography id="discrete-slider" gutterBottom>
                  Fecha
                </Typography>
                <Slider
                  style={{ width: 80 + "%" }}
                  defaultValue={0}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={50}
                  onChange={this.handleChangeSimulation}
                />
                <Typography id="discrete-slider" gutterBottom>
                  Hora
                </Typography>
                <Slider
                  style={{ width: 80 + "%" }}
                  defaultValue={0}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={50}
                  onChange={this.handleChangeSimulation}
                />*/}
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Row>
            </Container>
        </>
    );


}