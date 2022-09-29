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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ReactDatetime from "react-datetime";
import APICity from "./../../../apis/APICity";
import APIAirport from "./../../../apis/APIAirport";

class ShipmentStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idAirport: 0,
      documentR: "",
      nameR: "",
      lastnameR: "",
      emailR: "",
      cellphoneR: "",
      destCity: 0,
      destCountry: 0,
      destAirport: "",
      destAirportName: "",
      nameCity: "Selecciona una ciudad",
      cities: [],
      optionCities2: [],
      messageValidation: [],
      shipment: {
        codCli: this.props.location.state.shipment["codCli"],
        documentCli: this.props.location.state.shipment["documentCli"],
        nameCli: this.props.location.state.shipment["nameCli"],
        lastnameCli: this.props.location.state.shipment["lastnameCli"],
        emailCli: this.props.location.state.shipment["emailCli"],
        cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
        foundClient: this.props.location.state.shipment["foundClient"],

        nameRec: "",
        lastnameRec: "",
        documentRec: "",
        destCountry: -1,
        destCity: -1,
        destAirport: -1,
      },
    };
    this.closeNewShipment = this.closeNewShipment.bind(this);
    this.goNextStep = this.goNextStep.bind(this);
    this.returnPreviousStep = this.returnPreviousStep.bind(this);
    this.handleChangeDestCity = this.handleChangeDestCity.bind(this);
    this.handleChangeDestCountry = this.handleChangeDestCountry.bind(this);
    this.handleChangeDocumentR = this.handleChangeDocumentR.bind(this);
    this.handleChangeLastnameR = this.handleChangeLastnameR.bind(this);
    this.handleChangeNameR = this.handleChangeNameR.bind(this);
  }

  closeNewShipment = () => {
    this.props.history.push({
      pathname: "/admin/shipments",
    });
  };

  goNextStep = () => {
    //console.log(this.state.shipment);    
    if (this.state.nameR.length>0 && this.state.lastnameR.length>0 && this.state.documentR.length>0 
       && this.state.destCity!==0 && this.state.country!==0 ){
      //Datos completos   
      this.props.history.push({
        pathname: "/admin/addShipmentStep3",
        state: {
          shipment: {
              codCli: this.props.location.state.shipment["codCli"],
              documentCli: this.props.location.state.shipment["documentCli"],
              nameCli: this.props.location.state.shipment["nameCli"],
              lastnameCli: this.props.location.state.shipment["lastnameCli"],
              emailCli: this.props.location.state.shipment["emailCli"],
              cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
              foundClient: this.props.location.state.shipment["foundClient"],
              //DATOS DEL STEP 2
              nameRec: this.state.nameR,
              lastnameRec: this.state.lastnameR,
              documentRec: this.state.documentR,
              destCountry: this.state.destCountry,
              destCity: this.state.destCity,
              destAirport: this.state.idAirport,
              //DATOS DEL STEP 3
              length: this.props.location.state.shipment["length"],
              width: this.props.location.state.shipment["width"],
              height: this.props.location.state.shipment["height"],
              weight: this.props.location.state.shipment["weight"],
              status: this.props.location.state.shipment["status"],
              fragile:this.props.location.state.shipment["fragile"],
              description: this.props.location.state.shipment["description"],
        
            },
          }
      });
    }
    else{
      //Datos incompletos
      let alertMessage = <Alert color="primary">Los datos están incompletos</Alert>;
      this.setState({
        messageValidation: alertMessage,
      })

    }

  };
  returnPreviousStep = () => {
    if (this.state.nameR == ""){
      this.props.history.push({
        pathname: "/admin/addShipmentStep1",
        state: {
          shipment: {
            //DATOS DEL STEP 1
            codCli: this.props.location.state.shipment["codCli"],
            documentCli: this.props.location.state.shipment["documentCli"],
            nameCli: this.props.location.state.shipment["nameCli"],
            lastnameCli: this.props.location.state.shipment["lastnameCli"],
            emailCli: this.props.location.state.shipment["emailCli"],
            cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
            foundClient: this.props.location.state.shipment["foundClient"],          
  
  
          },
        },
      });

    }
    else{
      this.props.history.push({
        pathname: "/admin/addShipmentStep1",
        state: {
          shipment: {
            //DATOS DEL STEP 1
            codCli: this.props.location.state.shipment["codCli"],
            documentCli: this.props.location.state.shipment["documentCli"],
            nameCli: this.props.location.state.shipment["nameCli"],
            lastnameCli: this.props.location.state.shipment["lastnameCli"],
            emailCli: this.props.location.state.shipment["emailCli"],
            cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
            foundClient: this.props.location.state.shipment["foundClient"],
            //DATOS DEL STEP 2
            nameRec: this.state.nameR,
            lastnameRec: this.state.lastnameR,
            documentRec: this.state.documentR,
            destCountry: this.state.destCountry,
            destCity: this.state.destCity,
            destAirport: this.state.idAirport,
            //DATOS DEL STEP 3
            length:  this.props.location.state.shipment["length"],
            width:  this.props.location.state.shipment["width"],
            height:  this.props.location.state.shipment["height"],
            weight:  this.props.location.state.shipment["weight"],
            status:  this.props.location.state.shipment["status"],
            fragile: this.props.location.state.shipment["fragile"],
            description: this.props.location.state.shipment["description"],


          },
        },
      });
    }
  };
  //---------------------------------------------------------------
  handleChangeDestCity = async (event) => {
    let valueCity = event.target.value;
    if (event.target.value != 0) {
      this.setState(
        {
          destCity: event.target.value,
          messageValidation: [],
          idAirport: valueCity,
          shipment: {
            destCity: valueCity,
            destAirport: this.state.shipment.destAirport,

            codCli: this.props.location.state.shipment["codCli"],
            documentCli: this.props.location.state.shipment["documentCli"],
            nameCli: this.props.location.state.shipment["nameCli"],
            lastnameCli: this.props.location.state.shipment["lastnameCli"],
            emailCli: this.props.location.state.shipment["emailCli"],
            cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
            foundClient: this.props.location.state.shipment["foundClient"],

            nameRec: this.state.shipment.nameRec,
            lastnameRec: this.state.shipment.lastnameRec,
            documentRec: this.state.shipment.documentRec,
            destCountry: this.state.shipment.destCountry,
          },
        },
        
      );

      const airportService = new APIAirport();
      const airportResponse = await airportService.queryAirportByIdCity(
        event.target.value
      );
      let airport = airportResponse["resultado"];
      this.setState({
        destAirport: airport["code"],
        messageValidation: [],
        destAirportName: airport["description"],
        shipment: {
          destCity: valueCity,
          destAirport: airport["id"],
          codCli: this.props.location.state.shipment["codCli"],
          documentCli: this.props.location.state.shipment["documentCli"],
          nameCli: this.props.location.state.shipment["nameCli"],
          lastnameCli: this.props.location.state.shipment["lastnameCli"],
          emailCli: this.props.location.state.shipment["emailCli"],
          cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
          foundClient: this.props.location.state.shipment["foundClient"],

          nameRec: this.state.shipment.nameRec,
          lastnameRec: this.state.shipment.lastnameRec,
          documentRec: this.state.shipment.documentRec,
          destCountry: this.state.shipment.destCountry,
        },
      });
    } else {
      this.setState(
        {
          messageValidation: [],
          destCity: 0,
          destAirport: "",
          destAirportName: "Aeropuerto destino",
        },
        
      );
    }
    
    //console.log(this.state.destCity);
    

    //console.log(airport);
  };

  handleChangeDestCountry = async (event) => {
    if (event.target.value != 0) {
      this.setState(
        {
          destCountry: event.target.value,
          messageValidation: [],
          destCity: 0,
          destAirport: "",
          destAirportName: "Aeropuerto destino",

          shipment: {
            destCountry: event.target.value,
            destCity: 0,

            codCli: this.props.location.state.shipment["codCli"],
            documentCli: this.props.location.state.shipment["documentCli"],
            nameCli: this.props.location.state.shipment["nameCli"],
            lastnameCli: this.props.location.state.shipment["lastnameCli"],
            emailCli: this.props.location.state.shipment["emailCli"],
            cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
            foundClient: this.props.location.state.shipment["foundClient"],

            nameRec: this.state.shipment.nameRec,
            lastnameRec: this.state.shipment.lastnameRec,
            documentRec: this.state.shipment.documentRec,
            destAirport: this.state.shipment.destAirport,
          },
        },
        
      );
      //console.log(event.target.value);

      const cityService = new APICity();
      let idCity = sessionStorage.getItem("idCityAirport");
      const citiesA = await cityService.queryCitiesByIdCountry(
        event.target.value, idCity
      );

      let cities = [];
      if (citiesA["estado"].length<3){
        cities.push(citiesA["resultado"]);
      }
      this.setState({ cities: cities });
      
    } else {
      this.setState({
        destCity: 0,
        destAirport: "",
        destAirportName: "Aeropuerto destino",
        destCountry: 0,
      });
    }
    //console.log(this.state.destCountry);
  };
  handleChangeDocumentR = (event) => {
    this.setState({
      documentR: event.target.value,
      messageValidation: [],
      shipment: {
        documentRec: event.target.value,
        destCountry: this.state.shipment.destCountry,
        destCity: this.state.shipment.destCity,

        codCli: this.props.location.state.shipment["codCli"],
        documentCli: this.props.location.state.shipment["documentCli"],
        nameCli: this.props.location.state.shipment["nameCli"],
        lastnameCli: this.props.location.state.shipment["lastnameCli"],
        emailCli: this.props.location.state.shipment["emailCli"],
        cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
        foundClient: this.props.location.state.shipment["foundClient"],

        nameRec: this.state.shipment.nameRec,
        lastnameRec: this.state.shipment.lastnameRec,
        destAirport: this.state.shipment.destAirport,
      },
    });
    //console.log(this.state.shipment.documentRec);
  };
  handleChangeLastnameR = (event) => {
    this.setState({
      lastnameR: event.target.value,
      messageValidation: [],
      shipment: {
        lastnameRec: event.target.value,
        documentRec: this.state.shipment.documentRec,
        destCountry: this.state.shipment.destCountry,
        destCity: this.state.shipment.destCity,

        codCli: this.props.location.state.shipment["codCli"],
        documentCli: this.props.location.state.shipment["documentCli"],
        nameCli: this.props.location.state.shipment["nameCli"],
        lastnameCli: this.props.location.state.shipment["lastnameCli"],
        emailCli: this.props.location.state.shipment["emailCli"],
        cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
        foundClient: this.props.location.state.shipment["foundClient"],

        nameRec: this.state.shipment.nameRec,
        destAirport: this.state.shipment.destAirport,
      },
    });
    //console.log(this.state.shipment.lastnameRec);
  };
  handleChangeNameR = (event) => {
    this.setState({
      nameR: event.target.value,
      messageValidation: [],
      shipment: {
        nameRec: event.target.value,
        lastnameRec: this.state.shipment.lastnameRec,
        documentRec: this.state.shipment.documentRec,
        destCountry: this.state.shipment.destCountry,
        destCity: this.state.shipment.destCity,
        destAirport: this.state.shipment.destAirport,

        codCli: this.props.location.state.shipment["codCli"],
        documentCli: this.props.location.state.shipment["documentCli"],
        nameCli: this.props.location.state.shipment["nameCli"],
        lastnameCli: this.props.location.state.shipment["lastnameCli"],
        emailCli: this.props.location.state.shipment["emailCli"],
        cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
        foundClient: this.props.location.state.shipment["foundClient"],
      },
    });
    //console.log(this.state.shipment.nameRec);
  };
  //----------------------------------------------------------------
  componentWillMount=async()=>{
    if (this.props.location.state!=undefined && this.props.location.state.shipment["nameRec"]!=undefined){
      //completar ciudad y aeropuerto si se se regresó
      const cityService = new APICity();
      let idCity = sessionStorage.getItem("idCityAirport");
      const citiesA = await cityService.queryCitiesByIdCountry(
        this.props.location.state.shipment["destCountry"], idCity
      );
      let cities = [];
      if (citiesA["estado"].length<3){
        cities.push(citiesA["resultado"]);
      }
      const airportService = new APIAirport();
      const airportResponse = await airportService.queryAirportByIdCity(
        this.props.location.state.shipment["destCity"]
      );
      let airport = airportResponse["resultado"];

      
      this.setState({
        idAirport: airportResponse["resultado"]["id"],
        documentR: this.props.location.state.shipment["documentRec"],
        nameR: this.props.location.state.shipment["nameRec"],
        lastnameR: this.props.location.state.shipment["lastnameRec"],
        destCountry: this.props.location.state.shipment["destCountry"] ,
        cities: cities,
        destCity: this.props.location.state.shipment["destCity"],
        destAirportName: airportResponse["resultado"]["description"],
        shipment: {
          nameRec: this.props.location.state.shipment["nameRec"],
          lastnameRec: this.props.location.state.shipment["lastnameRec"],
          documentRec:  this.props.location.state.shipment["documentRec"],
          destCountry: this.props.location.state.shipment["destCountry"],
          destCity: this.props.location.state.shipment["destCity"],
          destAirport: this.props.location.state.shipment["destAirport"],
  
          codCli: this.props.location.state.shipment["codCli"],
          documentCli: this.props.location.state.shipment["documentCli"],
          nameCli: this.props.location.state.shipment["nameCli"],
          lastnameCli: this.props.location.state.shipment["lastnameCli"],
          emailCli: this.props.location.state.shipment["emailCli"],
          cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
          foundClient: this.props.location.state.shipment["foundClient"],
        },
        
      })
    }
  }
  render() {
    let countries = this.props.location.state.countries["resultado"];

    let optionItems = [];
    let optionCities = [];

    if (countries.length > 0) {
      optionItems = countries.map((country) => (
        <option value={country["id"]}>{country["name"]}</option>
      ));
    }

    if (this.state.cities.length > 0) {
      optionCities = this.state.cities.map((city) => (
        <option value={city["id"]}>{city["name"]}</option>
      ));
    }
    //console.log(this.props.location.state.shipment["codCli"]);

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Card className="bg-secondary shadow" style={{ width: "80rem" }}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="10" className="col-sm">
                    <h3 className="mb-0">2) Detalles del envío </h3>
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
                        <PaginationItem className="active">
                          <PaginationLink>2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
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
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <h3>Datos del cliente receptor</h3>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-receivingCLientName"
                          >
                            Nombre
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue=""
                            id="input-receivingCLientName"
                            placeholder="Nombre"
                            type="text"
                            value={this.state.nameR}
                            onChange={(ev) => {
                              this.handleChangeNameR(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-receivingCLientLastName"
                          >
                            Apellido
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue=""
                            id="input-receivingCLientLastName"
                            placeholder="Apellido"
                            type="text"
                            value={this.state.lastnameR}
                            onChange={(ev) => {
                              this.handleChangeLastnameR(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-receivingClientDocument"
                          >
                            Número de documento
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue=""
                            id="input-receivingNameCLient"
                            placeholder="Número de documento"
                            type="text"
                            value={this.state.documentR}
                            onChange={(ev) => {
                              this.handleChangeDocumentR(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <h3>Datos del destino</h3>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-destinatioCountry"
                          >
                            País destino
                          </label>
                          <Input
                            className="form-control-alternative"
                            type="select"
                            placeholder="País destino"
                            name="select"
                            id="input-destinationCountry"
                            value={this.state.destCountry}
                            onChange={(ev) => {
                              this.handleChangeDestCountry(ev);
                            }}
                          >
                            <option value={0}>Selecciona un país</option>
                            {optionItems}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-destinationCity"
                          >
                            Ciudad destino
                          </label>
                          <Input
                            className="form-control-alternative"
                            type="select"
                            placeholder="Ciudad destino"
                            name="select"
                            id="input-destinationCity"
                            value = {this.state.destCity}
                            onChange={(ev) => {
                              this.handleChangeDestCity(ev);
                            }}
                          >
                            <option value={0}>Seleccionar ciudad</option>
                            {optionCities}
                          </Input>
                          
                          
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-destinationAirport"
                          >
                            Aeropuerto destino
                          </label>
                          <Input
                            disabled
                            className="form-control-alternative"                            
                            id="input-destinationAirport"
                            placeholder="Aeropuerto destino"
                            type="text"
                            value={this.state.destAirportName}
                          />
                          
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {this.state.messageValidation}
                    </Row>
                  </div>
                </Form>
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
                      <i className="ni ni-bold-left"/>
                      </span>
                      <span className="btn-inner--text">Regresar</span>                      
                    </Button>
                  </Col>
                  <Col className="text-right">
                    <Button
                      className="btn-icon btn-3"
                      color="primary"
                      type="button"
                      onClick={this.goNextStep}
                    >
                      
                      <span className="btn-inner--text">Siguiente</span>
                      <span className="btn-inner--icon">
                      <i className="ni ni-bold-right"/>
                      </span>
                    </Button>
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
export default ShipmentStep2;
