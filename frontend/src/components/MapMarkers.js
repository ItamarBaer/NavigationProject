import React from 'react';
import { Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import {Icon} from 'leaflet';

const markerIcon =new Icon( {
  iconUrl: "https://cdn-icons-png.flaticon.com/128/1783/1783356.png",
  iconSize: [18, 18]
});

function MapMarkers({ markers, addMarker }) {

  const map = useMapEvents({
    click(e) {
      addMarker(e.latlng);
    }
  });

  return (
    <>
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} icon={markerIcon}>
        </Marker>
      ))}
      <Polyline positions={markers}></Polyline>
    </>
  );
}

export default MapMarkers;
