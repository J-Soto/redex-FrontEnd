import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";

import { render } from "react-dom";
import DefaultMessage from "./errorDefault";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("hubo error");
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    console.log("hubo error");
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  render() {
    //console.log("hubo error");
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <DefaultMessage></DefaultMessage>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
