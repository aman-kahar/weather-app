// fetching data for country, state and city

const location_url = " https://api.countrystatecity.in/v1/countries";
const location_api_key =
  "eGZIaWVoR2NyZVl4aHVPTFpZODRYc1dJOUVWMGprRUpnNFkyR0E0QQ==";

var lat = 0;
var lon = 0;

var countryLocation = document.querySelector(".country");
var stateLocation = document.querySelector(".state");
var cityLocation = document.querySelector(".city");
var searchButton = document.querySelector("#searchButton");

var headers = new Headers();
headers.append("X-CSCAPI-KEY", location_api_key);

var requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

const getLocations = async () => {
  try {
    const response = await fetch(location_url, requestOptions);
    const data = await response.json();

    data.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.iso2;
      option.textContent = country.name;
      countryLocation.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }

  stateLocation.disabled = true;
  stateLocation.style.pointerEvents = "none";
  cityLocation.disabled = true;
  cityLocation.style.pointerEvents = "none";
};

const getState = async () => {
  stateLocation.disabled = false;
  stateLocation.style.pointerEvents = "auto";
  cityLocation.disabled = true;
  cityLocation.style.pointerEvents = "none";

  const countryIso = countryLocation.value;

  stateLocation.innerHTML = "<option>Select State</option>";
  cityLocation.innerHTML = "<option>Select City</option>";
  try {
    const response = await fetch(
      `${location_url}/${countryIso}/states`,
      requestOptions
    );
    const data = await response.json();

    data.forEach((state) => {
      const option = document.createElement("option");
      option.value = state.iso2;
      option.textContent = state.name;
      stateLocation.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
};

const getCity = async () => {
  cityLocation.disabled = false;
  cityLocation.style.pointerEvents = "auto";

  const countryIso = countryLocation.value;
  const stateIso = stateLocation.value;

  cityLocation.innerHTML = "<option>Select City</option>";
  try {
    const response = await fetch(
      `${location_url}/${countryIso}/states/${stateIso}/cities`,
      requestOptions
    );
    const data = await response.json();

    data.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      cityLocation.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
};

searchButton.addEventListener("click", async () => {
  const countryIso = countryLocation.value;
  const stateIso = stateLocation.value;

  if (countryIso === "Select Country") {
    alert("Please Select Country");
  } else if (stateIso === "Select State") {
    searchInput();
  } else {
    try {
      const response = await fetch(
        `${location_url}/${countryIso}/states/${stateIso}/cities`,
        requestOptions
      );
      const data = await response.json();

      data.forEach((city) => {
        if (cityLocation.value == city.id) {
          lat = city.latitude;
          lon = city.longitude;
          getGeoLocation(lat, lon);
        } else if (cityLocation.value === "Select City") {
          searchInput();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
});

getLocations();
// fetching location data ends here

//fetching weather information start here.....

const weather_api_key = "2c396f7652e1d6981734fe544efa8d27";

window.addEventListener("load", async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      getGeoLocation(lat, lon);
    });
  } else {
    console.log("Geolocation is not supported by your browser");
  }
});

const getGeoLocation = async (lat, lon) => {
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}`;

  try {
    const response = await fetch(weather_url);
    const data = await response.json();

    getWeatherInfo(data);
  } catch (error) {
    console.error(error);
  }
};

const searchInput = () => {
  if (stateLocation.value === "Select State") {
    const select = document.getElementById("countrySelect");
    let countryText = getOptionValue(select, countryLocation.value);
    searchByName(countryText.toLowerCase());
  } else if (cityLocation.value === "Select City") {
    const select = document.getElementById("stateSelect");
    let stateText = getOptionValue(select, stateLocation.value);
    searchByName(stateText.toLowerCase());
  }
};

const getOptionValue = (select, val) => {
  let text = "";

  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === val) {
      text = select.options[i].text;
      break; // Exit loop once found
    }
  }
  return text;
};

const searchByName = async (place) => {
  var urlsearch =
    `https://api.openweathermap.org/data/2.5/weather?q=${place}&` +
    `appid=${weather_api_key}`;

  try {
    const response = await fetch(urlsearch);
    const data = await response.json();

    getWeatherInfo(data);
  } catch (error) {
    console.error(error);
  }
};

const getWeatherInfo = async (data) => {
  var weather_url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${weather_api_key}`;
  try {
    const response = await fetch(weather_url2);
    const data2 = await response.json();

    hourForecast(data2);
    dayForecast(data2);

    document.querySelector(".cityInfo").innerHTML =
      data.name + "," + data.sys.country;

    document.querySelector(".temp").innerHTML =
      Math.floor(data.main.temp - 273) + "°C";

    document.querySelector(".cloudsInfo").innerHTML =
      data.weather[0].description;

    document.querySelector(".weatherImg").src =
      "https://api.openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  } catch {
    console.error(error);
  }
};

const hourForecast = async (data2) => {
  document.querySelector(".templist").innerHTML = "";
  for (let i = 0; i < 4; i++) {
    var date = new Date(data2.list[i].dt * 1000);

    let hour = document.createElement("div");
    hour.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerText = date
      .toLocaleTimeString(undefined, "Asia/Kolkata")
      .replace(":00", "");

    let temp = document.createElement("p");
    temp.setAttribute("class", "upcomingTemp");
    temp.innerText =
      "⬆️" +
      Math.floor(data2.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      "⬇️" +
      Math.floor(data2.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "weatherDesc");
    desc.innerText = data2.list[i].weather[0].description;

    hour.appendChild(div);
    hour.appendChild(desc);
    document.querySelector(".templist").appendChild(hour);
  }
};

const dayForecast = async (data2) => {
  document.querySelector(".week").innerHTML = "";
  for (let i = 8; i < data2.list.length; i += 8) {
    let div = document.createElement("div");
    div.setAttribute("class", "day");

    let day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(data2.list[i].dt * 1000).toDateString(
      undefined,
      "Asia/Kolkata"
    );
    div.appendChild(day);

    let temp = document.createElement("p");
    temp.setAttribute("class", "daysTemp");
    temp.innerText =
      "⬆️" +
      Math.floor(data2.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      "⬇️" +
      Math.floor(data2.list[i].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "weatherDesc");
    description.innerText = data2.list[i].weather[0].description;
    div.appendChild(description);

    document.querySelector(".week").appendChild(div);
  }
};
