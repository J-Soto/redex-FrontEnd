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
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import ErrorBoundary from "../views/examples/errorBoundary";

import routes from "routes.js";

class Admin extends React.Component {
  state = {
    roleUser: 0,
    routesSB: [],
  };
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (
        prop.layout === "/admin" /*&& (prop.role===0 || prop.role===roleUser)*/
      ) {
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
  getBrandText = (path) => {
    for (let i = 0; i < this.state.routesSB.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          this.state.routesSB[i].layout + this.state.routesSB[i].path
        ) !== -1
      ) {
        return this.state.routesSB[i].name;
      }
    }
    return "Brand";
  };
  componentWillMount = () => {
    var roleUser = parseInt(sessionStorage.getItem("roleUser"), 10);
    var routesSB = [];
    routes.map((route) => {
      if (route.role == 0 || route.role == roleUser) routesSB.push(route);
    });

    this.setState({
      roleUser: roleUser,
      routesSB: routesSB,
    });
  };

  render() {
    //console.log(this.state.roleUser,this.state.routesSB);
    return (
      <>
        <Sidebar
          {...this.props}
          routes={this.state.routesSB}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/logoRedExTraceTools.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(this.state.routesSB)}
            <Redirect from="*" to="/admin/index" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
