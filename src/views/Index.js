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
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	NavItem,
	NavLink,
	Nav,
	Progress,
	Table,
	Container,
	Row,
	Col,
} from "reactstrap";

// core components
import {
	chartOptions,
	parseOptions,
	chartExample1,
	chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNav: 1,
			chartExample1Data: "data1",
		};
		if (window.Chart) {
			parseOptions(Chart, chartOptions());
		}
	}
	toggleNavs = (e, index) => {
		e.preventDefault();
		this.setState({
			activeNav: index,
			chartExample1Data:
				this.state.chartExample1Data === "data1" ? "data2" : "data1",
		});
	};
	render() {
		const nameAirport = sessionStorage.getItem("nameAirport");
		const city = sessionStorage.getItem("cityAirport");
		const country = sessionStorage.getItem("countryAirport");
		return (
			<>
				{/* Contenido de la página principal - Bienvenido */}
				<Header />
				<Container>
					<div className="text-center" >
						<h1 style={{ color: "#001d55", fontSize: "30px" , fontWeight: "900" }}>Bienvenido a RedEx </h1>
						<br />
						{/*{this.props.location.state.infoSession["warehouse"]["airport"]["description"]} */}
						<h1 style={{ color: "#001d55", fontWeight: "500" }}>
							{nameAirport}, {city}, {country}{" "}
						</h1>
					</div>
				</Container>
			</>
		);
	}
}

export default Index;
