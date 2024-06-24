import React, { useState } from 'react';
import './Buttons.css'; // Import the CSS file

function Buttons({ setMarkers, generateRoute, changeSidebar, markers, isLoading, setTransportation, transportation, isSidebarOpen }) {
  const handleUndo = () => {
    deleteLastMarker();
    changeSidebar(false);
  };

  const deleteLastMarker = () => {
    setMarkers((prevMarkers) => {
      const newMarkers = [...prevMarkers];
      newMarkers.pop();
      return newMarkers;
    });
  };

  const toggleTransportation = (mode) => {
    setTransportation(mode);
  };

  const clearMarkers = () => {
    setMarkers(() => {
      const newMarkers = [];
      changeSidebar(false);
      return newMarkers;
    }
    );
  };

  return (
    <>
      <div className='button-container'>
        <button
          className="button"
          onClick={handleUndo}
          disabled={markers.length === 0 || isLoading}
        >
        <img src='https://cdn-icons-png.flaticon.com/128/7538/7538598.png'/>

        </button>
        <button
          className="button"
          onClick={generateRoute}
          disabled={markers.length === 0 || isLoading}
        >
          Generate Route
        </button>
        <button className='button'
        onClick ={clearMarkers}
        disabled={markers.length === 0 || isLoading}>
          <img src='https://cdn-icons-png.flaticon.com/128/7072/7072378.png'/>
          
        </button>
      </div>
      <div className={`transportation-buttons ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button
          className= {transportation === 'walk' ? 'active': ''}
          onClick={() => toggleTransportation('walk')}
          disabled={isLoading}
        >
          <img src={"https://cdn-icons-png.flaticon.com/128/7458/7458163.png" } />
        </button>
        <button
          className= {transportation === 'bike' ? 'active': ''}
          onClick={() => toggleTransportation('bike')}
          disabled={isLoading}
        >
           <img src={"https://cdn-icons-png.flaticon.com/128/120/120482.png" } />
        </button>
        <button
          className= {transportation === 'drive' ? 'active': ''}
          onClick={() => toggleTransportation('drive')}
          disabled={isLoading}
        >
           <img src={"https://cdn-icons-png.flaticon.com/128/2207/2207521.png" }  />
        </button>
      </div>
    </>
  );
}

export default Buttons;
