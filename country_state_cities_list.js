// fetching data for country, state and city

const location_url = " https://api.countrystatecity.in/v1/countries";
const location_api_key =
  "eGZIaWVoR2NyZVl4aHVPTFpZODRYc1dJOUVWMGprRUpnNFkyR0E0QQ==";

var countryLocation = document.querySelector(".country");
var stateLocation = document.querySelector(".state");
var cityLocation = document.querySelector(".city");

var headers = new Headers();
headers.append("X-CSCAPI-KEY", location_api_key);

var requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

export const getLocations = async () => {
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

export const getState = async () => {
  stateLocation.disabled = false;
  stateLocation.style.pointerEvents = "auto";
  cityLocation.disabled = true;
  cityLocation.style.pointerEvents = "none";

  const countryIso = countryLocation.value;

  stateLocation.innerHTML = "<option>Select State</option>";
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

export const getCity = async () => {
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
      option.value = city.iso2;
      option.textContent = city.name;
      cityLocation.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
};

// fetching location data ends here
