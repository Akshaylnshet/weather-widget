import React, { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query.trim()}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setError("");
      } else {
        setWeatherData(null);
        setError(data.message || "Location not found.");
      }
    } catch (err) {
      setWeatherData(null);
      setError("Error fetching weather data.");
    }
  };

  // Determine hot/cold/mild icon
  let tempCategory = "";
  if (weatherData) {
    const temp = weatherData.main.temp;
    if (temp >= 30) tempCategory = "hot";
    else if (temp <= 15) tempCategory = "cold";
    else tempCategory = "mild";
  }

  return (
    <div className="weather-container">
      <h2>Weather Widget</h2>

      <input
        type="text"
        placeholder="Enter city or country"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
      />
      <button onClick={fetchWeather}>Search</button>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          {/* Temperature Icon */}
          <img
            src={`/${tempCategory}.png`}
            alt={tempCategory}
            className="weather-icon"
          />

          <p>🌡 Temperature: {weatherData.main.temp}°C</p>
          <p>🤒 Feels Like: {weatherData.main.feels_like}°C</p>
          <p>💧 Humidity: {weatherData.main.humidity}%</p>
          <p>🌤 Condition: {weatherData.weather[0].description}</p>
          <p>💨 Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
