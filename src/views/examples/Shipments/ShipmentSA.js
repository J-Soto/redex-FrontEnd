import React from "react";
// reactstrap components
import {
  Button,
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
import { textSpanIntersectsWithPosition, isThisTypeNode } from "typescript";
var moment = require('moment');
require('moment/locale/es');


class ShipmentSA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateModal: false,
      infoModal: [],
      moreInfoModal: [],
      infoShipments: [],
      infoShipmentsFiltered: [],
      idCountryOFilter: 0,
      idCountryDFilter: 0,
      countries: [],
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
      iniPageFiltered: 0,
      finPageFiltered: 10,
    };

    this.showRoutes = this.showRoutes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    
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
    //País origen y destino, fechas
    let shipmentsFilter = [];
    let filterCountry = false;
    let filterDate = false;

    //volver a llamar a todos los envíos
    let shipmentsForFilter = this.state.infoShipments;
    let selectionStatus =
      this.state.statusFilter.localeCompare("SIN_SELECCION") == 0 ? 0 : 1;

    if (
      this.state.idCountryOFilter > 0 &&
      this.state.idCountryDFilter > 0 &&
      selectionStatus == 1
    ) {
      //escogio país origen, país destino y estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryOFilter &&
          shipment["destinationAirport"]["city"]["country"]["id"] ==
            this.state.idCountryDFilter &&
          shipment["status"].localeCompare(this.state.statusFilter) == 0
        )
          shipmentsFilter.push(shipment);
      });
    } else if (
      this.state.idCountryOFilter > 0 &&
      this.state.idCountryDFilter > 0
    ) {
      //solo selecciono país origen y país destino
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryOFilter &&
          shipment["destinationAirport"]["city"]["country"]["id"] ==
            this.state.idCountryDFilter
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryOFilter > 0 && selectionStatus == 1) {
      //solo selecciono país origen y estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
            this.state.idCountryOFilter &&
          shipment["status"].localeCompare(this.state.statusFilter) == 0
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryDFilter > 0 && selectionStatus == 1) {
      //solo selecciono país destino y estado
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["destinationAirport"]["city"]["country"]["id"] ==
            this.state.idCountryDFilter &&
          shipment["status"].localeCompare(this.state.statusFilter) == 0
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryOFilter > 0) {
      //solo selecciono país origen
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["originAirport"]["city"]["country"]["id"] ==
          this.state.idCountryOFilter
        )
          shipmentsFilter.push(shipment);
      });
    } else if (this.state.idCountryDFilter > 0) {
      //solo selecciono país destino
      filterCountry = true;
      shipmentsForFilter.map((shipment) => {
        if (
          shipment["destinationAirport"]["city"]["country"]["id"] ==
          this.state.idCountryDFilter
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
        filterDate = true;
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
      ? this.setState({
          pageItems: shipmentsFilter.slice(
            this.state.iniPage,
            this.state.finPage
          ),
          pages: Math.ceil(shipmentsFilter.length / 10),
          infoShipmentsFiltered: shipmentsFilter,
        })
      : this.setState({
          pageItems: shipmentsFilterDate.slice(
            this.state.iniPageFiltered,
            this.state.finPageFiltered
          ),
          pages: Math.ceil(shipmentsFilterDate.length / 10),
          infoShipmentsFiltered: shipmentsFilterDate,
        });

    if (
      this.state.statusFilter.localeCompare("SIN_SELECCION") == 0 // &&
      /*this.state.idCityFilter == 0 &&
      this.state.idCountryFilter == 0 &&
      this.state.startDate == null &&
      this.endDate == null*/
    ) {
      this.setState({ isFiltered: false });
    } else {
      this.setState({ isFiltered: true });
    }
  };nfoShipments
  componentWillMount = async () => {
    const shipmentService = new APIShipment();
    const countryService = new APICountry();
    const infoShipments = await shipmentService.listShipmentsAll();
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
    var pageItems;
    if (!this.state.isFiltered) {
      pageItems = this.state.infoShipments.slice(
        this.state.iniPage - 10,
        this.state.finPage - 10
      );
      this.setState({
        page: this.state.page - 1,
        iniPage: this.state.iniPage - 10,
        finPage: this.state.finPage - 10,
        pageItems: pageItems,
      });
    } else {
      pageItems = this.state.infoShipmentsFiltered.slice(
        this.state.iniPageFiltered - 10,
        this.state.finPageFiltered - 10
      );
      this.setState({
        page: this.state.page - 1,
        iniPageFiltered: this.state.iniPageFiltered - 10,
        finPageFiltered: this.state.finPageFiltered - 10,
        pageItems: pageItems,
      });
    }

    console.log(this.state.pageItems);
  };
  handleNextPage = (event) => {
    //console.log(this.state.infoShipments);
    var pageItems;
    if (!this.state.isFiltered) {
      pageItems = this.state.infoShipments.slice(
        this.state.iniPage + 10,
        this.state.finPage + 10
      );
      this.setState({
        page: this.state.page + 1,
        iniPage: this.state.iniPage + 10,
        finPage: this.state.finPage + 10,
        pageItems: pageItems,
      });
    } else {
      pageItems = this.state.infoShipmentsFiltered.slice(
        this.state.iniPageFiltered + 10,
        this.state.finPageFiltered + 10
      );
      this.setState({
        page: this.state.page + 1,
        iniPageFiltered: this.state.iniPageFiltered + 10,
        finPageFiltered: this.state.finPageFiltered + 10,
        pageItems: pageItems,
      });
    }

    console.log(this.state.pageItems);
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
    if (this.state.countries.length > 0) {
      optionCountries = this.state.countries.map((country) => (
        <option value={country["id"]}>{country["name"]}</option>
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

    if (this.state.isFiltered) {
      console.log("filtrado");
      let pagesFiltered = Math.ceil(
        this.state.infoShipmentsFiltered.length / 10
      );
      console.log(pagesFiltered);
      console.log(this.state.page);
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
      console.log("normal");
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
                  </Row>
                  <br />
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
                            <option value={"EN_PROCESO"}>EN PROCESO</option>
                            <option value={"ATRASADO"}>ATRASADO</option>
                            <option value={"EN_DESTINO"}>EN DESTINO</option>
                            <option value={"FINALIZADO"}>FINALIZADO</option>
                            <option value={"CANCELADO"}>CANCELADO</option>
                            <option value={"SIMULADO"}>SIMULADO</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="2">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterCountryO"
                          >
                            País origen
                          </label>
                          <Input
                            placeholder="País origen"
                            type="select"
                            name="idCountryOFilter"
                            id="input-filterCountryO"
                            value={this.state.idCountryOFilter}
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
                            htmlFor="input-filterCountryD"
                          >
                            País destino
                          </label>
                          <Input
                            placeholder="País destino"
                            type="select"
                            name="idCountryDFilter"
                            id="input-filterCountryD"
                            value={this.state.idCountryDFilter}
                            onChange={(ev) => {
                              this.handleChange(ev);
                            }}
                          >
                            <option value={0}>Seleccionar país</option>
                            {optionCountries}
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
                      {/* <th scope="col">COD. RASTREO</th> */}
                      <th scope="col">ESTADO</th>
                      <th scope="col">PAÍS, CIUDAD ORIGEN</th>
                      <th scope="col">PAÍS, CIUDAD DESTINO</th>
                      {/* <th scope="col">CLIENTE EMISOR</th> */}
                      <th scope="col">FECHA REGISTRO</th>
                      <th scope="col">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.pageItems.map((shipment) => {
                      //pageItems en vez de infoShipments
                      return (
                        <tr key={shipment["id"]}>
                          {/* <th>{shipment["trackingCode"]}</th> */}
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
                          {/* <td>
                            {shipment["send_client"]["name"]}{" "}
                            {shipment["send_client"]["lastname"]}
                          </td> */}
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
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      );
                    })}
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
                    {/* <Form>
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
                    </Form> */}
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
                          <th scope="col">FECHA/ HORA DE DESPEGUE</th>
                          <th scope="col">CIUDA/PAÍS DESTINO</th>
                          <th scope="col">FECHA/ HORA DE ATERRIZAJE</th>
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
                      className="btn-icon btn-3"
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.showRoutes([])}
                    >
                      <span className="btn-inner--icon">
                        <i className="fas fa-times-circle" />
                      </span>
                      <span className="btn-inner--text">Cerrar</span>
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
export default ShipmentSA;
