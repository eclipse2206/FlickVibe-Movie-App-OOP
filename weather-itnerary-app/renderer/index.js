const { ipcRenderer } = require('electron');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const itineraryBtn = document.getElementById('itineraryBtn');
let currentCountry = '';

searchBtn.addEventListener('click', async () => {
  const country = document.getElementById('country').value.trim();
  if (!country) return alert('Please enter a country name.');

  //const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=9fd7a449d055dba26a982a3220f32aa2`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod === '404') throw new Error('Country not found');

    resultDiv.innerHTML = `
      <h3>${data.name}</h3>
      <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;

    itineraryBtn.style.display = 'block';
    currentCountry = data.name;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">Error fetching data.</p>`;
    itineraryBtn.style.display = 'none';
  }
});

itineraryBtn.addEventListener('click', () => {
  ipcRenderer.send('open-itinerary-window', currentCountry);
});
