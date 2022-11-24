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
import MapBoxAirport from "./MapBoxAirport";
import MapBoxVuelos from "./MapBoxVuelos";
import MapBoxVuelos2 from "./MapBoxVuelos2";

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
	width: "1000px",
	height: "650px",
};

const center = {
	lat: 0,
	lng: 0,
};

const center1 = {
	lat: -12.016421992573788,
	lng: -77.00842086314432,
};

const locations = [
	{ lat: -31.56391, lng: 147.154312 },
	{ lat: -12.016421992573788, lng: -77.00842086314432 },
];

const options = {
	imagePath:
		"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
};

function createKey(location) {
	return location.lat + location.lng;
}

const options2 = {
	geodesic: true,
	strokeColor: "#FF0000",
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: "#FF0000",
	fillOpacity: 0.35,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
	radius: 30000,
	paths: [
		{ lat: 37.772, lng: -122.214 },
		{ lat: 21.291, lng: -157.821 },
		{ lat: -18.142, lng: 178.431 },
		{ lat: -27.467, lng: 153.027 },
	],
	zIndex: 1,
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
let startDateSimuVar;

class Simulation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messageConfirmation: [],
			messageConfirmation1: [],
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
			startDateSimu: null,
			endDateSimu: null,
			progress: [],
			archivoAeropuertos: [],
			archivoVuelos: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeCountry = this.handleChangeCountry.bind(this);
		this.handleChangeCity = this.handleChangeCity.bind(this);
		this.submitFile = this.submitFile.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.moreInformationWarehouse = this.moreInformationWarehouse.bind(this);
		this.moreInformationFlights = this.moreInformationFlights.bind(this);
		//this.handleChangeSimulation = this.handleChangeSimulation.bind(this);
		this.queryTimelineMoment = this.queryTimelineMoment.bind(this);
		this.simulatebyAirport = this.simulatebyAirport.bind(this);
		this.orderFlights = this.orderFlights.bind(this);
		if (window.Chart) {
			parseOptions(Chart, chartOptions());
		}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
			messageConfirmation: [],
		});
	};
	//handleChangeSimulation = (event, value) => {};
	transformDate = (dateToTransform) => {
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
	simulatebyAirport = async () => {
		if (
			this.state.startDate != null &&
			this.state.endDate != null &&
			this.state.airportId != 0
		) {
			let startDate = new Date(this.state.startDate),
				endDate = new Date(this.state.endDate);
			let startDateT = this.transformDate(startDate);
			let endDateT = this.transformDate(endDate);
			const result = await serviceTimeline.getInformationAirport(
				this.state.airportId,
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

				this.setState({
					labelsChart4: labelsChart4,
					dataChart4: dataChart4,
				});
			}
		}
	};
	handleChangeCity = async (event) => {
		let valueCity = event.target.value;
		if (event.target.value != 0) {
			const airportResponse = await serviceAirport.queryAirportByIdCity(
				event.target.value
			);
			let airport = airportResponse["resultado"];
			this.setState({
				city: valueCity,
				airportId: airport["id"],
				airportName: airport["description"],
			});
		} else {
			this.setState({
				city: 0,
				airportId: 0,
				airportName: "Aeropuerto",
			});
		}
	};

	handleChangeCountry = async (event) => {
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
			this.setState({
				country: idCountry,
				cities: cities,
			});
		} else {
			this.setState({
				city: 0,
				airportId: 0,
				airportName: "Aeropuerto",
				country: 0,
			});
		}
	};

	moreInformationWarehouse = async () => {
		if (!this.state.moreInfoWarehouses) {
			const resultIncident = await serviceIncident.getDataAirports(true);
			if (resultIncident["estado"].length < 3) {
				this.setState({
					infoWarehouses: resultIncident["resultado"],
					moreInfoWarehouses: true,
				});
			}
		} else {
			this.setState({
				moreInfoWarehouses: false,
			});
		}
	};
	moreInformationFlights = async () => {
		if (!this.state.moreInfoFlights) {
			const resultIncident = await serviceIncident.getDataFlights(true);
			if (resultIncident["estado"].length < 3) {
				this.setState({
					infoFlights: resultIncident["resultado"],
					moreInfoFlights: true,
				});
			}
		} else {
			this.setState({
				moreInfoFlights: false,
			});
		}
	};

	deleteData = async () => {
		this.setState({ loading: true });
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

				this.setState({
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
				this.setState({
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

	orderFlights = (archivo_vuelos) => {
		var length = archivo_vuelos.length;
		var orderedFlights = archivo_vuelos;
		for (var i = 0; i < length; i++) {
			for (var j = 0; j < length - 1 - i; j++) {
				if (archivo_vuelos[j].takeOffTime > archivo_vuelos[j + 1].takeOffTime) {
					archivo_vuelos = this.exchangePos(archivo_vuelos, j);
				}
			}
		}

		let counter = 0;
		archivo_vuelos.forEach((element) => {
			element.id = counter;
			counter = counter + 1;
		});

		// console.log(archivo_vuelos);
		this.setState({ archivoVuelos: archivo_vuelos, archivoAeropuertos: [] });
		console.log(this.state.archivoVuelos);
		console.log(this.state.archivoVuelos.length);
	};

	exchangePos = (orderedFlights, j) => {
		var posJ = orderedFlights[j];
		orderedFlights[j] = orderedFlights[j + 1];
		orderedFlights[j + 1] = posJ;
		return orderedFlights;
	};

	submitFile = async () => {
		//const fileInput = data.querySelector('#packs.generado.20220607') ;
		this.setState({ loading: true });
		const fileInput = document.querySelector("#input-fileSelectorPackages");
		const formData = new FormData();

		formData.append("file", fileInput.files[0]);
		formData.append("date", startDateSimuVar);

		//subir archivo
		//var startDateSimuVar=this.state.startDateSimu._d;

		var requestOptions = {
			method: "POST",
			body: formData,
			redirect: "follow",
		};

		var requestOptions2 = {
			method: "GET",
		};

		let uploadFile;

		if (this.state.startDateSimu != null && this.state.endDateSimu != null) {
			this.setState({
				messageConfirmation1: [],
				loading: true,
			});

			console.log("procesando zip");
			
			const uploadFileAns = await fetch(
				"http://localhost:8090/dp1/api/dispatch/upload/zip",
				requestOptions
			);

			uploadFile = await uploadFileAns.json();
			console.log(uploadFile["resultado"]);

			if (uploadFile["estado"].length < 3) {
				console.log("entro");
				const simulacion = await fetch(
					"http://localhost:8090/dp1/api/airport/flight/all",
					requestOptions2
				);

				archivo_vuelos = await simulacion.json();

				let counter = 0;

				if (archivo_vuelos["resultado"].length > 0) {
					console.log("HOLA");

					let takeOff,
						arrival,
						takeOff_hh,
						takeOff_mi,
						arrival_hh,
						arrival_mi,
						duracionH,
						duracionM,
						duracionT;
					let vuelosDatos = [];
					let takeOff_hh_utc0,
						arrival_hh_utc0,
						utc0P,
						utc0D,
						caltakeOffTime,
						capacidadUsada;

					archivo_vuelos["resultado"].forEach((element) => {
						takeOff = new Date();
						[takeOff_hh, takeOff_mi] = element.takeOffTime.split(/[/:\-T]/);
						arrival = new Date();
						[arrival_hh, arrival_mi] = element.arrivalTime.split(/[/:\-T]/);

						utc0P = element.takeOffAirport.city.country.utc;
						takeOff_hh_utc0 =
							takeOff_hh - utc0P > 24
								? takeOff_hh - utc0P - 24
								: takeOff_hh - utc0P > 0
								? takeOff_hh - utc0P
								: 24 - takeOff_hh - utc0P;
						utc0D = element.arrivalAirport.city.country.utc;
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
							takeOff_mi > arrival_mi
								? 60 - takeOff_mi + arrival_mi
								: arrival_mi - takeOff_mi;
						duracionT = Math.round(((duracionH + duracionM) * 1.6) / 10);

						capacidadUsada =
							parseInt(parseFloat(element.occupiedCapacity / element.capacity) * 100);

						vuelosDatos.push({
							takeOffAirportLo: element.takeOffAirport.longitude,
							takeOffAirportLa: element.takeOffAirport.latitude,
							takeOffAirportD: element.takeOffAirport.description,
							arrivalAirportLo: element.arrivalAirport.longitude,
							arrivalAirportLa: element.arrivalAirport.latitude,
							arrivalAirportD: element.arrivalAirport.description,
							fechaPartida: takeOff,
							hP: takeOff_hh,
							hP0: takeOff_hh_utc0,
							mP: takeOff_mi,
							fechaDestino: arrival,
							hD: arrival_hh,
							hD0: arrival_hh_utc0,
							mD: arrival_mi,
							capacidad: element.capacity,
							capacidadEmpleada: capacidadUsada,
							// id: counter,
							duracion: duracionT,
							takeOffTime: caltakeOffTime,
							idReal: element.idFlight,
						});

						counter = counter + 1;
					});

					this.orderFlights(vuelosDatos);
				}

				let alertMessage = (
					<Alert>El archivo se subió de manera correcta</Alert>
				);

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

					this.setState({
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
					this.setState({
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
					<Alert style={{ backgroundColor: "#C41E3A", borderColor: "#C41E3A" }}>
						El archivo no se subió de manera correcta
					</Alert>
				);

				this.setState({
					messageConfirmation: alertMessage,
					loading: false,
				});
			}
		} else {
			let alertMessage = (
				<Alert style={{ backgroundColor: "#C41E3A", borderColor: "#C41E3A" }}>
					Falta seleccionar las fechas
				</Alert>
			);

			this.setState({
				messageConfirmation1: alertMessage,
				loading: false,
			});
		}
	};

	cargarData = async () => {
		var requestOptions = {
			method: "GET",
		};

		console.log("procesando zip");
		const uploadFileAns = await fetch(
			"http://localhost:8090/dp1/api/airport/all",
			requestOptions
		);

		archivo_vuelos = await uploadFileAns.json();
		this.setState({ archivoAeropuertos: archivo_vuelos });

		console.log(archivo_vuelos.resultado);

		if (archivo_vuelos["estado"].length < 3) {
			console.log("entro");
		} else {
			let alertMessage = (
				<Alert color="primary">No se cargó correctamente la data</Alert>
			);

			this.setState({
				messageConfirmation: alertMessage,
				loading: false,
			});
		}
	};

	limpiarData = async () => {
		if (this.state.archivoAeropuertos) {
			this.setState({ archivoAeropuertos: [] });
		}
	};

	/*componentWillMount = async () => {
    const resultTimeline = await serviceTimeline.getTimeline(
      "20220223",
      "15:27"
    );
    console.log(resultTimeline["resultado"]);
    let dataChart1 = [],
      labelsChart1 = [];
    if (resultTimeline["estado"].length < 3) {
      resultTimeline["resultado"].map((airport) => {
        dataChart1.push(airport["percentage"]);
        labelsChart1.push(airport["code"]);
      });
      console.log(dataChart1);
      console.log(labelsChart1);
      this.setState({ dataTimeLine: dataChart1, labelsTimeLine: labelsChart1 });
    } else {
      this.setState({
        dataTimeLine: [0, 0, 0, 0, 0],
        labelsChart1: ["A1", "A2", "A3", "A4", "A5"],
      });
    }
  };*/
	componentWillMount = async () => {
		const resultIncident = await serviceIncident.getDashboards(true);
		const resultCountries = await serviceCountry.queryAllCountries();
		if (resultCountries["estado"].length < 3) {
			this.setState({ countries: resultCountries["resultado"] });
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
			this.setState({
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
			this.setState({
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
	};
	queryTimelineMoment = async () => {
		if (this.state.queryDate != null) {
			let year = this.state.queryDate.getFullYear();
			let month = this.state.queryDate.getMonth();
			if (month < 10) {
				month = "0" + (month + 1);
			}
			//console.log(month);

			console.log(this.state.queryDate.getDate());
			let date = this.state.queryDate.getDate();
			if (date < 10) {
				date = "0" + date;
			}

			//console.log(this.state.queryDate.getHours());
			let hours = this.state.queryDate.getHours();
			if (hours < 10) {
				hours = "0" + hours;
			}
			//console.log(hours);
			//console.log(this.state.queryDate.getMinutes());
			let min = this.state.queryDate.getMinutes();
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
				this.setState({
					dataTimeLine: dataChart1,
					labelsTimeLine: labelsChart1,
					legendTimeLine: legendChart1,
				});
			} else {
				this.setState({
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
			this.setState({ queryTimeline: true });
		}
	};

	render() {
		for (let i = 0; i < this.state.dataTimeLine.length; i++) {
			this.state.maxTimeLine.push(100);
		}
		let mixedChart = {
			labels: this.state.labelsTimeLine,
			datasets: [
				{
					label: "% Ocupado: ",
					data: this.state.dataTimeLine,
				},
				{
					label: "% Máximo: ",
					data: this.state.maxTimeLine,
					type: "line",
				},
			],
		};

		let data1 = {
			labels: this.state.labelsChart1,
			datasets: [
				{
					label: "# Incidencias",
					data: this.state.dataChart1,
					maxBarThickness: 10,
				},
			],
		};
		let data2 = {
			labels: this.state.labelsChart2,
			datasets: [
				{
					label: "# Incidencias",
					data: this.state.dataChart2,
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
						this.state.dataChart3["ok"],
						this.state.dataChart3["late"],
						this.state.dataChart3["fails"],
					],
					maxBarThickness: 10,
				},
			],
		};
		let data4 = {
			labels: this.state.labelsChart4,
			datasets: [
				{
					label: "# Incidencias",
					data: this.state.dataChart4,
					maxBarThickness: 10,
				},
			],
		};
		let countries = this.state.countries,
			optionItems = [],
			optionCities = [];
		if (countries.length > 0) {
			optionItems = countries.map((country) => (
				<option key={country["id"]} value={country["id"]}>
					{country["name"]}
				</option>
			));
		}
		if (this.state.cities.length > 0) {
			optionCities = this.state.cities.map((city) => (
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
															onChange={(ev) => this.handleChange(ev)}
														/>
													</div>
												</FormGroup>
											</Col>
											<Col lg="6"></Col>
										</Row>
										<Row style={{ marginLeft: "2px" }}>
											{this.state.messageConfirmation}
										</Row>

										<Row style={{ display: "flex", alignItems: "center" }}>
											<Col lg="4">
												{/*incluir fechas de inicio y fin de simu*/}
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
																	this.state.startDateSimu &&
																	this.state.endDateSimu &&
																	this.state.startDateSimu._d + "" ===
																		currentDate._d + ""
																) {
																	classes += " start-date";
																} else if (
																	this.state.startDateSimu &&
																	this.state.endDateSimu &&
																	new Date(this.state.startDateSimu._d + "") <
																		new Date(currentDate._d + "") &&
																	new Date(this.state.endDateSimu._d + "") >
																		new Date(currentDate._d + "")
																) {
																	classes += " middle-date";
																} else if (
																	this.state.endDateSimu &&
																	this.state.endDateSimu._d + "" ===
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
															onChange={(e) => {
																console.log("date:");
																console.log(JSON.stringify(e._d));
																this.setState({ startDateSimu: e });
																startDateSimuVar = JSON.stringify(e._d);
															}}
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
																	this.state.Simu &&
																	this.state.endDateSimu &&
																	this.state.startDateSimu._d + "" ===
																		currentDate._d + ""
																) {
																	classes += " start-date";
																} else if (
																	this.state.startDateSimu &&
																	this.state.endDateSimu &&
																	new Date(this.state.startDateSimu._d + "") <
																		new Date(currentDate._d + "") &&
																	new Date(this.state.endDateSimu._d + "") >
																		new Date(currentDate._d + "")
																) {
																	classes += " middle-date";
																} else if (
																	this.state.endDateSimu &&
																	this.state.endDateSimu._d + "" ===
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
															onChange={(e) =>
																this.setState({ endDateSimu: e })
															}
														/>
													</InputGroup>
												</FormGroup>
											</Col>
											<Col className="text-right">
												<Button
													className="btn-icon btn-3"
													color="primary"
													type="button"
													onClick={this.submitFile}>
													<span className="btn-inner--icon">
														<i className="fas fa-file-upload" />
													</span>
													<span className="btn-inner--text">Subir</span>
												</Button>

												{this.state.archivoAeropuertos["resultado"] ? (
													<Button
														className="btn-icon btn-3"
														color="#8395B2"
														type="button"
														onClick={this.limpiarData}>
														<span className="btn-inner--icon">
															<i className="fas fa-backward"></i>
														</span>
														<span className="btn-inner--text">Volver</span>
													</Button>
												) : (
													<Button
														className="btn-icon btn-3"
														color="#8395B2"
														type="button"
														onClick={this.cargarData}>
														<span className="btn-inner--icon">
															<i className="fas fa-plane" />
														</span>
														<span className="btn-inner--text">
															Ver aeropuertos
														</span>
													</Button>
												)}
											</Col>
										</Row>
										<Row style={{ marginLeft: "2px" }}>
											{this.state.messageConfirmation1}
										</Row>

										<Row>
											{this.state.loading && <Spinner color="primary" />}
										</Row>

										<Row
											style={{
												display: "flex",
												justifyContent: "center",
												marginTop: "20px",
												marginBottom: "20px",
											}}>
											<div style={{ height: "850px", width: "100%" }}>
												{this.state.archivoAeropuertos["resultado"] ? (
													<MapBoxAirport
														data={this.state.archivoAeropuertos["resultado"]}
													/>
												) : (
													<>
														{this.state.archivoVuelos.length ? (
															<MapBoxVuelos2
																dataVuelos={this.state.archivoVuelos}
																startDate={this.state.startDateSimu._d}
																endDate={this.state.endDateSimu._d}
															/>
														) : (
															<MapBox />
														)}
													</>
												)}
											</div>
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
													{this.state.legendChart1.map((airport) => {
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
													onClick={this.moreInformationWarehouse}>
													<span className="btn-inner--icon">
														<i className="fas fa-eye"></i>
													</span>
													<span className="btn-inner--text">Ver más</span>
												</Button>
											</Col>
										</Row>
										<br />

										{this.state.moreInfoWarehouses ? (
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
															{this.state.infoWarehouses.map((warehouse) => {
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
														value={this.state.country}
														onChange={(ev) => {
															this.handleChangeCountry(ev);
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
														value={this.state.city}
														onChange={(ev) => {
															this.handleChangeCity(ev);
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
														value={this.state.airportName}
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
																	this.state.startDate &&
																	this.state.endDate &&
																	this.state.startDate._d + "" ===
																		currentDate._d + ""
																) {
																	classes += " start-date";
																} else if (
																	this.state.startDate &&
																	this.state.endDate &&
																	new Date(this.state.startDate._d + "") <
																		new Date(currentDate._d + "") &&
																	new Date(this.state.endDate._d + "") >
																		new Date(currentDate._d + "")
																) {
																	classes += " middle-date";
																} else if (
																	this.state.endDate &&
																	this.state.endDate._d + "" ===
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
															onChange={(e) => this.setState({ startDate: e })}
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
																	this.state.startDate &&
																	this.state.endDate &&
																	this.state.startDate._d + "" ===
																		currentDate._d + ""
																) {
																	classes += " start-date";
																} else if (
																	this.state.startDate &&
																	this.state.endDate &&
																	new Date(this.state.startDate._d + "") <
																		new Date(currentDate._d + "") &&
																	new Date(this.state.endDate._d + "") >
																		new Date(currentDate._d + "")
																) {
																	classes += " middle-date";
																} else if (
																	this.state.endDate &&
																	this.state.endDate._d + "" ===
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
															onChange={(e) => this.setState({ endDate: e })}
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
													onClick={this.simulatebyAirport}>
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
															this.setState({ queryDate: new Date(e) });
														}}
													/>
													<InputGroupAddon addonType="prepend">
														<Button
															className="btn-icon btn-2"
															color="primary"
															outline
															type="button"
															onClick={this.queryTimelineMoment}>
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
													{this.state.legendTimeLine.map((airport) => {
														return (
															<ListGroupItem>
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
													{this.state.legendChart2.map((flight) => {
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
													onClick={this.moreInformationFlights}>
													<span className="btn-inner--icon">
														<i className="fas fa-eye"></i>
													</span>
													<span className="btn-inner--text">Ver más</span>
												</Button>
											</Col>
										</Row>
										<br />
										{this.state.moreInfoFlights ? (
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
															{this.state.infoFlights.map((flight) => {
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
													onClick={this.deleteData}>
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
}
export default Simulation;
