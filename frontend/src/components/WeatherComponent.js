// WeatherComponent.js

import React, { useState, useEffect } from 'react';
import './WeatherComponent.css'; // Import the CSS file

const WeatherComponent = ({ weather }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: '',
    humidity: '',
    icon: '',
    sunrise: '',
    sunset: '',
  });

  useEffect(() => {
    if (weather){
    setWeatherData({
      temperature: weather.temperature,
      humidity: weather.humidity,
      icon: weather.icon,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
    })};
  }, [weather]);

  return (weather && (
    <div className="weather-container">
      <div className="weather-info">
        <img className="weather-icon" alt="Weather Icon" src={weatherData.icon} />
        <p className="weather-detail">
          Temperature: <span className="weather-value">{weatherData.temperature}</span>
        </p>
        <p className="weather-detail">
          Humidity: <span className="weather-value">{weatherData.humidity}%</span>
        </p>
        <p className="weather-detail">
          Sunrise: <span className="weather-value">{weatherData.sunrise}</span>
        </p>
        <p className="weather-detail">
          Sunset: <span className="weather-value">{weatherData.sunset}</span>
        </p>
      </div>
    </div>
  ));
};

export default WeatherComponent;
