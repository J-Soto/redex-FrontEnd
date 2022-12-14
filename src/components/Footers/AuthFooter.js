/**
 * /*!
 *
 * =========================================================
 * Argon Dashboard React - v1.1.0
 * =========================================================
 *
 * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
 * Copyright 2019 Creative Tim (https://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)
 *
 * Coded by Creative Tim
 *
 * =========================================================
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * @format
 */

/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
	render() {
		return (
			<>
				<footer style={{backgroundColor: "#8395b2", padding: "1.5rem",}}>
					<Container>
						<Row className="align-items-center justify-content-xl-between">
							<Col xl="6">
								<div className="copyright text-center text-xl-left" style={{ color: "#525f7f" }}>
									© 2022 <a className="font-weight-bold ml-1">RedEx</a>
								</div>
							</Col>
						</Row>
					</Container>
				</footer>
			</>
		);
	}
}

export default Login;
