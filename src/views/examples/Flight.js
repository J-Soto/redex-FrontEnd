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
  InputGroup,
  InputGroupAddon,
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
const serviceAirport = new APIAirport();

class Flight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoFlights: [],
      infoFlight: [],
      flightCode: 0,
      foundFlight: false,
      capacityFlight: -1,
      listPages: [],
      page: 1,
      pages: 0,
      iniPage: 0,
      finPage: 10,
      pageItems: [],
      listPages: [],
      page: 1,
      pages: 0,
      iniPage: 0,
      finPage: 10,
      pageItems: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.findFlightByCode = this.findFlightByCode.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.saveCapacity = this.saveCapacity.bind(this);
  }

  findFlightByCode = async () => {
    //Buscar vuelo por código de vuelo
    let infoFlight;

    

    if (this.state.flightCode === '0' || this.state.flightCode === ''){
      console.log("TODOS");
      infoFlight = await serviceAirport.queryAllFlights();

      if (infoFlight["estado"].length < 3) {
        let pageItems = infoFlight["resultado"].slice(
          this.state.iniPage,
          this.state.finPage
        );  
        console.log(pageItems);
        this.setState({
          infoFlights: infoFlight["resultado"],
          pages: Math.ceil(infoFlight["resultado"].length / 10),
          pageItems: pageItems,
          foundFlight: false,
        });
      }
      for (let i = 0; i < this.state.pages; i++) {
        this.state.listPages.push(i + 1);
      } 

    }else{
      console.log("FILTRADO");
      infoFlight = await serviceAirport.findFlightById(
        this.state.flightCode
      );

      if (infoFlight["estado"].length < 3) {
        this.setState({
          infoFlight: infoFlight["resultado"],
          foundFlight: true,
          pageItems: infoFlight["resultado"],
        });
      } else {
        this.setState({
          foundFlight: false,
        });
      }
    }
   
   
  };
  saveCapacity = async (idFlight) => {
    const resultSave = await serviceAirport.editCapacity(
      idFlight,
      this.state.capacityFlight
    );

    if (resultSave["estado"].length < 3) {
      //se guardó la nueva capacidad
      const resultAirports = await serviceAirport.queryAllFlights();
      console.log(
        resultAirports["resultado"],
        this.state.iniPage,
        this.state.finPage
      );
      let pageItems = resultAirports["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoFlights: resultAirports["resultado"],
        pageItems: pageItems,
      });
      //falta para un vuelo se setea la info del vuelo, se vuelve a buscar y se setea
    }
  };
  handleChange = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentWillMount = async () => {
    const resultFlights = await serviceAirport.queryAllFlights();

    if (resultFlights["estado"].length < 3) {
      let pageItems = resultFlights["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoFlights: resultFlights["resultado"],
        pages: Math.ceil(resultFlights["resultado"].length / 10),
        pageItems: pageItems,
      });
    }
    for (let i = 0; i < this.state.pages; i++) {
      this.state.listPages.push(i + 1);
    }
  };
  handlePrevPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoFlights.slice(
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
    let pageItems = this.state.infoFlights.slice(
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

  render() {
    let items = [];
    //console.log(this.state.pages);
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
    }

    if (this.state.foundFlight) {
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
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Vuelos</h3>
                    </Col>
                    <Col>
                      <Form>
                        <FormGroup>
                          <InputGroup className="mb-4 justify-content-center">
                            <Input
                              placeholder="Buscar por código de vuelo"
                              type="text"
                              name="flightCode"
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
                                onClick={this.findFlightByCode}
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
                    <Col xs="4"></Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Código de vuelo</th>
                      <th scope="col">Ciudad, País Origen</th>
                      <th scope="col">Hora de despegue</th>
                      <th scope="col">Ciudad, País Destino</th>
                      <th scope="col">Hora de aterrizaje</th>
                      <th scope="col">Capacidad</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!this.state.foundFlight ? (
                      this.state.pageItems.map((flight) => {
                        return (
                          <tr key={flight["idFlight"]}>
                            <th>{flight["idFlight"]}</th>
                            <td>
                              {flight["takeOffAirport"]["city"]["name"]}
                              {", "}
                              {
                                flight["takeOffAirport"]["city"]["country"][
                                  "name"
                                ]
                              }
                            </td>
                            <td>{flight["takeOffTime"]}</td>
                            <td>
                              {flight["arrivalAirport"]["city"]["name"]}
                              {", "}
                              {
                                flight["arrivalAirport"]["city"]["country"][
                                  "name"
                                ]
                              }
                            </td>
                            <td>{flight["arrivalTime"]}</td>
                            <td>
                              <Input
                                type="text"
                                name="capacityFlight"
                                defaultValue={flight["capacity"]}
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
                                  this.saveCapacity(flight["idFlight"]);
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
                      })
                    ) : (
                      <tr key={this.state.infoFlight["idFlight"]}>
                        <th>{this.state.infoFlight["idFlight"]}</th>
                        <td>
                          {
                            this.state.infoFlight["takeOffAirport"]["city"][
                              "name"
                            ]
                          }
                          {", "}
                          {
                            this.state.infoFlight["takeOffAirport"]["city"][
                              "country"
                            ]["name"]
                          }
                        </td>
                        <td>{this.state.infoFlight["takeOffTime"]}</td>
                        <td>
                          {
                            this.state.infoFlight["arrivalAirport"]["city"][
                              "name"
                            ]
                          }
                          {", "}
                          {
                            this.state.infoFlight["arrivalAirport"]["city"][
                              "country"
                            ]["name"]
                          }
                        </td>
                        <td>{this.state.infoFlight["arrivalTime"]}</td>
                        <td>
                          <Input
                            type="text"
                            name="capacityFlight"
                            defaultValue={this.state.infoFlight["capacity"]}
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
                              this.saveCapacity(
                                this.state.infoFlight["idFlight"]
                              );
                            }}
                          >
                            <span className="btn-inner--icon">
                              <i className="far fa-save" />
                            </span>
                            <span className="btn-inner--text">Guardar</span>
                          </Button>
                        </td>
                      </tr>
                    )}
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
export default Flight;
