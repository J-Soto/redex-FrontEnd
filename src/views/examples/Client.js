import React from "react";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroupAddon,
  Input,
  InputGroup,
  CardBody,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
// apis
import APIClient from "./../../apis/APIClient.js";
class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentSearch:'',
      documentC: '',
      idC: 0,
      nameC: '',
      lastnameC: '',
      emailC: '',
      cellphoneC: '',
      foundClient: true,
      infoActive:false,
      alertMessage: [],
      searchingClient: true,
    };
    this.findClientByDocument = this.findClientByDocument.bind(this);
    this.saveInfoClient = this.saveInfoClient.bind(this);
    this.handleChangeDocumentSearch = this.handleChangeDocumentSearch.bind(this);
    this.handleChangeIdC = this.handleChangeIdC.bind(this);
    this.handleChangeDocumentC = this.handleChangeDocumentC.bind(this);
    this.handleChangeNameC = this.handleChangeNameC.bind(this);
    this.handleChangeLastnameC = this.handleChangeLastnameC.bind(this);
    this.handleChangeEmailC = this.handleChangeEmailC.bind(this);
    this.handleChangeCellphoneC = this.handleChangeCellphoneC.bind(this);
  }
  handleChangeDocumentSearch = (event)=>{
    this.setState({
      documentSearch: event.target.value,
    });
  }
  handleChangeDocumentC = (event) => {
    this.setState({
      documentC: event.target.value,
    });
  };
  handleChangeIdC = (event) => {
    this.setState({
      idC: event.target.value,
    });
  };
  handleChangeNameC = (event) => {
    this.setState({
      nameC: event.target.value,
    });
  };
  handleChangeLastnameC = (event) => {
    this.setState({
      lastnameC: event.target.value,
    });
  };
  handleChangeEmailC = (event) => {
    this.setState({
      emailC: event.target.value,
    });
  };
  handleChangeCellphoneC = (event) => {
    this.setState({
      cellphoneC: event.target.value,
    });
  };

  findClientByDocument = async () => {
    const clientService = new APIClient();
    
    const InformationClient = await clientService.findClientByDocument(this.state.documentSearch);
    const message = InformationClient["estado"];
    //mensaje es ERROR(longitud=5) o OK(longitud=2)
   
    if (InformationClient["estado"].length > 3) {
      //ERROR, no se encontró cliente
      this.setState({
        documentSearch:'',
        documentC: '',
        idC: 0,
        nameC: '',
        lastnameC: '',
        emailC: '',
        cellphoneC: '',
        foundClient: false,
        infoActive: false,
        searchingClient:true,
        
      });     
    } else {
      //OK, se encontró cliente
      this.setState({
        documentSearch:'',
        documentC: InformationClient["resultado"]["document"],
        idC: InformationClient["resultado"]["id"],
        nameC: InformationClient["resultado"]["name"],
        lastnameC: InformationClient["resultado"]["lastname"],
        emailC: InformationClient["resultado"]["email"],
        cellphoneC: InformationClient["resultado"]["cellphone"],
        foundClient: true,
        infoActive: true,
        searchingClient:true,
      });
    }
  };

  saveInfoClient = async() => {
    //editar información de los clientes
    const registerDate = new Date();

    const clientService = new APIClient();    
    const InformationClient = await clientService.editClient(this.state.idC,this.state.documentC,this.state.nameC,
                              this.state.lastnameC,this.state.emailC,this.state.cellphoneC, registerDate);
    const message = InformationClient["estado"];
    let alertMessage=[];
    if (message.length<3){
      //El cliente se guardó de manera satisfactoria 
      alertMessage = <Alert fade color="success">La información del cliente se guardó satisfactoriamente</Alert>;
    }
    else{
      //El cliente no se guardó de manera satisfactoria 
      alertMessage = <Alert fade color="primary">La información del cliente no se guardó</Alert>;
    }
    this.setState({
      searchingClient:false,
      alertMessage:alertMessage});
    
  };
  


  render() {
    let messageFoundClient = '';
    if (this.state.foundClient){
      messageFoundClient = ''
    }
    else {
      messageFoundClient = 'El cliente no se encuentra registrado'
    }
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {/* Client Information */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Clientes</h3>
                    </Col>
                    <Col>
                      <Form>
                        <FormGroup>
                          <InputGroup className="mb-4">
                            <Input
                                placeholder="Buscar por documento"
                                type="text"
                                value={this.state.documentSearch}
                                onChange={(ev) => {
                                  this.handleChangeDocumentSearch(ev);
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
                      </Form>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        className="btn-icon btn-3"
                        color="primary"
                        type="button"
                        onClick={this.saveInfoClient}                        
                      >
                        <span className="btn-inner--icon">
                          <i className="far fa-save" />
                        </span>
                        <span className="btn-inner--text">Guardar</span>
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
                          <Input 
                              disabled = {!this.state.infoActive}
                              className="form-control-alternative"
                              placeholder="Número de documento" 
                              id="input-document"
                              type="text"
                              value={this.state.documentC}
                              onChange ={(ev) => {
                                this.handleChangeDocumentC(ev);
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
                            htmlFor="input-first-name"
                          >
                            Nombre
                          </label>
                          <Input
                            disabled = {!this.state.infoActive}
                            className="form-control-alternative"                            
                            id="input-first-name"
                            placeholder="Nombre"
                            type="text"
                            value ={this.state.nameC}
                            onChange ={(ev) => {
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
                            disabled = {!this.state.infoActive}
                            className="form-control-alternative"                            
                            id="input-last-name"
                            placeholder="Apellidos"
                            type="text"
                            value ={this.state.lastnameC}
                            onChange ={(ev) => {
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
                            disabled = {!this.state.infoActive}
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Correo Electrónico"
                            type="email"
                            value ={this.state.emailC}
                            onChange ={(ev) => {
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
                            disabled = {!this.state.infoActive}
                            className="form-control-alternative"                            
                            id="input-number"
                            placeholder="Número telefónico"
                            type="text"
                            value ={this.state.cellphoneC}
                            onChange ={(ev) => {
                              this.handleChangeCellphoneC(ev);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <h4 style={{color:"#87d7c0"}}>
                      {messageFoundClient}
                      </h4>
                    </Row> 
                    {this.state.searchingClient?'':
                    <Row>
                      {this.state.alertMessage}
                    </Row>   
                    }
                  </div>
                </Form>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}
export default Client;