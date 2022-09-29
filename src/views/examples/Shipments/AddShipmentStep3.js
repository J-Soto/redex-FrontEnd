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
import APICountry from "./../../../apis/APICountry";

class ShipmentStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      status: "OK",
      fragile: 2,
      description: "",
      messageValidation: [],
      /*shipment: {
        //DATOS DEL STEP 1
        codCli: this.props.location.state.shipment["codCli"],
        documentCli: this.props.location.state.shipment["documentCli"],
        nameCli: this.props.location.state.shipment["nameCli"],
        lastnameCli: this.props.location.state.shipment["lastnameCli"],
        emailCli: this.props.location.state.shipment["emailCli"],
        cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
        //DATOS DEL STEP 2
        nameRec: this.props.location.state.shipment["nameRec"],
        lastnameRec: this.props.location.state.shipment["lastnameRec"],
        documentRec: this.props.location.state.shipment["documentRec"],
        destCountry: this.props.location.state.shipment["destCountry"],
        destCity: this.props.location.state.shipment["destCity"],
        //DATOS DEL STEP 3
        lenght: 0,
        width: 0,
        height: 0,
        weight: 0,
        status: "OK",
        fragile: 2,
        description: "",
      },*/
    };
    this.closeNewShipment = this.closeNewShipment.bind(this);
    this.goNextStep = this.goNextStep.bind(this);
    this.returnPreviousStep = this.returnPreviousStep.bind(this);
    this.handleChangeWidth = this.handleChangeWidth.bind(this);
    this.handleChangeLenght = this.handleChangeLenght.bind(this);
    this.handleChangeHeight = this.handleChangeHeight.bind(this);
    this.handleChangeWeight = this.handleChangeWeight.bind(this);
    this.handleChangeFragile = this.handleChangeFragile.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  handleChangeLenght = (event) => {
    this.setState({
      messageValidation: [],
      length: event.target.value,
    });
    console.log(this.props);
  };
  handleChangeWidth = (event) => {
    this.setState({
      messageValidation: [],
      width: event.target.value,
    });
  };
  handleChangeHeight = (event) => {
    this.setState({
      messageValidation: [],
      height: event.target.value,
    });
  };
  handleChangeWeight = (event) => {
    this.setState({
      messageValidation: [],
      weight: event.target.value,
    });
  };
  handleChangeFragile = (event) => {
    //1 = frágil 2 = no frágil
    this.setState({
      messageValidation: [],
      fragile: event.target.value,
    });
  };
  handleChangeDescription = (event) => {
    this.setState({
      messageValidation: [],
      description: event.target.value,
    });
  };

  closeNewShipment = () => {
    this.props.history.push({
      pathname: "/admin/shipments",
    });
  };
  goNextStep = () => {
    //console.log(this.props.location.state.shipment["destAirport"]);
    if (
      this.state.weight > 0 &&
      this.state.width > 0 &&
      this.state.height > 0 &&
      this.state.length > 0 &&
      this.state.description.length > 0
    ) {
      this.props.history.push({
        pathname: "/admin/addShipmentStep4",
        state: {
          //DATOS DEL STEP 1
          codCli: this.props.location.state.shipment["codCli"],
          documentCli: this.props.location.state.shipment["documentCli"],
          nameCli: this.props.location.state.shipment["nameCli"],
          lastnameCli: this.props.location.state.shipment["lastnameCli"],
          emailCli: this.props.location.state.shipment["emailCli"],
          cellphoneCli: this.props.location.state.shipment["cellphoneCli"],
          foundClient: this.props.location.state.shipment["foundClient"],
          //DATOS DEL STEP 2
          nameRec: this.props.location.state.shipment["nameRec"],
          lastnameRec: this.props.location.state.shipment["lastnameRec"],
          documentRec: this.props.location.state.shipment["documentRec"],
          destCountry: this.props.location.state.shipment["destCountry"],
          destCity: this.props.location.state.shipment["destCity"],
          destAirport: this.props.location.state.shipment["destAirport"],
          //DATOS DEL STEP 3
          length: this.state.length,
          width: this.state.width,
          height: this.state.height,
          weight: this.state.weight,
          status: this.state.status,
          fragile: this.state.fragile,
          description: this.state.description,
        },
      });
    } else {
      //Los datos son menores o igual a 0 o la descripción está vacía
      let alertMessage = (
        <Alert color="primary">
          Uno de los datos es menor que 0 o la descripción está vacía
        </Alert>
      );
      this.setState({ messageValidation: alertMessage });
    }
    console.log( this.props.location.state.shipment["destAirport"]);

  };
  returnPreviousStep = async () => {
    const countriesService = new APICountry();
    //let countries2 = []
    const countries = await countriesService.queryAllCountries();
    //this.setState({ countries: countries });
    //this.state.countries = countries;
    //console.log(countries);
    if (this.state.weight ==0){
      this.props.history.push({
        pathname: "/admin/addShipmentStep2",
        state: {
          countries: countries,
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
            nameRec: this.props.location.state.shipment["nameRec"],
            lastnameRec: this.props.location.state.shipment["lastnameRec"],
            documentRec: this.props.location.state.shipment["documentRec"],
            destCountry: this.props.location.state.shipment["destCountry"],
            destCity: this.props.location.state.shipment["destCity"],
            destAirport: this.props.location.state.shipment["destAirport"],           
  
          },
        },
      });

    }
    else{
      this.props.history.push({
        pathname: "/admin/addShipmentStep2",
        state: {
          countries: countries,
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
            nameRec: this.props.location.state.shipment["nameRec"],
            lastnameRec: this.props.location.state.shipment["lastnameRec"],
            documentRec: this.props.location.state.shipment["documentRec"],
            destCountry: this.props.location.state.shipment["destCountry"],
            destCity: this.props.location.state.shipment["destCity"],
            destAirport: this.props.location.state.shipment["destAirport"],
            //DATOS DEL STEP 3
            length: this.state.length,
            width: this.state.width,
            height: this.state.height,
            weight: this.state.weight,
            status: this.state.status,
            fragile:this.state.fragile,
            description: this.state.description,
  
          },
        },
      });

    }
    
  };
  componentWillMount = ()=>{
    if (this.props.location.state!=undefined && this.props.location.state.shipment["length"]!=undefined){
      
      this.setState({
        length: this.props.location.state.shipment["length"],
        width: this.props.location.state.shipment["width"],
        height: this.props.location.state.shipment["height"],
        weight: this.props.location.state.shipment["weight"],
        status: this.props.location.state.shipment["status"],
        fragile: this.props.location.state.shipment["fragile"],
        description: this.props.location.state.shipment["description"],
        
      })
    
    
    }
  }
  render() {
    //console.log(this.props.state.shipment);
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Card className="bg-secondary shadow" style={{ width: "80rem" }}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="10" className="col-sm">
                    <h3 className="mb-0">3) Detalles del paquete </h3>
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
                        <PaginationItem className="active">
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
                            htmlFor="input-lenght"
                          >
                            Largo (cm)
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.length}
                            id="input-lenght"
                            placeholder="Largo"
                            type="number"
                            onChange={this.handleChangeLenght}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-width"
                          >
                            Ancho (cm)
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.width}
                            id="input-width"
                            placeholder="Ancho"
                            type="number"
                            onChange={this.handleChangeWidth}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-height"
                          >
                            Altura (cm)
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.height}
                            id="input-height"
                            placeholder="Altura"
                            type="number"
                            onChange={this.handleChangeHeight}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-weight"
                          >
                            Peso (kg)
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.weight}
                            id="input-weight"
                            placeholder="Peso"
                            type="number"
                            onChange={this.handleChangeWeight}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-status"
                          >
                            Estado
                          </label>
                          <Input
                            disabled
                            className="form-control-alternative"
                            id="input-status"
                            defaultValue="Ok"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <label
                          className="form-control-label"
                          htmlFor="input-fragile"
                        >
                          Frágil
                        </label>
                        <div>
                          <div className="custom-control custom-radio mb-3">
                            <input
                              className="custom-control-input"
                              id="customRadioOp1"
                              name="custom-radio-2"
                              type="radio"
                              value={1}
                              onChange={this.handleChangeFragile}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customRadioOp1"
                            >
                              Sí
                            </label>
                          </div>
                          <div className="custom-control custom-radio mb-3">
                            <input
                              className="custom-control-input"
                              defaultChecked
                              id="customRadioOp2"
                              name="custom-radio-2"
                              type="radio"
                              value={2}
                              onChange={this.handleChangeFragile}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customRadioOp2"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-description"
                          >
                            Descripción
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-description"
                            placeholder="Descripción del producto"
                            type="textarea"
                            rows="3"
                            value={this.state.description}
                            onChange={this.handleChangeDescription}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
                <Row>{this.state.messageValidation}</Row>
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
                      onClick={this.goNextStep}
                    >
                      <span className="btn-inner--text">Siguiente</span>
                      <span className="btn-inner--icon">
                        <i className="ni ni-bold-right" />
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
export default ShipmentStep3;
