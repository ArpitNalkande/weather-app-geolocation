const weather = {
  apiKey: "50ae80790bf1860ac9519666301e557c",
  async fetchWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      );
      if (!response.ok) {
        throw new Error("No weather found.");
      }
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      console.error(error);
      alert("No weather found.");
    }
  },
  displayWeather(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(
      ".icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${temp}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
  },
  search() {
    const searchBar = document.querySelector(".search-bar");
    this.fetchWeather(searchBar.value);
  },
};

const geocode = {
  async reverseGeocode(latitude, longitude) {
    const apikey = "50ae80790bf1860ac9519666301e557c";
    const api_url = "https://api.opencagedata.com/geocode/v1/json";
    const request_url = `${api_url}?key=${apikey}&q=${encodeURIComponent(
      latitude + "," + longitude
    )}&pretty=1&no_annotations=1`;

    try {
      const response = await fetch(request_url);
      if (response.ok) {
        const data = await response.json();
        weather.fetchWeather(data.results[0].components.city);
        console.log(data.results[0].components.city);
      } else if (response.status <= 500) {
        console.log(`Unable to geocode! Response code: ${response.status}`);
        const data = await response.json();
        console.log(`Error message: ${data.status.message}`);
      } else {
        console.log("Server error");
      }
    } catch (error) {
      console.error("Unable to connect to the server");
    }
  },
  async getLocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject("Geolocation is not supported by this browser");
        }
      });
      this.reverseGeocode(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error(error);
      weather.fetchWeather("Denver");
    }
  },
};

document.querySelector(".search button").addEventListener("click", () => {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    weather.search();
  }
});

geocode.getLocation();
