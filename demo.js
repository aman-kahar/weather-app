let country = "GB";
let city = "London";
let lat = 51.5098;
let lon = -0.1180;

let urlGeoLocation = `https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`;

//let url = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=44.34&lon=10.99&cnt=7&appid=2c396f7652e1d6981734fe544efa8d27`;

let url = `http://api.openweathermap.org/data/2.5/forecast?q=delhi&appid=2c396f7652e1d6981734fe544efa8d27`;

//const url = "http://api.openweathermap.org/data/3.0/reverse?lat=51.5098&lon=-0.1180&limit=5&appid=2c396f7652e1d6981734fe544efa8d27";

const getGeoLocation = async () => {
  // getting longitude and latitude
  {
    try {
      const response = await fetch(urlGeoLocation, {
        method: "GET",
        headers: {
          "X-Api-Key": "q+gA2iEcl4+jbP4DCseDBg==3U2oNVKq089CJxly",
        },
      });
      const data = await response.json();
      console.log(data);

      lat = data[0].latitude;
      lon = data[0].longitude;


      return data;
    } catch (error) {
      console.error(error);
    }
  }
  // latitude and longitude received

  // getting weather information based on latitude and longitude

};

const getWeatherInfo = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}


const run = async()=>{
  await getGeoLocation();
  console.log(lat);
  console.log(lon);
  await getWeatherInfo();
}

run();





      //console.log(data.list[0].main.temp);
      //console.log(data.list[0].weather[0].description);
      //console.log(data.list[0].weather[0].icon);
      //console.log(data.list[0].dt_txt);
      //console.log(data.list[0].main.humidity);
      //console.log(data.list[0].wind.speed);
      //console.log(data.list[0].main.pressure);
      //console.log(data.list[0].main.temp);
      //console.log(data.list[0].main.temp_min);
      //console.log(data.list[0].main.temp_max);
      //console.log(data.list[0].weather[0].main);