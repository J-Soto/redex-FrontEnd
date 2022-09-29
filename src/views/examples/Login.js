/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
//apis
import APIUser from "./../../apis/APIUser.js";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: "",
      succes: true,
    };
    this.enterToAdmin = this.enterToAdmin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
  }
  handleChangeUser = (event) => {
    this.setState({
      user: event.target.value,
    });
  };
  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  enterToAdmin = async () => {
    const userService = new APIUser();
    const loginConfirmation = await userService.login(
      this.state.user,
      this.state.password
    );
    if (loginConfirmation["estado"].length < 3) {
      //usuario y contraseña correctos
      console.log(loginConfirmation["resultado"]);
      const information = loginConfirmation["resultado"];
      sessionStorage.setItem(
        "nameAirport",
        information["warehouse"]["airport"]["description"]
      );
      sessionStorage.setItem(
        "cityAirport",
        information["warehouse"]["airport"]["city"]["name"]
      );
      sessionStorage.setItem(
        "countryAirport",
        information["warehouse"]["airport"]["city"]["country"]["name"]
      );
      sessionStorage.setItem(
        "idCityAirport",
        information["warehouse"]["airport"]["city"]["id"]
      );
      sessionStorage.setItem(
        "idCountryAirport",
        information["warehouse"]["airport"]["city"]["country"]["id"]
      );
      sessionStorage.setItem("username", information["username"]);
      sessionStorage.setItem(
        "idAirport",
        information["warehouse"]["airport"]["id"]
      );
      sessionStorage.setItem(
        "codeAirport",
        information["warehouse"]["airport"]["code"]
      );
      sessionStorage.setItem(
        "longitudeAirport",
        information["warehouse"]["airport"]["longitude"]
      );
      sessionStorage.setItem(
        "latitudeAirport",
        information["warehouse"]["airport"]["latitude"]
      );
      sessionStorage.setItem(
        "descriptionAirport",
        information["warehouse"]["airport"]["description"]
      );
      sessionStorage.setItem("roleUser", information["roles"][0]["id"]);
      //console.log(information["roles"][0]["id"]);

      this.props.history.push({
        pathname: "/admin/index",
      });
    } else {
      //datos incorrectos
      this.setState({
        user: "",
        password: "",
        succes: false,
      });
    }
  };

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>¡Bienvenido! Por favor inicie sesión.</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02 " />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Usuario"
                      type="text"
                      value={this.state.user}
                      onChange={this.handleChangeUser}
                      autoComplete="on"
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Contraseña"
                      type="password"
                      autoComplete="on"
                      value={this.state.password}
                      onChange={this.handleChangePassword}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Alert color="danger" isOpen={!this.state.succes}>
                    Los datos registrados son incorrectos
                  </Alert>
                </div>

                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="button"
                    onClick={this.enterToAdmin}
                  >
                    Entrar
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3 justify-content-center">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              {/* <small>¿Olvidó su contraseña?</small>*/}
            </a>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
