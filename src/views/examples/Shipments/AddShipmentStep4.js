import React from "react";
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
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Spinner,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import APITravelPlan from "./../../../apis/APITravelPlan";
import APIClient from "./../../../apis/APIClient.js";
import APIShipment from "./../../../apis/APIShipment.js";

class ShipmentStep4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routePlan: [],
      routePlanPrincipal: [],
      saveShipment: false,
      onTime: true,
      saving: false,
      loading: false,
      foundRoute: false,
    };
    this.closeNewShipment = this.closeNewShipment.bind(this);
    this.returnPreviousStep = this.returnPreviousStep.bind(this);
    this.saveNewShipment = this.saveNewShipment.bind(this);
  }

  closeNewShipment = () => {
    this.props.history.push({
      pathname: "/admin/shipmentsOut",
    });
  };

  saveNewShipment = async () => {
    //enviar información del envío
    this.setState({ loading: true });
    const shipmentService = new APIShipment();
    let status = 0;
    let late = 0;
    let send_client = this.props.location.state.foundClient
      ? {
          id: this.props.location.state.codCli,
          document: this.props.location.state.documentCli,
          name: this.props.location.state.nameCli,
          lastname: this.props.location.state.lastnameCli,
          email: this.props.location.state.emailCli,
          cellphone: this.props.location.state.cellphoneCli,
        }
      : {
          document: this.props.location.state.documentCli,
          name: this.props.location.state.nameCli,
          lastname: this.props.location.state.lastnameCli,
          email: this.props.location.state.emailCli,
          cellphone: this.props.location.state.cellphoneCli,
        };

    let receive_client_document = this.props.location.state.documentRec;
    let receive_client_name = this.props.location.state.nameRec;
    let receive_client_lastname = this.props.location.state.lastnameRec;

    let originAirport = {
      id: sessionStorage.getItem("idAirport"),
      code: sessionStorage.getItem("codeAirport"),
      longitude: sessionStorage.getItem("longitudeAirport"),
      latitude: sessionStorage.getItem("latitudeAirport"),
      description: sessionStorage.getItem("descriptionAirport"),
      city: {
        id: sessionStorage.getItem("idCityAirport"),
        name: sessionStorage.getItem("cityAirport"),
        country: {
          id: sessionStorage.getItem("idCountryAirport"),
          name: sessionStorage.getItem("countryAirport"),
        },
      },
    };
    console.log(this.props.location.state.fragile);
    let pack = {
      weight: this.props.location.state.weight,
      large: this.props.location.state.length,
      width: this.props.location.state.width,
      high: this.props.location.state.height,
      fragile: this.props.location.state.fragile === "1" ? true : false,
      status: 0,
      description: this.props.location.state.description,
      routePlan: this.state.routePlanPrincipal,
    };
    console.log(pack);
    const saveShipment = await shipmentService.saveShipment(
      status,
      late,
      send_client,
      receive_client_document,
      receive_client_name,
      receive_client_lastname,
      originAirport,
      pack
    );

    console.log(saveShipment["estado"]);
    this.setState({ loading: false });
    if (saveShipment["estado"].length < 3) {
      //Se guardó el envío, entonces regresa a la tabla envíos
      this.setState({ saveShipment: true, saving: true });
      this.closeNewShipment();
    } else {
      this.setState({ saveShipment: false, saving: true });
    }
  };

  returnPreviousStep = () => {
    this.props.history.push({
      pathname: "/admin/addShipmentStep3",
      state: {
        shipment: {
          destCity: this.props.location.state.destCity,
          destAirport: this.props.location.state.destAirport,
          codCli: this.props.location.state.codCli,
          documentCli: this.props.location.state.documentCli,
          nameCli: this.props.location.state.nameCli,
          lastnameCli: this.props.location.state.lastnameCli,
          emailCli: this.props.location.state.emailCli,
          cellphoneCli: this.props.location.state.cellphoneCli,
          foundClient: this.props.location.state.foundClient,

          nameRec: this.props.location.state.nameRec,
          lastnameRec: this.props.location.state.lastnameRec,
          documentRec: this.props.location.state.documentRec,
          destCountry: this.props.location.state.destCountry,

          length: this.props.location.state.length,
          width: this.props.location.state.width,
          height: this.props.location.state.height,
          weight: this.props.location.state.weight,
          status: this.props.location.state.status,
          fragile: this.props.location.state.fragile,
          description: this.props.location.state.description,
        },
      },
    });
    console.log();
  };
  componentWillMount = async () => {
    const routeService = new APITravelPlan();
    const idStart = sessionStorage.getItem("idAirport");
    //console.log(idStart, this.props.location.state["destAirport"]);
    const routePlan = await routeService.generateRoute(
      idStart,
      this.props.location.state["destAirport"]
    );

    //asumiendo paquetes a mismo continente
    let lengthFlightPlans = routePlan["resultado"]["flightPlans"].length;
    let foundRoute = lengthFlightPlans == 0 ? 0 : 1;
    let onTime;
    if (foundRoute) {
      if (
        routePlan["resultado"]["flightPlans"][0]["flight"]["takeOffAirport"][
          "city"
        ]["country"]["continent"]["name"].localeCompare(
          routePlan["resultado"]["flightPlans"][lengthFlightPlans - 1][
            "flight"
          ]["arrivalAirport"]["city"]["country"]["continent"]["name"]
        ) === 0
      ) {
        //mismo continente: un día
        onTime =
          routePlan["resultado"]["estimatedTime"] - 1440 > 0 ? false : true;
      } else {
        //distinto continente: dos días
        onTime =
          routePlan["resultado"]["estimatedTime"] - 2880 > 0 ? false : true;
      }
    }

    if (routePlan["estado"].length < 3) {
      //se tienen los pedidos
      this.setState({
        routePlan: routePlan["resultado"]["flightPlans"],
        routePlanPrincipal: routePlan["resultado"],
        onTime: onTime,
        foundRoute: foundRoute,
      });
    }
  };

  render() {
    //console.log(this.props.location.state["destAirport"]);
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {/*Table*/}
          <Row>
            <Card className="bg-secondary shadow" style={{ width: "80rem" }}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="10" className="col-sm">
                    <h3 className="mb-0">4) Resultados del plan de vuelo </h3>
                  </Col>
                  <Col xs="8" className="col-sm">
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-center mb-0"
                        listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem>
                          <PaginationLink>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="active">
                          <PaginationLink>4</PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </Col>
                  <Col className="col-sm text-right" xs="4">
                    <Button
                      className="btn-icon btn-3"
                      color="primary"
                      type="button"
                      onClick={this.closeNewShipment}
                    >
                      <span className="btn-inner--icon">
                        <i className="fas fa-times-circle" />
                      </span>
                      <span className="btn-inner--text">Cerrar</span>
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">CIUDAD/PAÍS ORIGEN</th>
                      <th scope="col">FECHA/ HORA DE DESPEGUE</th>
                      <th scope="col">CIUDAD/PAÍS DESTINO</th>
                      <th scope="col">FECHA/ HORA DE ATERRIZAJE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.foundRoute
                      ? this.state.routePlan.map((flight) => {
                          return (
                            <tr key={flight["id"]}>
                              <td>
                                {
                                  flight["flight"]["takeOffAirport"]["city"][
                                    "name"
                                  ]
                                }
                                ,{" "}
                                {
                                  flight["flight"]["takeOffAirport"]["city"][
                                    "country"
                                  ]["name"]
                                }
                              </td>
                              <td>
                                {flight["takeOffDate"]}{" "}
                                {flight["flight"]["takeOffTime"]}
                              </td>
                              <td>
                                {
                                  flight["flight"]["arrivalAirport"]["city"][
                                    "name"
                                  ]
                                }
                                ,{" "}
                                {
                                  flight["flight"]["arrivalAirport"]["city"][
                                    "country"
                                  ]["name"]
                                }
                              </td>
                              <td>
                                {flight["arrivalDate"]}{" "}
                                {flight["flight"]["arrivalTime"]}
                              </td>
                            </tr>
                          );
                        })
                      : ""}
                  </tbody>
                </Table>
                {this.state.foundRoute ? (
                  this.state.onTime ? (
                    <Row>
                      <Alert color="success" style={{ marginLeft: "15px" }}>
                        El paquete será enviado dentro del tiempo establecido
                        por la empresa
                      </Alert>
                    </Row>
                  ) : (
                    <Row>
                      <Alert color="primary" style={{ marginLeft: "15px" }}>
                        El paquete no será enviado dentro del tiempo establecido
                        por la empresa
                      </Alert>
                    </Row>
                  )
                ) : (
                  <Row>
                    <Alert color="primary" style={{ marginLeft: "15px" }}>
                      En estos momentos no se cuenta con la capacidad para
                      registrar el envío.
                    </Alert>
                  </Row>
                )}
                {!this.state.saveShipment ? (
                  <Row>
                    <Alert
                      color="primary"
                      style={{ marginLeft: "15px" }}
                      isOpen={this.state.saving}
                    >
                      No se pudo registar el envío
                    </Alert>
                  </Row>
                ) : (
                  ""
                )}
                <Row>
                  <Col className="text-left">
                    <Button
                      className="btn-icon btn-3"
                      color="primary"
                      outline
                      type="button"
                      onClick={this.returnPreviousStep}
                    >
                      <span className="btn-inner--icon">
                        <i className="ni ni-bold-left" />
                      </span>
                      <span className="btn-inner--text">Regresar</span>
                    </Button>
                  </Col>
                  <Col className="text-right">
                    <Button
                      className="btn-icon btn-3"
                      color="primary"
                      type="button"
                      onClick={this.saveNewShipment}
                    >
                      <span className="btn-inner--icon">
                        <i className="far fa-save" />
                      </span>
                      <span className="btn-inner--text">Confirmar envío</span>
                    </Button>
                    {this.state.loading && <Spinner color="primary" />}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </>
    );
  }
}
export default ShipmentStep4;
