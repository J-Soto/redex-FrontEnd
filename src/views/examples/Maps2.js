import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";

import { PropTypes } from "prop-types";
class SimuMaps extends React.Component {
  
  constructor(props) {
    super(props);
    this.getPaths.bind(this);
    this.getDistance.bind(this);
    console.log("Prueba 1: ");  
    console.log(this.props.simu);

    console.log("Prueba 2: ");  
    console.log(this.props.simu2);
  }



  state = {
    progress: []
  };

  getPaths = (simu) =>{
    // console.log(simu);
    // return simu.map((vuelo) => {
    //   console.log(vuelo);
    // })
  }

  path = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -12.016421992573788, lng: -77.00842086314432 }
  ];


  velocity = 100000;
  initialDate = new Date();

  getDistance = () => {
    const differentInTime = (new Date() - this.initialDate) / 1000;
    return differentInTime * this.velocity;
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

    let progress = this.path.filter(
      coordinates => coordinates.distance < distance
    );

    const nextLine = this.path.find(
      coordinates => coordinates.distance > distance
    );
    if (!nextLine) {
      this.setState({ progress });
      return; // it's the end!
    }
    const lastLine = progress[progress.length - 1];

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    );

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    // distance of this line
    const totalDistance = nextLine.distance - lastLine.distance;
    const percentage = (distance - lastLine.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    progress = progress.concat(position);
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
  };

  componentDidUpdate = () => {
    const distance = this.getDistance();
    if (!distance) {
      return;
    }

    let progress = this.path.filter(
      coordinates => coordinates.distance < distance
    );

    const nextLine = this.path.find(
      coordinates => coordinates.distance > distance
    );

    let point1, point2;

    if (nextLine) {
      point1 = progress[progress.length - 1];
      point2 = nextLine;
    } else {
      // it's the end, so use the latest 2
      point1 = progress[progress.length - 2];
      point2 = progress[progress.length - 1];
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

    const angle = window.google.maps.geometry.spherical.computeHeading(
      point1LatLng,
      point2LatLng
    );
    const actualAngle = angle - 90;

    const markerUrl = (require('./../../assets/img/icons/common/plane-icon.svg'));
    const marker = document.querySelector(`[src="${markerUrl}"]`);

    if (marker) {
      // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`;
    }
  };
  
  render() {

    const {simu, simu2} = this.props;
 
    const options = {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    }

    const icon = {
        url: (require('./../../assets/img/icons/common/plane-icon.svg')),
        scaledSize: new window.google.maps.Size(20, 20),
        anchor: { x: 10, y: 10 }
    }

 

    return (
      <>
        {/* <p>Welcome, {this.props.simu}</p> */}
          
        <GoogleMap
          defaultZoom={2}
          defaultCenter={{ lat: 0, lng: 0 }}
        >
          
          {/* {this.getPaths(simu2)} */}
          

          {this.state.progress && (
            <>
              <Polyline
                  path={this.state.progress}
                  options={{ strokeColor: "#000000 ", geodesic: true  }}
              />
              <Marker
                  position={this.state.progress[this.state.progress.length - 1]}
                  icon={icon}
              />
            </>
          )}

          <Polyline
            path={this.path}
            options={{ strokeColor: "#FFFFFF", geodesic: true }}
          />

          <Marker
            position={this.path[0]}
          />

          <Marker
            position={this.path[1]}     
            icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
          />

        </GoogleMap>
      </>
    );
  };
}

SimuMaps.defaultProps = {
  simu: [{}],
  simu2: [{}]
};

SimuMaps.propTypes = {
  simu: PropTypes.arrayOf(PropTypes.object),
  simu2: PropTypes.object
};


const MapComponent = withScriptjs(withGoogleMap(SimuMaps));

export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    googleMapsApiKey= "AIzaSyCCqt86Lysv0xy9Y3yni3TZkhCNYDVr0UI"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `700px`, width: "1000px" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
