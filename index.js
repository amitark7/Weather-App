let container = document.getElementById("weather-box");
let inputBox = document.getElementById("input-box");
let Loader = document.getElementById("loader");
let searchButton = document.getElementById("search-button");
let isLocation = document.getElementById("location-available");
let loader = false;

inputBox.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    searchClick();
  }
});

const fetchData = async (location) => {
  loader = true;
  isLoader();
  let data = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${5}&appid=${`82005d27a116c2880c8f0fcb866998a0`}`
  );
  let json = await data.json();
  if (json.length > 0) {
    let latitute = json[0].lat;
    let longitude = json[0].lon;
    let details =
      await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitute}&lon=${longitude}&appid=${`82005d27a116c2880c8f0fcb866998a0`}
      `);
    let value = await details.json();
    if (value) {
      loader = false;
      isLoader();
      updateDom(value);
    }
  } else {
    loader = false;
    isLoader();
    container.style.display = "block";
    let textNode = `
          <h3>Weather</h3>
          <div class="image-container">
              <img src=${"../assets/404.png"}>
          </div>
          <p class="description">Oops city not find</p>
  `;

    container.innerHTML = textNode;
  }
};

const searchClick = async () => {
  isLocation.style.display = "none";
  if (inputBox.value === "") {
    return;
  }
  const location = inputBox.value;
  fetchData(location);
};

const updateDom = (details) => {
  let imagePath = "";
  let container = document.getElementById("weather-box");
  container.style.display = "block";
  switch (details.weather[0].main) {
    case "Clouds":
      imagePath = "/assets/cloud.png";
      break;
    case "Clear":
      imagePath = "/assets/clear.png";
      break;
    case "Rain":
      imagePath = "/assets/rain.png";
      break;
    case "Mist":
      imagePath = "/assets/mist.png";
      break;
    case "Snow":
      imagePath = "/assets/snow.png";
    case "Haze":
      imagePath = "/assets/haze.png";
      break;
  }
  let textNode = `
              <h3>Weather</h3>
              <div class="image-container">
                  <img src=${imagePath}>
              </div>
              <h1>
                  <span>${(details.main.temp - 273.15).toFixed(0)}
                  </span>°C
              </h1>
              <p class="description">${details.weather[0].description}</p>
              <p class="location">${details.name},${details.sys.country}</p>
              <div class="bottom-container">
              <div class="humidity">
                <i class="fa-solid fa-droplet"></i>
                <div class="bottom-row">
                    <p>${details.main.humidity}%</p>
                    <p>Humidity</p>
                 </div>
              </div>
              <div class="wind">
              <i class="fa-solid fa-wind"></i>
                <div class="bottom-row">
                    <p>${details.wind.speed}km/hr</p>
                    <p>Wind</p>
                 </div>
              </div>
              </div>
      `;

  container.innerHTML = textNode;
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    geolocationSuccess,
    geolocationError
  );
} else {
  alert("Geolocation is not available in this browser.");
}

function geolocationError() {
  isLocation.style.display = "block";
  isLocation.innerText = "*Current location not available*";
}

async function geolocationSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Fetch city name according to latitude and longitude
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    const city = data.address.city;
    fetchData(city);
  } catch (error) {
    console.log("Error in Fetching...");
  }
}

function isLoader() {
  if (loader) {
    searchButton.innerHTML = `<div id="loader"></div>`;
  } else {
    searchButton.innerText = "Search";
  }
}
