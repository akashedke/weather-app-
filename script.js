const apiUrl = 'https://api.open-meteo.com/v1/forecast';
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeatherButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const windSpeedElement = document.getElementById('windSpeed');
const weatherGifElement = document.getElementById('weatherGif');
const weatherInfoElement = document.querySelector('.weather-info');

const weatherGifs = {
    0: 'https://media.giphy.com/media/3o6Zt7qgC7j5Pz1c5m/giphy.gif', // Clear sky
    1: 'https://media.giphy.com/media/3o6Zt7qgC7j5Pz1c5m/giphy.gif', // Partly cloudy
    2: 'https://media.giphy.com/media/3o6Zt7qgC7j5Pz1c5m/giphy.gif', // Cloudy
    3: 'https://media.giphy.com/media/3o6Zt7qgC7j5Pz1c5m/giphy.gif', // Rain
    4: 'https://media.giphy.com/media/3o6Zt7qgC7j5Pz1c5m/giphy.gif'  // Thunderstorm
};

getWeatherButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchGeocode(city);
    }
});

// Auto-refresh every 10 minutes
setInterval(() => {
    const city = cityInput.value;
    if (city) {
        fetchGeocode(city);
    }
}, 600000); // 10 minutes in milliseconds

function fetchGeocode(city) {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const { latitude, longitude } = data.results[0];
            fetchWeather(latitude, longitude);
        })
        .catch(error => console.error('Error fetching geocode:', error));
}

function fetchWeather(latitude, longitude) {
    const weatherUrl = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const { temperature, windspeed } = data.current_weather;
            const weatherCode = data.current_weather.weathercode;
            locationElement.textContent = cityInput.value;
            temperatureElement.textContent = `Temperature: ${temperature}°C`;
            windSpeedElement.textContent = `Wind Speed: ${windspeed} km/h`;
            weatherGifElement.src = weatherGifs[weatherCode];
            weatherInfoElement.style.display = 'block';
        })
        .catch(error => console.error('Error fetching weather:', error));
}