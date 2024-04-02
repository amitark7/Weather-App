console.log("Hey Amit");

const fetchData = async (location) => {
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
    return value;
  }
};

const searchClick = async () => {
  let inputBox = document.getElementById("input-box");
  const location = inputBox.value;
  const weatherDetails = await fetchData(location);
  updateDom(weatherDetails);
  inputBox.value = "";
};

const updateDom = (details) => {
  console.log(details);
  let container = document.getElementById("weather-box");
  container.style.display = "block";
  let textNode = `
            <h3>Weather</h3>
            <div class="image-container">
                <img src=${"../images/sunrise.png"}>
            </div>
            <h1>
                <span>${(details.main.temp - 273.15).toFixed(0)}
                    <sup>o</sup>
                </span>C
            </h1>
            <p class="description">${details.weather[0].description}</p>
            <p class="location">${details.name},${details.sys.country}</p>
    `;

  container.innerHTML = textNode;
};
