import {Outlet} from "react-router-dom"
import React, { useState, useRef} from 'react';
import Buttons from './components/Buttons';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import './App.css';
import './components/Sidebar.css';
import { map } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

function App() {
  const [markers, setMarkers] = useState([]);
  const [weather, setWeather] = useState({});
  const [elevation, setElevation] = useState([]);
  const [distances, setDistances] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [transportation, setTransportation] = useState('walk');
  const [center, setCenter] = useState(null);
  const [maxDistance, setMaxDistance] = useState(1);

  const changeSidebar =(isOpen) => {

    setIsSidebarOpen(() =>isOpen );
  };
  const addMarker = (newMarker) => {
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };


  const generateRoute = async () => {
    try {
      setIsLoading(true); 
      const response = await fetch('http://localhost:8000/api/generate_route/', {
        method: 'POST',
        body: JSON.stringify({ markers, transportation }),
      });
      const data = await response.json();
      changeSidebar(true);
      setMarkers(data.route);
      setElevation(data.elevation);
      setWeather(data.weather);
      setDistances(data.distances);
      setCenter(data.center);
      setMaxDistance(data.max_dist);

      console.log('Generated Route Data:', data);
    } catch (error) {
      console.log('No nodes detected in proximity to route:', error);
    }finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <>
    <Outlet/>
      {/* <TopBar
        isLoggedIn={null}
        username={null}
        onLogin={null}
        onRegister={null}
        onLogout={null}
        onMyRoutes={null}
      /> */}
      <MapComponent markers={markers} addMarker={addMarker} isSidebarOpen={isSidebarOpen} center = {center} maxDistance = {maxDistance} />
      <Buttons
        setMarkers={setMarkers}
        generateRoute={generateRoute}
        changeSidebar = {changeSidebar}
        markers = {markers}
        isLoading = {isLoading}
        setTransportation = {setTransportation}
        transportation= {transportation}
        isSidebarOpen= {isSidebarOpen}
      />
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar weather={weather} elevation={elevation} distances={distances} />
      </div>
    </>
  );
}

export default App;
