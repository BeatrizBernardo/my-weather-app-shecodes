//GLOBAL VARIABLES
var currentUnit = 0; //0 - celsius 1 - fahrenheit

//FUNCTIONS
function getRealDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  } else {
    day = `${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  } else {
    month = `${month}`;
  }

  return `${day}/${month}/${year}`;
}

function getRealTime() {
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let weekday = date.getDay();
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (minute < 10) {
    minute = `0${minute}`;
  } else {
    minute = `${minute}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  } else {
    hour = `${hour}`;
  }

  return `${week[weekday]} ${hour}:${minute}`;
}

function calculateNextDaysDate(d) {
  let date = new Date(d);
  let day = date.getDate();
  let month = date.getMonth() + 1;

  if (day < 10) {
    day = `0${day}`;
  } else {
    day = `${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  } else {
    month = `${month}`;
  }
  return `${day}/${month}`;
}

function convertToCelsiusDegree(event) {
  if (currentUnit === 1) {
    event.preventDefault();
    let temp = document.querySelector(".degrees");
    let degree = document.getElementById("degrees").innerText;
    degree = Number(degree);
    degree = Math.round((degree - 32) / 1.8);
    temp.innerHTML = `${degree}`;
  }
  //That means that the current unit is C, and if we click again on convertToCelsius the value doesn't change
  currentUnit = 0;
}

function convertToFahrenheitDegree(event) {
  if (currentUnit === 0) {
    event.preventDefault();
    let temp = document.querySelector(".degrees");
    let degree = document.getElementById("degrees").innerText;
    degree = Number(degree);
    degree = Math.round(degree * 1.8 + 32);
    temp.innerHTML = `${degree}`;
  }

  //That means that the current unit is F, and if we click again on convertToFahreheit the value doesn't change
  currentUnit = 1;
}

//returns in string the current unit global variable
function toStringCurrentUnit(currentUnit) {
  if (currentUnit === 0) {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  return unit;
}

//update the html element with the data
function getSearchCity(response) {
  let currentDate = document.querySelector(".current-city-data-date");
  currentDate.innerHTML = getRealDate();
  let currentTime = document.querySelector(".current-city-data-time");
  currentTime.innerHTML = getRealTime();

  let degrees = Math.round(response.data.main.temp);
  let d = document.querySelector("#degrees");
  d.innerHTML = `${degrees}`;

  let clouds = response.data.weather[0].description;
  let imageTemp = document.querySelector("#current-city-data-image");
  imageTemp.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" style="max-width: 30%;" alt="${clouds}">`;
  let imageTempDesc = document.querySelector(
    "#current-city-data-image-description"
  );
  imageTempDesc.innerHTML = `${clouds}`;
  let imageTempSpeed = document.querySelector("#current-city-data-image-speed");
  imageTempSpeed.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  let imageTempHumidity = document.querySelector(
    "#current-city-data-image-humidity"
  );
  imageTempHumidity.innerHTML = `Humidity: ${Math.round(
    response.data.main.humidity
  )}%`;
}

//cities from the list
function citiesList(event) {
  event.preventDefault();
  let newCity = event.target.innerHTML;
  changeCityElements(newCity);
}

//Search city from the bar
function searchCityByButton(event) {
  event.preventDefault();
  //get the new name
  let newCity = document.querySelector("#search-field");
  changeCityElements(newCity.value);
}

function showForecast(response) {
  let forecastElement = document.querySelector(".next-days-data");
  forecastElement.innerHTML = null;
  for (let index = 0; index < 40; index++) {
    let date = response.data.list[index].dt * 1000;
    let temp = Math.round(response.data.list[index].main.temp);
    let image = response.data.list[index].weather[0].icon;
    let imageDescription = response.data.list[index].weather[0].description;
    forecastElement.innerHTML += `
    <div class="col-sm next-day">
      <div class="row row-cols-1">
        <div class="col">${calculateNextDaysDate(date)}</div>
        <div class="col">${temp}ºC</div>
        <div class="col">
          <img src="http://openweathermap.org/img/wn/${image}@2x.png" style="max-width: 35%;" alt="${imageDescription}">
        </div>
      </div>
    </div>`;
    index += 8;
  }
}

//receive the city to search the weather
function changeCityElements(newCity) {
  let currentCityName = document.querySelector(".current-city-name");
  currentCityName.innerHTML = `${newCity}`;

  let unit = toStringCurrentUnit(currentUnit);

  let apiURL = `${apiEndpoint}?appid=${apiKey}&q=${newCity}&units=${unit}`;
  axios.get(apiURL).then(getSearchCity);

  let forecastURL = `${apiEndpointForecast}?appid=${apiKey}&q=${newCity}&units=metric`;
  axios.get(forecastURL).then(showForecast);
}

//current city by button
function showCurrentCityData(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let unit = toStringCurrentUnit(currentUnit);

    let apiURL = `${apiEndpoint}?appid=${apiKey}&units=${unit}&lat=${latitude}&lon=${longitude}`;
    axios.get(apiURL).then(function (response) {
      let degrees = Math.round(response.data.main.temp);
      let d = document.querySelector("#degrees");
      d.innerHTML = `${degrees}`;
      let currentCityName = document.querySelector(".current-city-name");
      currentCityName.innerHTML = `${response.data.name}`;
      let forecastURL = `${apiEndpointForecast}?appid=${apiKey}&units=${unit}&lat=${latitude}&lon=${longitude}`;
      axios.get(forecastURL).then(showForecast);
    });
  });
}

//MAIN

let fDegrees = document.querySelector(".F-Degrees");
fDegrees.addEventListener("click", convertToFahrenheitDegree);

let cDegrees = document.querySelector(".C-Degrees");
cDegrees.addEventListener("click", convertToCelsiusDegree);

let buttonSearch = document.querySelector("#search-form");
buttonSearch.addEventListener("submit", searchCityByButton);

let chooseCity = document.querySelector(".list-cities");
chooseCity.addEventListener("click", citiesList);

let currenyCityButton = document.querySelector("#currentCityButton");
currenyCityButton.addEventListener("click", showCurrentCityData);

let apiKey = "8e6bcc493a1dde09d842b31c9a0c6dba";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiEndpointForecast = "https://api.openweathermap.org/data/2.5/forecast";

let imagesURL = "images/";

changeCityElements("Lisbon");
