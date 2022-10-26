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
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";

// reactstrap components
import { Card, Container, Row } from "reactstrap";


// mapTypeId={google.maps.MapTypeId.ROADMAP}
const MapWrapper = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
    >
      {this.state.progress && (
            <>
                <Polyline
                path={this.state.progress}
                options={{ strokeColor: "#FF0000 " }}
                />
                <Marker
                position={this.state.progress[this.state.progress.length - 1]}
                />
            </>
            )}
    </GoogleMap>
  ))
);

class Maps extends React.Component {

  state = {
    progress: []
  };

  path = [
    { lat: 18.558908, lng: -68.389916 },
    { lat: 18.558853, lng: -68.389922 },
    { lat: 18.558375, lng: -68.389729 },
    { lat: 18.558032, lng: -68.389182 },
    { lat: 18.55805, lng: -68.388613 },
    { lat: 18.558256, lng: -68.388213 },
    { lat: 18.558744, lng: -68.387929 }
  ];

  velocity = 10;
  initialDate = new Date();

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000; // pass to seconds
    return differentInTime * this.velocity; // d = v*t -- thanks Newton!
  };

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000);
  };

  componentWillUnmount = () => {
    window.clearInterval(this.interval);
  };

  moveObject = () => {
    const distance = this.getDistance();
    if (!distance) {
      return;
    }
    const progress = this.path.filter(
      coordinates => coordinates.distance < distance
    );
    this.setState({ progress });
  };

  componentWillMount = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 }; // it begins here!
      }
      const { lat: lat1, lng: lng1 } = coordinates;
      const latLong1 = new window.google.maps.LatLng(lat1, lng1);

      const { lat: lat2, lng: lng2 } = array[0];
      const latLong2 = new window.google.maps.LatLng(lat2, lng2);

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      );

      return { ...coordinates, distance };
    });

    console.log(this.path);
  };


  render() {
    return (
      <>
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow border-0">
                <MapWrapper
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCCqt86Lysv0xy9Y3yni3TZkhCNYDVr0UI"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={
                    <div
                      style={{ height: `600px` }}
                      className="map-canvas"
                      id="map-canvas"
                    />
                  }
                  mapElement={
                    <div style={{ height: `100%`, borderRadius: "inherit" }} />
                  }
                />
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Maps;
