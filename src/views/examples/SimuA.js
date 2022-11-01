import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";





const SimuEx = ({simulacion}) => {
    const state = {
        progress: []
      };
    
      const  path = [
        { lat: -31.56391, lng: 147.154312 },
        { lat: -12.016421992573788, lng: -77.00842086314432 }
      ];
    
    
      const  velocity = 100000;
      const  initialDate = new Date();
        
      let getDistance = () => {
        const differentInTime = (new Date() - this.initialDate) / 1000;
        return differentInTime * this.velocity;
      };
    
      let componentDidMount = () => {
        this.interval = window.setInterval(this.moveObject, 1000);
      };
    
      let componentWillUnmount = () => {
        window.clearInterval(this.interval);
      };
    
      let moveObject = () => {
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
    
      let componentWillMount = () => {
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
    
      let componentDidUpdate = () => {
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
      

      

}


export default SimuEx