const searchButton = document.getElementById('searchButton');
const citiesHistory = JSON.parse(localStorage.getItem('cities')) || [];
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  getData();
});

async function getData() {

    const city = document.getElementById('city').value;
    const newCitiesHistory = citiesHistory.concat(city);
    localStorage.setItem('cities', JSON.stringify(newCitiesHistory));
    document.getElementById('history-city').innerHTML = '';

    newCitiesHistory.forEach((HistoryCity) => {
      const newCity = document.createElement('button');
      newCity.classList.add('btn');
      newCity.classList.add('history-button');
      newCity.innerHTML = HistoryCity;
      newCity.addEventListener('click', () => {
        document.getElementById('city').value = HistoryCity;
        getData();
      });
      document.getElementById('history-city').appendChild(newCity);
    });

    const geocodeRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=76d841795ac608aab43b884022bf69ec`
      );

    const geoCoordenates = await geocodeRes.json();

    console.log(geoCoordenates);

    const lat = geoCoordenates.coord.lat;
    const lon = geoCoordenates.coord.lon;

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=76d841795ac608aab43b884022bf69ec`
      );
    
      const weatherInfo = await res.json();
      const cityWeather = {
        cityName: weatherInfo.city.name ,
        forecast: weatherInfo.list
        .filter((weather) => weather.dt_txt.includes('09:00:00'))
        .map((weather) => {
          return {
            date: new Date(weather.dt_txt).toLocaleDateString("en-US"),
            wind: weather.wind.speed,
            humidity: weather.main.humidity,
            temp: Math.round(((weather.main.temp -273.15) * 9/5 + 32)),
            icon: getWeatherIcon(weather.weather[0].main)
          }
        })          
      };
      console.log('cityWeather > ', cityWeather);
      function getWeatherIcon(main) {
        if (main === 'Clear') {
            return "☀️";
          } else if (main === 'Clouds'){
            return "💨";
          } else if(main === 'Snow'){
            return "❄️";
          } else if(main === 'Rain'){
            return "🌧️";   
          }
          return main;
      }
   
   document.getElementsByClassName('current-city')[0].innerHTML = `
    <h3>${cityWeather.cityName}</h3>
    <p>${cityWeather.forecast[0].icon}</p>
    <p>Temp: ${cityWeather.forecast[0].temp} °F</p>
    <p>Wind: ${cityWeather.forecast[0].wind} MPH</p>
    <p>Humidty: ${cityWeather.forecast[0].humidity} %</p>`;

    document.getElementById('weather-id').innerHTML = '';
        
    cityWeather.forecast.forEach(w => {
      const dayWeather = document.createElement('div');
      dayWeather.classList.add('day-forecast');
      dayWeather.classList.add('col-sm-2');
      dayWeather.innerHTML = `
        <h5>${w.date}</h5>
        <p>${w.icon}</p>
        <p>Temp: ${w.temp} °F</p>
        <p>Wind: ${w.wind} MPH</p>
        <p>Humidty: ${w.humidity} %</p>
    `;
      document.getElementById('weather-id').appendChild(dayWeather);
  });
}