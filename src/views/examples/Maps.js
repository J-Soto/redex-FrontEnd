import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap
} from "react-google-maps";
class SimuMaps extends React.Component {
  
  render = () => {

    return (
        
        <GoogleMap
            defaultZoom={2}
            defaultCenter={{ lat: 0, lng: 0 }}
        >
        </GoogleMap>

    );
  };

}

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
