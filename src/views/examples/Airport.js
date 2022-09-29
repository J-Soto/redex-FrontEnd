import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  Col,
  Form,
  FormGroup,
  Input,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import APIAirport from "./../../apis/APIAirport.js";
import APICountry from "./../../apis/APICountry.js";
import APICity from "./../../apis/APICity.js";
import APIWarehouse from "apis/APIWarehouse.js";
const serviceAirport = new APIAirport();
const countryService = new APICountry();
const cityService = new APICity();
const warehouseService = new APIWarehouse();

class Airport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoAirports: [],
      countries: [],
      cities: [],
      idCityFilter: 0,
      idCountryFilter: 0,
      airportsForFilter: [],
      isFiltered: false,
      capacityWarehouse: -1,
      listPages: [],
      page: 1,
      pages: 0,
      iniPage: 0,
      finPage: 10,
      pageItems: [],
      //pageItemsFiltered:[],
      pageFiltered: 1,
      pagesFiltered: 0,
      iniPageFiltered: 0,
      finPageFiltered: 10,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterData = this.filterData.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.saveCapacity = this.saveCapacity.bind(this);
  }

  saveCapacity = async (idWarehouse) => {
    const resultSave = await warehouseService.editCapacity(
      idWarehouse,
      this.state.capacityWarehouse
    );

    if (resultSave["estado"].length < 3) {
      //se guardó la nueva capacidad

      const resultAirports = await serviceAirport.queryAllAirports();

      let pageItems = resultAirports["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        airportsForFilter: resultAirports["resultado"],
        infoAirports: resultAirports["resultado"],
        pageItems: pageItems,
      });
    }
  };

  filterData = () => {
    let airportsFilter = [];
    let isFiltered = true;
    let airportsForFilter = this.state.airportsForFilter;
    if (this.state.idCountryFilter > 0 && this.state.idCityFilter > 0) {
      //escogio país y ciudad
      airportsForFilter.map((airport) => {
        if (
          airport["city"]["country"]["id"] == this.state.idCountryFilter &&
          airport["city"]["id"] == this.state.idCityFilter
        )
          airportsFilter.push(airport);
      });
    } else if (this.state.idCountryFilter > 0) {
      //solo selecciono país
      airportsForFilter.map((airport) => {
        if (airport["city"]["country"]["id"] == this.state.idCountryFilter)
          airportsFilter.push(airport);
      });
    } else {
      //no hubo selección
      airportsFilter = airportsForFilter;
      isFiltered = false;
    }
    if (isFiltered) {
      //si está filtrado
      this.setState({
        pageItems: airportsFilter,
        isFiltered: isFiltered,
        iniPage: 0,
        finPage: 10,
        pagesFiltered: airportsFilter.length,
      });
    } else {
      //si no está filtrado
      let firstPagination = airportsFilter.slice(0, 10);
      this.setState({
        pageItems: firstPagination,
        isFiltered: isFiltered,
        iniPageFiltered: 0,
        finPageFiltered: 10,
      });
    }
  };
  handleChange = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    //si el cambio es del país se obtienen ciudades
    let nameState = event.target.name;
    let idCountry = event.target.value;
    if (nameState.localeCompare("idCountryFilter") == 0) {
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

  componentWillMount = async () => {
    const resultAirports = await serviceAirport.queryAllAirports();

    
    if (resultAirports["estado"].length < 3){
      let pageItems = resultAirports["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoAirports: resultAirports["resultado"],
        airportsForFilter: resultAirports["resultado"],
        pages: Math.ceil(resultAirports["resultado"].length / 10),
        pageItems: pageItems,
      });
    }
    const countries = await countryService.queryAllCountries();
    if (countries["estado"].length < 3) {
      this.setState({
        countries: countries["resultado"],
      });
    }

    let listPages = [];
    for (let i = 0; i < this.state.pages; i++) {
      this.state.listPages.push(i + 1);
    }
    //console.log(this.state.pageItems);
  };

  handlePrevPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoAirports.slice(
      this.state.iniPage - 10,
      this.state.finPage - 10
    );
    this.setState({
      page: this.state.page - 1,
      iniPage: this.state.iniPage - 10,
      finPage: this.state.finPage - 10,
      pageItems: pageItems,
    });
    //console.log(this.state.pageItems);
  };
  handleNextPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoAirports.slice(
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
    let pageItems = this.state.infoAirports.slice(inicio, fin);
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

    if (this.state.isFiltered) {
      for (let number = 1; number <= this.state.pagesFiltered; number++) {
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
      //console.log(this.state.pages);
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
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Aeropuertos</h3>
                    </Col>
                  </Row>
                  <br />
                  <Form>
                    <Row>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterCountry"
                          >
                            País
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
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-filterCity"
                          >
                            Ciudad
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

                      <Col className="col-sm text-right" lg="6">
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
                      <th scope="col">Código de aeropuerto</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">País</th>
                      <th scope="col">Ciudad</th>
                      <th scope="col">Capacidad</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.pageItems.map((airport) => {
                      return (
                        <tr key={airport["id"]}>
                          <th>{airport["code"]}</th>
                          <td>{airport["description"]}</td>
                          <td>{airport["city"]["country"]["name"]}</td>
                          <td>{airport["city"]["name"]}</td>
                          <td>
                            <Input
                              type="text"
                              name="capacityWarehouse"
                              defaultValue={airport["warehouse"]["capacity"]}
                              onChange={(ev) => {
                                this.handleChange(ev);
                              }}
                            />
                          </td>
                          <td>
                            <Button
                              outline
                              className="btn-icon btn-3"
                              color="primary"
                              data-dismiss="modal"
                              type="button"
                              onClick={() => {
                                this.saveCapacity(airport["warehouse"]["id"]);
                              }}
                            >
                              <span className="btn-inner--icon">
                                <i className="far fa-save" />
                              </span>
                              <span className="btn-inner--text">Guardar</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
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
export default Airport;
