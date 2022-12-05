/** @format */

import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)

// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { makeStyles } from "@material-ui/core/styles";
import ReactDatetime from "react-datetime";

import MapBox from "./Mapbox";
import MapBoxAirport from "./MapBoxAirport";
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
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Spinner
} from "reactstrap";
// core components

import {
	chartOptions,
	parseOptions,
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
const serviceCity = new APICity();
const serviceAirport = new APIAirport();




// Example 2 of Chart inside src/views/Index.js (Total orders - Card)

var archivo_vuelos;

const useStyles = makeStyles({
	root: {
		width: 300,
	},
});

function valuetext(value) {
	return `${value}°C`;
}

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
			archivoZip: new FormData(),
			simular: false,
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
		this.setState({ loading: true });
		const formData = new FormData();

		formData.append("date", startDateSimuVar);
		formData.append("horai", "00:00");
		formData.append("horaf", "06:00");

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

			console.log("procesando data");
			
			var startTime = performance.now()

			const uploadFileAns = await fetch(
				"http://localhost:8090/dp1/api/dispatch/upload/zip",
				requestOptions
			);

			var endTime = performance.now()

			var diferencia = parseFloat((endTime - startTime)/1000).toFixed(2);
			
			console.log(`UploadFileAns tomó ${diferencia} segundos`);

			uploadFile = await uploadFileAns.json();
			console.log(uploadFile["estado"]);

			var horai = "00:00";
			var horaf = "06:00";

			if (uploadFile["estado"].length < 3) {
				console.log("entro");
				const simulacion = await fetch(
                    `http://localhost:8090/dp1/api/airport/flight/plan/allDay?fecha=${startDateSimuVar}&horaI=${horai}&horaF=${horaf}`        
                );

				archivo_vuelos = await simulacion.json();

				console.log(archivo_vuelos["resultado"]);

				let counter = 0;

				if (archivo_vuelos["resultado"].length > 0) {
					console.log("entro2");
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
						[takeOff_hh, takeOff_mi] = element.flight.takeOffTime.split(/[/:\-T]/);
						arrival = new Date();
						[arrival_hh, arrival_mi] = element.flight.arrivalTime.split(/[/:\-T]/);						
						
						//utc0P = element.flight.takeOffAirport.city.country.utc;
						takeOff_hh_utc0 = parseInt(element.takeOffTimeUtc.split(/[/:\-T]/)[0]);
						arrival_hh_utc0 = parseInt(element.arrivalTimeUtc.split(/[/:\-T]/)[0]);

							// takeOff_hh - utc0P > 24
							// 	? takeOff_hh - utc0P - 24
							// 	: takeOff_hh - utc0P > 0
							// 	? takeOff_hh - utc0P
							// 	: 24 - takeOff_hh - utc0P;
						// utc0D = element.flight.arrivalAirport.city.country.utc;
						// arrival_hh_utc0 =
						// 	arrival_hh - utc0D > 24
						// 		? arrival_hh - utc0D - 24
						// 		: arrival_hh - utc0D > 0
						// 		? arrival_hh - utc0D
						// 		: 24 - arrival_hh - utc0D;

						caltakeOffTime = parseInt(
							takeOff_hh_utc0 * 100 + parseInt(takeOff_mi)
						);
						duracionH =
							takeOff_hh_utc0 > arrival_hh_utc0
								? (24 - takeOff_hh_utc0 + arrival_hh_utc0) * 60
								: (arrival_hh_utc0 - takeOff_hh_utc0) * 60;
						

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
							// id: counter,
							duracion: duracionT,
							takeOffTime: caltakeOffTime,
							idReal: element.flight.idFlight,
						});

						counter = counter + 1;
					});

					this.orderFlights(vuelosDatos);
				}else{
					this.setState({ archivoVuelos: [], archivoAeropuertos: [] })
				}

				this.setState({ simular: true })

				let alertMessage = (
					<Alert>La simulación inicio de manera correcta</Alert>
				);

				this.setState({
					messageConfirmation: alertMessage,
					loading: false,
					loaded: true
				});
			}
			else{
				if(uploadFile["estado"] === "COLAPSO"){
					let alertMessage = (
						<Alert style={{ backgroundColor: "#C41E3A", borderColor: "#C41E3A" }}>
							COLAPSO LOGÍSTICO
						</Alert>
					);

					this.setState({
						messageConfirmation: alertMessage,
						loading: false,
					});
				}
				else {
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

		const uploadFileAns = await fetch(
			"http://localhost:8090/dp1/api/airport/all",
			requestOptions
		);

		archivo_vuelos = await uploadFileAns.json();
		this.setState({ archivoAeropuertos: archivo_vuelos });

		console.log("HOLA");
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


	componentWillMount = async () => {
		this.cargarData();
	};
	queryTimelineMoment = async () => {

	};

	render() {

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
										{/* <Row>
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
										</Row> */}
										<Row style={{ marginLeft: "2px" }}>
											{this.state.messageConfirmation}
										</Row>

										<Row style={{ display: "flex", alignItems: "center" }}>
											<Col lg="4">
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
													<span className="btn-inner--text">Iniciar simulacion</span>
												</Button>												
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
												marginRight: "0px"
											}}>
											<div style={{ height: this.state.archivoVuelos.length ? "1650px" : "760px", width: "100%" }}>
												{this.state.archivoAeropuertos["resultado"] ? (
													<MapBoxAirport
														data={this.state.archivoAeropuertos["resultado"]}
													/>
												) : (
													<>
														{this.state.archivoVuelos.length > 0 ? (
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
