import React from "react";
// reactstrap components
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Modal,
  Table,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import ReactDatetime from "react-datetime";
// core components
import Header from "components/Headers/Header.js";
//apis
import APIShipment from "./../../../apis/APIShipment.js";
import APICountry from "apis/APICountry.js";
import APICity from "apis/APICity.js";
import { textSpanIntersectsWithPosition, isThisTypeNode } from "typescript";
var moment = require('moment');
require('moment/locale/es');


class ShipmentIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateModal: false,
      infoModal: [],
      moreInfoModal: [],
      infoShipments: [],
      trackingCode: 0,
      foundShipment: false,
      infoShipment: [],
      idCityFilter: 0,
      idCountryFilter: 0,
      countries: [],
      cities: [],
      startDate: null,
      endDate: null,
      listPages: [],
      page: 1,
      pages: 0,
      iniPage: 0,
      finPage: 10,
      pageItems: [],
      statusFilter: "SIN_SELECCION",
      isFiltered: false,
    };

    this.showRoutes = this.showRoutes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.findShipmentByTrackingCode = this.findShipmentByTrackingCode.bind(
      this
    );
    this.finishShipment = this.finishShipment.bind(this);
    this.filterData = this.filterData.bind(this);
    this.convertDate = this.convertDate.bind(this);
  }

  showRoutes = (infoModal) => {
    this.setState({
      stateModal: !this.state.stateModal,
      infoModal: infoModal,
    });
  };
  handleChange = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,      
    });
    //si el cambio es del país se obtienen ciudades
    let nameState = event.target.name;
    let idCountry = event.target.value;
    if (nameState.localeCompare("idCountryFilter") == 0) {
      const cityService = new APICity();
      let idCity = sessionStorage.getItem("idCityAirport");
      const citiesA = await cityService.queryCitiesByIdCountry(
        idCountry,
        idCity
      );
      let cities = [];
      if (citiesA["estado"].length < 3) {
        //si hay ciudades
        cities.push(citiesA["resultado"]);
      }
      this.setState({ cities: cities });
    }
  };

  findShipmentByTrackingCode = async () => {
    const shipmentService = new APIShipment();
    const infoShipment = await shipmentService.findShipmentByTrackingCode(
      this.state.trackingCode
    );
    const message = infoShipment["estado"];
    if (message.length < 3) {
      //Ok
      this.setState({
        infoShipment: infoShipment["resultado"],
        foundShipment: true,
      });
    } else {
      this.setState({
        foundShipment: false,
      });
    }
  };
  finishShipment = async (trackingCode) => {
    const shipmentService = new APIShipment();
    const infoShipments = await shipmentService.finishShipmentNow(
      "FINALIZADO",
      trackingCode
    );
    if (this.state.foundShipment && infoShipments["estado"].length < 3) {
      this.setState({ infoShipment: infoShipments["resultado"] });
    } else if (infoShipments["estado"].length < 3) {
      let idAirport = sessionStorage.getItem("idAirport");
      let infoShipments = await shipmentService.listShipmentsIn(idAirport);
      let pageItems = infoShipments["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoShipments: infoShipments["resultado"],
        pageItems: pageItems,
      });
    }
  };

  convertDate =(date) =>{
    //dd/mm/aaaa
    //0123456789
    let day, month, year;
    day = date.substring(0,2);
    month = date.substring(3,5);
    year = date.substring(6,10);    
    return (year+"-"+month+"-"+day+" 00:00:00");
  }

  filterData = async () => {
    //País, ciudad, fechas
    let shipmentsFilter = [];
    let filterCountry = false;
    let filterDate = false;

    //volver a llamar a todos los envíos
    let shipmentsForFilter = this.state.infoShipments;
    let selectionStatus =
      this.state.statusFilter.localeCompare("SIN_SELECCION") == 0 ? 0 : 1;
    if (
      this.state.idCountryFilter > 0 &&
      this.state.idCityFilter > 0 &&
      selectionStatus == 1
    ) {
      //escogio país, ciudad y estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryFilter &&
          shipment["originAirport"]["city"]["id"] == this.state.idCityFilter &&
          shipment["status"].localeCompare(this.state.statusFilter) == 0
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryFilter > 0 && this.state.idCityFilter > 0) {
      //solo selecciono país y ciudad
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryFilter &&
          shipment["originAirport"]["city"]["id"] == this.state.idCityFilter
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryFilter > 0 && selectionStatus == 1) {
      //solo selecciono país y estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryFilter &&
          shipment["status"].localeCompare(this.state.statusFilter) == 0
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryFilter > 0) {
      //solo selecciono país
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
          this.state.idCountryFilter
        )
          shipmentsFilter.push(shipment);
      });
    } else if (selectionStatus == 1) {
      //solo selecciono estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (shipment["status"].localeCompare(this.state.statusFilter) == 0)
          shipmentsFilter.push(shipment);
      });
    }

    /*evaluando los fitros de fechas si shipmentsFilter tiene datos luego de ser filtrado según país o ciudad
     si shipmentsFilter esta vacío porque no hya opciones para eso países o ciudades ya no se filtra por fechas
     si está vacío porque no se escogieron los filtros entonces solo se filtra por fechas*/

    let shipmentsFilterDate = [];
    let registerDate,  newDate;
    if (filterCountry == true && shipmentsFilter.length > 0) {
      //Sí hay información para filtrar después de filtrar por país

      if (this.state.startDate != null && this.state.endDate != null) {
        //seleccionan las dos fechas
        filterDate = true;
        shipmentsFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   
          if (
            registerDate >= this.state.startDate._d &&
            registerDate <= this.state.endDate
          )
            shipmentsFilterDate.push(shipmentFilter);
        });
      } else if (this.state.startDate != null) {
        //selecciona solo fecha de inicio
        filterDate = true;
        shipmentsFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   

          if (registerDate >= this.state.startDate._d)
            shipmentsFilterDate.push(shipmentFilter);
        });
      } else if (this.state.endDate != null) {
        //selecciona solo fecha de fin
        filterDate = true;
        shipmentsFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   

          if (registerDate <= this.state.endDate)
            shipmentsFilterDate.push(shipmentFilter);
        });
      }
    } else if (filterCountry == false) {
      //No se filtro por país
      if (this.state.startDate != null && this.state.endDate != null) {
        //seleccionan las dos fechas
        filterDate = true;
        shipmentsForFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   

          if (
            registerDate >= this.state.startDate._d &&
            registerDate <= this.state.endDate
          )
            shipmentsFilterDate.push(shipmentFilter);
        });
      } else if (this.state.startDate != null) {
        //selecciona solo fecha de inicio
        filterDate = true;
        shipmentsForFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   
          if (registerDate >= this.state.startDate._d)
            shipmentsFilterDate.push(shipmentFilter);
        });
      } else if (this.state.endDate != null) {
        //selecciona solo fecha de fin
        
        shipmentsForFilter.map((shipmentFilter) => {
                 
          newDate = this.convertDate(shipmentFilter["registerDate"]); 
          registerDate = new Date(Date.parse(newDate));   

          if (registerDate <= this.state.endDate)
            shipmentsFilterDate.push(shipmentFilter);
        });
      }
    }
    if (!filterCountry && !filterDate) {
      //si no hubo ninguno de los dos filtros
      shipmentsFilter = shipmentsForFilter;
    }

    //se asignan a los envíos el filtrado después de fechas si hubo y sino hubo se asigna el filtrado solo por países

    !filterDate
      ? this.setState({ pageItems: shipmentsFilter, foundShipment: false, })
      : this.setState({ pageItems: shipmentsFilterDate, foundShipment: false, });

    if (
      this.state.statusFilter.localeCompare("SIN_SELECCION") == 0 &&
      this.state.idCityFilter == 0 &&
      this.state.idCountryFilter == 0 &&
      this.state.startDate == null &&
      this.endDate == null
    ) {
      this.setState({ isFiltered: false });
    } else {
      this.setState({ isFiltered: true });
    }
  };
  componentWillMount = async () => {
    const shipmentService = new APIShipment();
    const countryService = new APICountry();
    const idAirport = sessionStorage.getItem("idAirport");
    const infoShipments = await shipmentService.listShipmentsIn(idAirport);
    const countries = await countryService.queryAllCountries();

    
    
    if (infoShipments["estado"].length < 3) {
      //se tienen los pedidos
      let pageItems = infoShipments["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoShipments: infoShipments["resultado"],
        pages: Math.ceil(infoShipments["resultado"].length / 10),
        pageItems: pageItems,
      });
    }
    if (countries["estado"].length < 3) {
      this.setState({
        countries: countries["resultado"],
      });
    }
    //console.log("LAS PÁGINAS SON" + this.state.pages);
    let listPages = [];
    for (let i = 0; i < this.state.pages; i++) {
      this.state.listPages.push(i + 1);
    }
    //console.log(this.state.pageItems);
  };
  handlePrevPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoShipments.slice(
      this.state.iniPage - 10,
      this.state.finPage - 10
    );
    this.setState({
      page: this.state.page - 1,
      iniPage: this.state.iniPage - 10,
      finPage: this.state.finPage - 10,
      pageItems: pageItems,
    });
    console.log(this.state.pageItems);
  };
  handleNextPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoShipments.slice(
      this.state.iniPage + 10,
      this.state.finPage + 10
    );
    this.setState({
      page: this.state.page + 1,
      iniPage: this.state.iniPage + 10,
      finPage: this.state.finPage + 10,
      pageItems: pageItems,
    });
    //console.log(this.state.pageItems);
  };
  handleCurrentPage = (event) => {
    let inicio = 0;
    let fin = 9;
    while (!(inicio <= event.target.value) && !(fin >= event.target.value)) {
      inicio = inicio + 10;
      fin = fin + 10;
    }
    let pageItems = this.state.infoShipments.slice(inicio, fin);
    this.setState({
      page: event.target.value,
      iniPage: inicio,
      finPage: fin,
      pageItems: pageItems,
    });
  };

  render() {
    let optionCountries;
    let optionCities;
    if (this.state.countries.length > 0) {
      optionCountries = this.state.countries.map((country) => (
        <option value={country["id"]}>{country["name"]}</option>
      ));
    }
    if (this.state.cities.length > 0) {
      optionCities = this.state.cities.map((city) => (
        <option value={city["id"]}>{city["name"]}</option>
      ));
    }

    let items = [];
    let x;
    if (this.state.page % 10 == 0) {
      x = Math.floor(this.state.page / 10) - 1;
    } else {
      x = Math.floor(this.state.page / 10);
    }
    let ini = 1 + x * 10;
    let y = 0;
    let fin = 1 + x * 10;
    if (this.state.pages <= 10) {
      fin = this.state.pages;
    } else {
      fin = 10 + x * 10;
      console.log(fin);
    }

    if (this.state.foundShipment) {
      for (let number = 1; number <= 1; number++) {
        items.push(
          <PaginationItem
            value={number}
            className={this.state.page === number ? "active" : "disabled"}
          >
            <PaginationLink>{number}</PaginationLink>
          </PaginationItem>
        );
      }
    } else if (this.state.isFiltered) {
      let pagesFiltered = Math.ceil(this.state.pageItems.length / 10);
      console.log(pagesFiltered);
      for (let number = ini; number <= pagesFiltered; number++) {
        items.push(
          <PaginationItem
            value={number}
            className={this.state.page === number ? "active" : "disabled"}
          >
            <PaginationLink>{number}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let number = ini; number <= fin; number++) {
        if (this.state.pages >= number) {
          items.push(
            <PaginationItem
              value={number}
              className={this.state.page === number ? "active" : "disabled"}
            >
              <PaginationLink>{number}</PaginationLink>
            </PaginationItem>
          );
        }
      }
    }

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {/* Tabla */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Envíos</h3>
                    </Col>
                    <Col>
                      <Form>
                        <FormGroup>
                          <InputGroup className="mb-4 justify-content-center">
                            <Input
                              placeholder="Buscar por código de rastreo"
                              type="text"
                              name="trackingCode"
                              //value={this.state.trackingCode}
                              onChange={(ev) => {
                                this.handleChange(ev);
                              }}
                            />
                            <InputGroupAddon addonType="prepend">
                              <Button
                                className="btn-icon btn-2"
                                color="primary"
                                outline
                                type="button"
                                onClick={this.findShipmentByTrackingCode}
                              >
                                <span className="btn-inner--icon">
                                  <i className="ni ni-zoom-split-in" />
                                </span>
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </Col>
                    <Col className="text-right" xs="4"></Col>
                  </Row>
                  <Form>
                    <Row>
                      {/*Filtros*/}
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterStatus"
                          >
                            Estado
                          </label>
                          <Input
                            placeholder="Estado"
                            type="select"
                            name="statusFilter"
                            id="input-filterStatus"
                            value={this.state.statusFilter}
                            onChange={(ev) => {
                              this.handleChange(ev);
                            }}
                          >
                            <option value={"SIN_SELECCION"}>
                              Seleccionar estado
                            </option>
                            <option value={"RECIBIDO"}>RECIBIDO</option>
                            <option value={"EN_PROCESO"}>EN_PROCESO</option>
                            <option value={"ATRASADO"}>ATRASADO</option>
                            <option value={"EN_DESTINO"}>EN_DESTINO</option>
                            <option value={"FINALIZADO"}>FINALIZADO</option>
                            <option value={"CANCELADO"}>CANCELADO</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterCountry"
                          >
                            País destino
                          </label>
                          <Input
                            placeholder="País destino"
                            type="select"
                            name="idCountryFilter"
                            id="input-filterCountry"
                            value={this.state.idCountryFilter}
                            onChange={(ev) => {
                              this.handleChange(ev);
                            }}
                          >
                            <option value={0}>Seleccionar país</option>
                            {optionCountries}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterCity"
                          >
                            Ciudad destino
                          </label>
                          <Input
                            placeholder="Ciudad destino"
                            type="select"
                            name="idCityFilter"
                            id="input-filterCity"
                            value={this.state.idCityFilter}
                            onChange={(ev) => {
                              this.handleChange(ev);
                            }}
                          >
                            <option value={0}>Seleccionar ciudad</option>
                            {optionCities}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col>
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
                      <Col>
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
                      <Col className="col-sm text-right" lg="2">
                        <br />
                        <Button
                          className="btn-icon btn-3"
                          color="primary"
                          type="button"
                          onClick={this.filterData}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-filter" />
                          </span>
                          <span className="btn-inner--text">Filtrar</span>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">COD. RASTREO</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">PAÍS ORIGEN</th>
                      <th scope="col">CIUDAD ORIGEN</th>
                      <th scope="col">CLIENTE EMISOR</th>
                      <th scope="col">FECHA REGISTRO</th>
                      <th scope="col">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!this.state.foundShipment ? (
                      this.state.pageItems.map((shipment) => {
                        //pageItems en vez de infoShipments
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
                            </td>
                            <td>{shipment["originAirport"]["city"]["name"]}</td>
                            <td>
                              {shipment["send_client"]["name"]}{" "}
                              {shipment["send_client"]["lastname"]}
                            </td>
                            <td>{shipment["registerDate"].substring(0, 10)}</td>
                            {/*<td>
                              {shipment["registerDate"].substring(11, 16)}
                            </td>*/}

                            <td>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-arrow"
                                  right
                                >
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={() => this.showRoutes(shipment)}
                                  >
                                    Ver más
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={() =>
                                      this.finishShipment(
                                        shipment["trackingCode"]
                                      )
                                    }
                                  >
                                    Finalizar
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      //información de un solo envío para la búsqueda
                      <tr>
                        <th>{this.state.infoShipment["trackingCode"]}</th>
                        <td>{this.state.infoShipment["status"]}</td>
                        <td>
                          {
                            this.state.infoShipment["originAirport"]["city"][
                              "country"
                            ]["name"]
                          }
                        </td>
                        <td>
                          {
                            this.state.infoShipment["originAirport"]["city"][
                              "name"
                            ]
                          }
                        </td>

                        <td>
                          {this.state.infoShipment["send_client"]["name"]}{" "}
                          {this.state.infoShipment["send_client"]["lastname"]}
                        </td>

                        <td>
                          {this.state.infoShipment["registerDate"].substring(
                            0,
                            10
                          )}
                        </td>

                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={() =>
                                  this.showRoutes(this.state.infoShipment)
                                }
                              >
                                Ver más
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={() =>
                                  this.finishShipment(
                                    this.state.infoShipment["trackingCode"]
                                  )
                                }
                              >
                                Finalizar
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Modal
                  size="lg"
                  className="modal-dialog-centered"
                  isOpen={this.state.stateModal}
                  toggle={() => this.showRoutes([])}
                >
                  <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                      Información del envío
                    </h3>
                    <button
                      aria-label="Close"
                      className="close"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.showRoutes([])}
                    >
                      <span aria-hidden={true}>×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <Form>
                      <div className="pl-lg-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-nameClientReceiver"
                              >
                                Cliente receptor
                              </label>
                              <Input
                                disabled
                                className="form-control-alternative"
                                id="input-nameClientReceiver"
                                type="text"
                                value={
                                  this.state.infoModal["receiveClientName"] +
                                  " " +
                                  this.state.infoModal["receiveClientLastname"]
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-documentClientReceiver"
                              >
                                Número de documento
                              </label>
                              <Input
                                disabled
                                className="form-control-alternative"
                                id="input-documentClientReceiver"
                                type="text"
                                value={
                                  this.state.infoModal["receiveClientDocument"]
                                }
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                    <Row>
                      <div className="modal-header">
                        <h3 className="modal-title" id="modal-title-default">
                          Ruta del envío
                        </h3>
                      </div>
                    </Row>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">CIUDA/PAÍS ORIGEN</th>
                          <th scope="col">FECHA Y HORA DE DESPEGUE</th>
                          <th scope="col">CIUDA/PAÍS DESTINO</th>
                          <th scope="col">FECHA Y HORA DE ATERRIZAJE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.stateModal
                          ? this.state.infoModal["pack"]["routePlan"][
                              "flightPlans"
                            ].map((flightPlan) => (
                              <tr key={flightPlan["id"]}>
                                <td scope="col">
                                  {
                                    flightPlan["flight"]["takeOffAirport"][
                                      "city"
                                    ]["name"]
                                  }
                                  ,{" "}
                                  {
                                    flightPlan["flight"]["takeOffAirport"][
                                      "city"
                                    ]["country"]["name"]
                                  }
                                </td>
                                <td scope="col">
                                  {flightPlan["takeOffDate"]}{" "}
                                  {flightPlan["flight"]["takeOffTime"]}
                                </td>
                                <td scope="col">
                                  {
                                    flightPlan["flight"]["arrivalAirport"][
                                      "city"
                                    ]["name"]
                                  }
                                  ,{" "}
                                  {
                                    flightPlan["flight"]["arrivalAirport"][
                                      "city"
                                    ]["country"]["name"]
                                  }
                                </td>
                                <td scope="col">
                                  {flightPlan["arrivalDate"]}{" "}
                                  {flightPlan["flight"]["arrivalTime"]}
                                </td>
                              </tr>
                            ))
                          : ""}
                      </tbody>
                    </Table>
                  </div>
                  <div className="modal-footer">
                    <Button
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.showRoutes([])}
                    >
                      Cerrar
                    </Button>
                  </div>
                </Modal>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem
                        className={this.state.page - 1 == 0 ? "disabled" : ""}
                      >
                        <PaginationLink
                          onClick={this.handlePrevPage}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      {items}
                      <PaginationItem
                        className={
                          this.state.page == this.state.pages ? "disabled" : ""
                        }
                      >
                        <PaginationLink onClick={this.handleNextPage}>
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}
export default ShipmentIn;
