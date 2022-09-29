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
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,  
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.signOff = this.signOff.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }

  signOff = () => {
    sessionStorage.clear();
    /*sessionStorage.removeItem("nameAirport");
    sessionStorage.removeItem("cityAirport");
    sessionStorage.removeItem("countryAirport");
    sessionStorage.removeItem("idCityAirport");
    sessionStorage.removeItem("idCountryAirport");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("idAirport");
    sessionStorage.removeItem("codeAirport");
    sessionStorage.removeItem("longitudeAirport");
    sessionStorage.removeItem("latitudeAirport");
    sessionStorage.removeItem("descriptionAirport");
    sessionStorage.removeItem("longitudeAirport");
    sessionStorage.removeItem("roleUser");*/
    this.props.history.push({
      pathname: "/auth/login",
    });
  };

  goToProfile = ()=>{
    this.props.history.push({
      pathname: "/admin/users",
    });
  }
  render() {
    const username = sessionStorage.getItem('username');
    const nameAirport = sessionStorage.getItem('nameAirport');
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/admin/index"
            >
              {nameAirport}
            </Link>            
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <i
                        className="ni ni-circle-08 "
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {username}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">¡Bienvenido!</h6>
                  </DropdownItem>
                  {/*<DropdownItem onClick={this.goToProfile}>
                    <i className="ni ni-single-02" />
                    <span>Mi perfil</span>
                  </DropdownItem>*/}
                  <DropdownItem divider />
                  <DropdownItem  onClick={this.signOff}>
                    <i className="ni ni-user-run" />
                    <span>Cerrar sesión</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
