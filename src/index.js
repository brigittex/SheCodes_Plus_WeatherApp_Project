//Updating to current date and time upon page reload

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let now = new Date();
let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
let hour = now.getHours();
let minute = now.getMinutes();

//moving from 24hr clock to 12hr clock
let half = null;
if (hour > 12) {
  hour = hour - 12;
  half = "pm";
} else {
  half = "am";
}

//adding 0 in front of single digit minutes
if (minute < 10) {
  minute = `0${minute}`; //turning integer into string, not great, I know. Will this matter later? Maybe not? 🤷🏻‍♀️
}

let weekday = document.querySelector(".weekday-long");
weekday.innerHTML = day;

let currentDate = document.querySelector(".current-date");
currentDate.innerHTML = `${month} ${date}, ${year}`;

let time = document.querySelector(".time");
time.innerHTML = `${hour}:${minute}${half}`;

//end of update to date and time

//function for updating current weather section
function showCurrentWeather(response) {
  //updating location name
  let newLocation = response.data.name;
  let location = document.querySelector(".location");
  location.innerHTML = newLocation;
  //same as saying document.querySelector(".location").innerHTML=response.data.name;

  //updating weather type
  let newWeatherType = response.data.weather[0].main;
  let weatherType = document.querySelector(".weather-type");
  weatherType.innerHTML = newWeatherType;

  //updating humidity
  let newHumidity = response.data.main.humidity;
  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = `Humidity: ${newHumidity}%`;

  //updating wind
  let newWind = response.data.wind.speed;
  newWind = Math.round(newWind);
  let wind = document.querySelector(".wind");
  wind.innerHTML = `Wind: ${newWind} km/h`;

  //updating weather emoji, jk this ain't working 😑
  //let newEmoji = response.data.weather[0].icon;
  //console.log(newEmoji);
  //let currentEmoji = document.querySelector(".current-emoji");
  //currentEmoji.innerHTML = `&#x${newEmoji}`;

  //updating temperature value
  let newCurrentTemp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(".current-temp");
  currentTemp.innerHTML = newCurrentTemp;
  //same as saying document.querySelector(".current-temp").innerHTML=Math.round(response.data.main.temp);
}

//function for updating forecast section **function incomplete**
function showForecast(response) {
  //console.log(response.data);
}

//fetching weather of lat long location
function getLatLonWeather(lat, lon) {
  //variable definitions
  let apiEndpointCurrent = "https://api.openweathermap.org/data/2.5/weather?";
  let apiEndpointForecast = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiKey = "a825d12564855984e0e5673562cb2c52";
  let units = "metric";
  let exclusions = "minutely,hourly,alerts";

  //API URL strings
  let apiUrlCurrent = `${apiEndpointCurrent}appid=${apiKey}&units=${units}&lat=${lat}&lon=${lon}`;
  let apiUrlForecast = `${apiEndpointForecast}appid=${apiKey}&units=${units}&lat=${lat}&lon=${lon}&exclude=${exclusions}`;

  //fetching from API
  axios.get(apiUrlCurrent).then(showCurrentWeather);
  axios.get(apiUrlForecast).then(showForecast);
}

//fetching lat lon of inputted location
function getLatLonOfInput(response) {
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  getLatLonWeather(lat, lon);
}

//fetching inputted location
function updateLocation(event) {
  event.preventDefault();
  let newLocation = document.querySelector("#location-input").value;

  if (newLocation === "") {
  } else {
    //fetching weather(to then get lat lon) from inputted location
    let apiEndpointCurrent = "https://api.openweathermap.org/data/2.5/weather?";
    let apiKey = "a825d12564855984e0e5673562cb2c52";
    let apiUrlCurrent = `${apiEndpointCurrent}appid=${apiKey}&q=${newLocation}`;

    axios.get(apiUrlCurrent).then(getLatLonOfInput);
  }
}

//fetching lat and lon of current location 📍
function handleLocation(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  getLatLonWeather(lat, lon);
}

//fetching current location from navigator
function updateToCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}

let locationForm = document.querySelector("#location-form");
locationForm.addEventListener("submit", updateLocation);

let currentLocationForm = document.querySelector("#current-location");
currentLocationForm.addEventListener("submit", updateToCurrentLocation);
