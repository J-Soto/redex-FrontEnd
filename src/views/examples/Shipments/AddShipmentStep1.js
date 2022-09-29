import React from "react";
// reactstrap components
import {
  UncontrolledAlert,
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
//apis
import APICountry from "./../../../apis/APICountry";
import APIClient from "./../../../apis/APIClient";

class ShipmentStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: {},
      documentC: "",
      idC: 0,
      nameC: "",
      lastnameC: "",
      emailC: "",
      cellphoneC: "",
      foundClient: true,
      infoActive: true,
      messageValidation: [],
      shipment: {
        codCli: 0,
        documentCli: "",
        nameCli: "",
        lastnameCli: "",
        emailCli: "",
        cellphoneCli: "",
        foundClient: true,
      },
    };
    this.closeNewShipment = this.closeNewShipment.bind(this);
    this.goNextStep = this.goNextStep.bind(this);
    this.findClientByDocument = this.findClientByDocument.bind(this);
    this.handleChangeIdC = this.handleChangeIdC.bind(this);
    this.handleChangeDocumentC = this.handleChangeDocumentC.bind(this);
    this.handleChangeNameC = this.handleChangeNameC.bind(this);
    this.handleChangeLastnameC = this.handleChangeLastnameC.bind(this);
    this.handleChangeEmailC = this.handleChangeEmailC.bind(this);
    this.handleChangeCellphoneC = this.handleChangeCellphoneC.bind(this);
  }

  closeNewShipment = () => {
    this.props.history.push({
      pathname: "/admin/shipments",
    });
  };

  goNextStep = async () => {
    //console.log(this.state.shipment);
    if (this.state.nameC.length>0 && this.state.lastnameC.length>0 
      && this.state.cellphoneC.length>0 && this.state.documentC.length>0
      && this.state.emailC.length>0){
        
        const countriesService = new APICountry();
        const countries = await countriesService.queryAllCountries();
        //this.setState({ countries: countries });
        this.state.countries = countries;
        //console.log(countries);
        if (this.props.location.state != undefined){
        this.props.history.push({
          pathname: "/admin/addShipmentStep2",
          state: {
            countries: this.state.countries,
            shipment: {
              codCli: this.state.idC,
              documentCli: this.state.documentC,
              nameCli:this.state.nameC ,
              lastnameCli: this.state.lastnameC ,
              emailCli: this.state.emailC ,
              cellphoneCli: this.state.cellphoneC,
              foundClient: this.state.foundClient,
              //DATOS DEL STEP 2
              nameRec: this.props.location.state.shipment["nameRec"],
              lastnameRec: this.props.location.state.shipment["lastnameRec"],
              documentRec: this.props.location.state.shipment["documentRec"],
              destCountry: this.props.location.state.shipment["destCountry"],
              destCity: this.props.location.state.shipment["destCity"],
              destAirport: this.props.location.state.shipment["destAirport"],
              //DATOS DEL STEP 3
              length: this.props.location.state.shipment["length"],
              width: this.props.location.state.shipment["width"],
              height: this.props.location.state.shipment["height"],
              weight: this.props.location.state.shipment["weight"],
              status: this.props.location.state.shipment["status"],
              fragile:this.props.location.state.shipment["fragile"],
              description: this.props.location.state.shipment["description"],
            }
          },
        });
      }
      else{
        this.props.history.push({
          pathname: "/admin/addShipmentStep2",
          state: {
            countries: this.state.countries,
            shipment: {
              codCli: this.state.idC,
              documentCli: this.state.documentC,
              nameCli:this.state.nameC ,
              lastnameCli: this.state.lastnameC ,
              emailCli: this.state.emailC ,
              cellphoneCli: this.state.cellphoneC,
              foundClient: this.state.foundClient,
            }
          },
        });

      }
    }
    else {
      //Uno o más de los datos están incompletos
      let alertMessage = <Alert color="primary" >Los datos están incompletos</Alert>;
      this.setState({messageValidation:alertMessage});
    }
    
  };

  handleChangeDocumentC = (event) => {
    this.setState({
      documentC: event.target.value,
      messageValidation: [],
      shipment: {
        documentCli: event.target.value,
        codCli: this.state.shipment.codCli,
        nameCli: this.state.shipment.nameCli,
        lastnameCli: this.state.shipment.lastnameCli,
        emailCli: this.state.shipment.emailCli,
        cellphoneCli: this.state.shipment.cellphoneCli,
        foundClient: this.state.foundClient,
      },
    });
    //console.log(this.state.shipment);
  };
  handleChangeIdC = (event) => {
    this.setState({
      idC: event.target.value,
      shipment: {
        codCli: event.target.value,
        documentCli: this.state.shipment.documentCli,
        nameCli: this.state.shipment.nameCli,
        lastnameCli: this.state.shipment.lastnameCli,
        emailCli: this.state.shipment.emailCli,
        cellphoneCli: this.state.shipment.cellphoneCli,
        foundClient: this.state.foundClient,
      },
    });
    //console.log(this.state.shipment);
  };
  handleChangeNameC = (event) => {
    this.setState({
      nameC: event.target.value,
      messageValidation: [],
      shipment: {
        nameCli: event.target.value,
        codCli: this.state.shipment.codCli,
        documentCli: this.state.shipment.documentCli,
        lastnameCli: this.state.shipment.lastnameCli,
        emailCli: this.state.shipment.emailCli,
        cellphoneCli: this.state.shipment.cellphoneCli,
        foundClient: this.state.foundClient,
      },
    });
    //console.log(this.state.shipment);
  };
  handleChangeLastnameC = (event) => {
    this.setState({
      lastnameC: event.target.value,
      messageValidation: [],
      shipment: {
        lastnameCli: event.target.value,
        nameCli: this.state.shipment.nameCli,
        codCli: this.state.shipment.codCli,
        documentCli: this.state.shipment.documentCli,
        emailCli: this.state.shipment.emailCli,
        cellphoneCli: this.state.shipment.cellphoneCli,
        foundClient: this.state.foundClient,
      },
    });
    //console.log(this.state.shipment);
  };
  handleChangeEmailC = (event) => {
    this.setState({
      emailC: event.target.value,
      messageValidation: [],
      shipment: {
        emailCli: event.target.value,
        lastnameCli: this.state.shipment.lastnameCli,
        nameCli: this.state.shipment.nameCli,
        codCli: this.state.shipment.codCli,
        documentCli: this.state.shipment.documentCli,
        cellphoneCli: this.state.shipment.cellphoneCli,
        foundClient: this.state.foundClient,
      },
    });
   // console.log(this.state.shipment);
  };
  handleChangeCellphoneC = (event) => {
    this.setState({
      cellphoneC: event.target.value,
      messageValidation: [],
      shipment: {
        cellphoneCli: event.target.value,
        emailCli: this.state.shipment.emailCli,
        lastnameCli: this.state.shipment.lastnameCli,
        nameCli: this.state.shipment.nameCli,
        codCli: this.state.shipment.codCli,
        documentCli: this.state.shipment.documentCli,
        foundClient: this.state.foundClient,
      },
    });
    //console.log(this.state.shipment);
  };

  findClientByDocument = async () => {
    const clientService = new APIClient();

    const InformationCLient = await clientService.findClientByDocument(
      this.state.documentC
    );
    const message = InformationCLient["estado"];
    //mensaje es ERROR(longitud=5) o OK(longitud=2)

    if (InformationCLient["estado"].length > 3) {
      //ERROR, no se encontró cliente
      this.setState({
        
        idC: 0,
        nameC: "",
        lastnameC: "",
        emailC: "",
        cellphoneC: "",
        foundClient: false,
        infoActive: true,
        shipment: {
          cellphoneCli: this.state.shipment.cellphoneCli,
          emailCli: this.state.shipment.emailCli,
          lastnameCli: this.state.shipment.lastnameCli,
          nameCli: this.state.shipment.nameCli,
          codCli: this.state.shipment.codCli,
          documentCli: this.state.shipment.documentCli,
          foundClient: false,
        },
      });
    } else {
      //OK, se encontró cliente
      this.setState({
        documentC: InformationCLient["resultado"]["document"],
        idC: InformationCLient["resultado"]["id"],
        nameC: InformationCLient["resultado"]["name"],
        lastnameC: InformationCLient["resultado"]["lastname"],
        emailC: InformationCLient["resultado"]["email"],
        cellphoneC: InformationCLient["resultado"]["cellphone"],
        foundClient: true,
        infoActive: false,
        shipment: {
          codCli: InformationCLient["resultado"]["id"],
          documentCli: InformationCLient["resultado"]["document"],
          nameCli: InformationCLient["resultado"]["name"],
          lastnameCli: InformationCLient["resultado"]["lastname"],
          emailCli: InformationCLient["resultado"]["email"],
          cellphoneCli: InformationCLient["resultado"]["cellphone"],
          foundClient: true,
        },
      });
    }
  };
  componentWillMount=()=>{
    if (this.props.location.state!=undefined ){
      
      this.setState({
        documentC: this.props.location.state.shipment["documentCli"],
        idC: this.props.location.state.shipment["codCli"],
        nameC: this.props.location.state.shipment["nameCli"],
        lastnameC: this.props.location.state.shipment["lastnameCli"],
        emailC: this.props.location.state.shipment["emailCli"],
        cellphoneC: this.props.location.state.shipment["cellphoneCli"],
        shipment: {
          codCli: this.props.location.state.shipment["codCli"],
          documentCli:  this.props.location.state.shipment["documentCli"],
          nameCli: this.props.location.state.shipment["nameCli"],
          lastnameCli:  this.props.location.state.shipment["lastnameCli"],
          emailCli: this.props.location.state.shipment["emailCli"],
          cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
          foundClient: this.props.location.state.shipment["foundClient"],


        },
      })
    }

  }

  render() {
    let messageFoundClient = [];
    if (this.state.foundClient) {
      messageFoundClient = [];
    } else {
      messageFoundClient = <Alert color="primary">Ingresar datos del cliente</Alert>;
    }
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Card className="bg-secondary shadow" style={{ width: "80rem" }}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="10" className="col-sm">
                    <h3 className="mb-0">1) Información Cliente </h3>
                  </Col>
                  <Col xs="8" className="col-sm">
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-center mb-0"
                        listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem className="active">
                          <PaginationLink>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
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
                      
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-idClient"
                          >
                            Código de cliente
                          </label>
                          <Input
                            disabled
                            className="form-control-alternative"
                            id="input-idClient"
                            placeholder="Código cliente"
                            type="text"
                            value={this.state.idC}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-document"
                          >
                            Número de documento
                          </label>
                          <InputGroup className="mb-4">
                            <Input
                              placeholder="Buscar"
                              type="text"
                              value={this.state.documentC}
                              onChange={(ev) => {
                                this.handleChangeDocumentC(ev);
                              }}
                            />
                            <InputGroupAddon addonType="prepend">
                              <Button
                                className="btn-icon btn-2"
                                color="primary"
                                outline
                                type="button"
                                onClick={this.findClientByDocument}
                              >
                                <span className="btn-inner--icon">
                                  <i className="ni ni-zoom-split-in" />
                                </span>
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Nombre
                          </label>

                          <Input
                            disabled={!this.state.infoActive}
                            className="form-control-alternative"
                            value={this.state.nameC}
                            id="input-first-name"
                            placeholder="Nombre"
                            type="text"
                            onChange={(ev) => {
                              this.handleChangeNameC(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Apellidos
                          </label>
                          <Input
                            disabled={!this.state.infoActive}
                            className="form-control-alternative"
                            value={this.state.lastnameC}
                            id="input-last-name"
                            placeholder="Apellidos"
                            type="text"
                            onChange={(ev) => {
                              this.handleChangeLastnameC(ev);
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
                            htmlFor="input-email"
                          >
                            Correo electrónico
                          </label>
                          <Input
                            disabled={!this.state.infoActive}
                            className="form-control-alternative"
                            value={this.state.emailC}
                            id="input-email"
                            placeholder="Correo Electrónico"
                            type="email"
                            name="email"
                            onChange={(ev) => {
                              this.handleChangeEmailC(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-number"
                          >
                            Número telefónico
                          </label>
                          <Input
                            disabled={!this.state.infoActive}
                            className="form-control-alternative"
                            value={this.state.cellphoneC}
                            id="input-number"
                            placeholder="Número telefónico"
                            type="text"
                            onChange={(ev) => {
                              this.handleChangeCellphoneC(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      {messageFoundClient}
                    </Row>
                    <Row>
                      {this.state.messageValidation}
                    </Row>
                  </div>
                </Form>
                <Row>
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
export default ShipmentStep1;
