// ElevationProfile.js

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ElevationProfile.css'; // Import the CSS file

function ElevationProfile({ elevation, distances }) {
  const chartRef = useRef(null);

  var totalDistance = Math.round(distances[distances.length -1]);
  var elevationGain = 0;
  var elevationLoss = 0;
  for (var i = 0; i<elevation.length - 1; i++) {
    if (elevation[i] < elevation[i+1]) {
      elevationGain += elevation[i+1] - elevation[i];
    }else {
      elevationLoss += elevation[i] - elevation[i+1];
    }
  }

  useEffect(() => {
    // Check if the chart already exists
    if (chartRef.current) {
      // Destroy the existing chart
      chartRef.current.destroy();
    }

    // Create a new chart with both scatter and line datasets
    const ctx = document.getElementById('elevationChart').getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Elevation Profile',
            data: distances.map((distance, index) => ({ x: distance, y: elevation[index] })),
            borderColor: '#1b2738',
            borderWidth: 1,
            pointRadius: 0, 
            showLine: true,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Distance (meters)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Elevation (meters)',
            },
          },
        },
      },
    });

    // Save the new chart instance to the ref
    chartRef.current = newChart;

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [elevation, distances]);
  return (
    <div className="elevation-profile-container">
      <canvas id="elevationChart" width="400" height="200"></canvas>
      <div className="elevation-info">
        <div className="elevation-stat">
          <p>Elevation Loss:</p>
          <div className="elevation-value">
            {elevationLoss} <span className="down-arrow">&#8595;</span>
          </div>
        </div>
        <div className="elevation-stat">
          <p>Elevation Gain:</p>
          <div className="elevation-value">
            {elevationGain} <span className="up-arrow">&#8593;</span>
          </div>
        </div>
        <div className="elevation-stat">
          <p>Total Distance:</p>
          <div className="elevation-value">{totalDistance} m</div>
        
        </div>
      </div>
    </div>
  );
}

export default ElevationProfile;