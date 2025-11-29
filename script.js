const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const dateTimeEl = document.getElementById('date-time');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast-container');
const API_KEY = '6adcd447f3ba395f34e1894dc481897a'; 

const getWeatherData = async (city) => {
    try {
        
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const currentResponse = await fetch(currentWeatherUrl);
        
        if (!currentResponse.ok) {
            throw new Error('City not found. Please try again.');
        }
        
        const currentData = await currentResponse.json();

        
        const { lat, lon } = currentData.coord;

        
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

      
        updateCurrentWeather(currentData);
        
        updateBackground(currentData.main.temp);

    } catch (error) {
        alert(error.message);
        console.error('Error fetching weather data:', error);
    }
};

const updateCurrentWeather = (data) => {
    cityNameEl.textContent = data.name;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;        
    
    const localDateTime = new Date(data.dt * 1000 + (data.timezone * 1000));
    dateTimeEl.textContent = localDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; 
    pressureEl.textContent = `${data.main.pressure} hPa`;
};


const updateBackground = (temp) => {
    const body = document.body;

    body.classList.remove('bg-cold', 'bg-cool', 'bg-warm', 'bg-hot', 'bg-default');

    if (temp <= 10) {
        body.classList.add('bg-cold');
    } else if (temp > 10 && temp <= 20) {
        body.classList.add('bg-cool');
    } else if (temp > 20 && temp <= 30) {
        body.classList.add('bg-warm');
    } else { // temp > 30
        body.classList.add('bg-hot');
    }
};

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        cityInput.value = ''; 
    } else {
        alert('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

window.addEventListener('load', () => {
    getWeatherData('Dubai');
    document.body.classList.add('bg-default'); 
});