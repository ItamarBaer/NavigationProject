import React, {useRef, useEffect, useState} from 'react';
import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import MapMarkers from './MapMarkers';

function MapComponent({ markers, addMarker, isSidebarOpen, center, maxDistance }) {
  const InitialPosition = [31.3869, 34.8516];
  const [mapInstance, setMapInstance] = useState(null);
  // const [maxDist, setMaxDist]= useState(0);

      const calculateZoom = () => {
        console.log('max Distance: ', maxDistance)
        var res = Math.min(Math.max(18 - (11 / (1 + Math.exp(-((maxDistance + 10) / 8 - 2.9)))), 7.5), 18);
        console.log('Zoom: ', res);
        return res;
      }
  useEffect(() => {
    if (center && mapInstance) {
      const zoom = calculateZoom();

      mapInstance.flyTo(center, zoom,{duration: 2});
    }
  }, [center, mapInstance]);
  
  return (
<div className={`map-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <MapContainer center={InitialPosition} zoom={7.5} scrollWheelZoom={true} 
      ref={setMapInstance}>
      <ScaleControl position='bottomleft' imperial={false}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}@2x.png"
        />
        <MapMarkers markers={markers} addMarker={addMarker} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
