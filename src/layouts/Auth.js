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

import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

class Auth extends React.Component {
	componentDidMount() {
		document.body.style.backgroundColor = "#8395b2";
	}
	getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === "/auth") {
				return (
					<Route
						path={prop.layout + prop.path}
						component={prop.component}
						key={key}
					/>
				);
			} else {
				return null;
			}
		});
	};
	render() {
		return (
			<>
				<div className="main-content" style={{backgroundColor: "#8395b2"}}>
					<AuthNavbar />
					<div
						className="header py-7"
						style={{ backgroundColor: "#0b1d3a", padding: "5.5rem" }}>
						<Container>
							<div className="header-body text-center mb-7">
								<Row className="justify-content-center">
									<Col lg="5" md="6">
										{/*<h1 className="text-white">RedEx </h1>  */}
										<img
											alt="..."
											height="100px"
											width="100px"
											src={require("assets/img/brand/logoRedex2.png")}
										/>
									</Col>
								</Row>
							</div>
						</Container>
						<div className="separator separator-bottom separator-skew zindex-100">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="none"
								version="1.1"
								viewBox="0 0 2560 100"
								x="0"
								y="0">
								<polygon
									//class="fill-default"
									style={{ fill: "#8395b2" }}
									points="2560 0 2560 100 0 100"
								/>
							</svg>
						</div>
					</div>
					{/* Page content */}
					<Container className="mt--8">
						<Row className="justify-content-center">
							<Switch>
								{this.getRoutes(routes)}
								<Redirect from="*" to="/auth/login" />
							</Switch>
						</Row>
					</Container>
				</div>
				<AuthFooter />
			</>
		);
	}
}

export default Auth;
