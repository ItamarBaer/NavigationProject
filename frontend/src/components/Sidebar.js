import React from 'react';
import './Sidebar.css'; // Add corresponding CSS for styling
import ElevationProfile from './ElevationProfile';
import WeatherComponent from './WeatherComponent';

function Sidebar({ weather, elevation, distances }) {
  return (
    <div className='sidebar-container'>
      {/* Display weather, elevation, distances, etc. here */}
      <ElevationProfile elevation={elevation} distances={distances} />
      <WeatherComponent weather = {weather}/>
      <div className='save-container'>
      <button className='save-button'>
        Save
      </button>
      </div>
    </div>
  );
}



export default Sidebar;