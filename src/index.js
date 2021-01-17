//GLOBAL VARIABLES
var currentUnit = 0; //0 - celsius 1 - fahrenheit

//FUNCTIONS
function getRealTimeDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
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

  //if the value returns 0, equality to January (1)
  if (month === 0) {
    month = 1;
  }

  let currentDate = document.querySelector(".current-city-data-date");
  currentDate.innerHTML = `${day}/${month}/${year}`;

  let currentTime = document.querySelector(".current-city-data-time");
  if (minute < 10) {
    currentTime.innerHTML = `${week[weekday]} ${hour}:0${minute}`;
  } else {
    currentTime.innerHTML = `${week[weekday]} ${hour}:${minute}`;
  }

  calculateNextDaysDate();
}

function calculateNextDaysDate() {
  let date = new Date();
  let day1 = new Date();
  let day2 = new Date();
  let day3 = new Date();
  let day4 = new Date();
  let day5 = new Date();

  day1.setDate(date.getDate() + 1);
  day2.setDate(date.getDate() + 2);
  day3.setDate(date.getDate() + 3);
  day4.setDate(date.getDate() + 4);
  day5.setDate(date.getDate() + 5);

  //change day 1
  let day1Date = document.querySelector(".day1-date");
  day1Date.innerHTML = `${day1.getDate()}/${day1.getMonth() + 1}`;

  //change day 2
  let day2Date = document.querySelector(".day2-date");
  day2Date.innerHTML = `${day2.getDate()}/${day2.getMonth() + 1}`;

  //change day 3
  let day3Date = document.querySelector(".day3-date");
  day3Date.innerHTML = `${day3.getDate()}/${day3.getMonth() + 1}`;

  //change day 4
  let day4Date = document.querySelector(".day4-date");
  day4Date.innerHTML = `${day4.getDate()}/${day4.getMonth() + 1}`;

  //change day 5
  let day5Date = document.querySelector(".day5-date");
  day5Date.innerHTML = `${day5.getDate()}/${day5.getMonth() + 1}`;
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

/* function changeCityName(newCity) {
  //change the name on html
  let currentCityName = document.querySelector(".current-city-name");

  //if the data came from cities list
  if (newCity !== undefined) {
    console.log("diferente de undef " + newCity);
    currentCityName.innerHTML = `${newCity}`;
    //if the data came from an element
  } else {
    console.log("diferente " + newCity.value);
    currentCityName.innerHTML = `${newCity.value}`;
  }
} */

//update the html element with the data
function getSearchCity(response) {
  let degrees = Math.round(response.data.main.temp);
  let d = document.querySelector("#degrees");
  d.innerHTML = `${degrees}`;

  let clouds = response.data.weather[0].description;
  let imageTemp = document.querySelector(".current-city-data-image");
  console.log(imageTemp);
  imageTemp.innerHTML = `<img src="images/${clouds}.png" style="max-width: 30%;" alt=""> <br> <span style="font-size: 20px">${clouds}</span>`;

  console.log(imageTemp);
}

//cities from the list
function citiesList(event) {
  event.preventDefault();
  let newCity = event.target.innerHTML;

  let currentCityName = document.querySelector(".current-city-name");
  currentCityName.innerHTML = `${newCity}`;

  let unit = toStringCurrentUnit(currentUnit);

  let apiURL = `${apiEndpoint}?appid=${apiKey}&q=${newCity}&units=${unit}`;
  axios.get(apiURL).then(getSearchCity);
}

//cities from the search bar
function searchCityByButton(event) {
  event.preventDefault();

  //get the new name
  let newCity = document.querySelector("#search-field");
  let currentCityName = document.querySelector(".current-city-name");
  currentCityName.innerHTML = `${newCity.value}`;

  let unit = toStringCurrentUnit(currentUnit);

  let apiURL = `${apiEndpoint}?appid=${apiKey}&q=${newCity.value}&units=${unit}`;
  axios.get(apiURL).then(getSearchCity);

  //let forecastURL = `${apiEndpointForecast}?cnt=5&appid=${apiKey}&q=${newCity.value}&units=${unit}`;
  //console.log(forecastURL);
}

//start with a defined city
function definedCity() {
  //get the new name
  let newCity = "Lisbon";
  let currentCityName = document.querySelector(".current-city-name");
  currentCityName.innerHTML = `${newCity}`;

  let unit = toStringCurrentUnit(currentUnit);

  let apiURL = `${apiEndpoint}?appid=${apiKey}&q=${newCity}&units=${unit}`;
  axios.get(apiURL).then(getSearchCity);

  //let forecastURL = `${apiEndpointForecast}?cnt=5&appid=${apiKey}&q=${newCity.value}&units=${unit}`;
  //console.log(forecastURL);
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
let apiEndpointForecast =
  "https://api.openweathermap.org/data/2.5/forecast/daily";

let imagesURL = "images/";

getRealTimeDate();
definedCity();
