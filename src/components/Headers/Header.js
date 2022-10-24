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
import {  Container, Row, Col } from "reactstrap";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="header pb-8 pt-5 pt-md-8" style={{background:"#8395b2"}}>
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>                
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default Header;
