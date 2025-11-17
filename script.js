const API_KEY = "482d55e3df80280c7539a73103b6a9c9";

const getCurrentWeather = async (city) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    xhr.open("GET", url, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      }
    };

    xhr.send();
  });
};

const getForecast = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`
  );
  const data = await response.json();
  return data;
};

const onGetWeatherClick = () => {
  const inputContainer = document.getElementById("input");
  document.body.innerHTML = "";
  document.body.appendChild(inputContainer);
  getWeather();
};

const getWeather = async () => {
  const city = document.getElementById("cityInput").value;
  const currentWeather = await getCurrentWeather(city);
  const forecast = await getForecast(city);
  console.log(currentWeather);
  console.log(forecast);

  renderCurrentWeather(currentWeather);
  renderForecast(forecast);
};

const renderCurrentWeather = (data) => {
  const description = data.weather[0].description;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const weatherContainer = document.createElement("article");
  weatherContainer.className = "weather-container";
  const country = document.createElement("h1");
  country.textContent = `${data.name}, ${data.sys.country}`;
  weatherContainer.appendChild(country);

  const icon = document.createElement("img");
  icon.src = iconUrl;
  icon.className = "weather-icon";
  weatherContainer.appendChild(icon);

  const title = document.createElement("h2");
  title.textContent = description;
  weatherContainer.appendChild(title);

  const attributesContainer = document.createElement("div");
  attributesContainer.className = "weather-attributes";

  attributesContainer.appendChild(
    renderIconAttribute("temperature", `${temperature}°C`)
  );
  attributesContainer.appendChild(
    renderIconAttribute("wind", `${windSpeed}m/s`)
  );
  attributesContainer.appendChild(
    renderIconAttribute("humidity", `${humidity}%`)
  );

  weatherContainer.appendChild(attributesContainer);

  document.body.appendChild(weatherContainer);
};

const renderForecast = (data) => {
  const forecastContainer = document.createElement("section");
  forecastContainer.className = "forecast-container";

  let dayContainer = document.createElement("div");
  let dayContainerBody = document.createElement("div");
  let lastDate;
  data.list.map((item) => {
    const itemDay = new Date(item.dt * 1000).getDay();
    if (itemDay !== lastDate) {
      dayContainer.appendChild(dayContainerBody);
      forecastContainer.appendChild(dayContainer);

      dayContainer = document.createElement("div");
      dayContainer.className = "day-container";
      dayContainerBody = document.createElement("div");
      const dayHeader = document.createElement("h3");

      dayHeader.textContent = new Date(item.dt * 1000).toLocaleDateString(
        "pl-PL",
        {
          day: "numeric",
          month: "numeric",
        }
      );

      dayContainer.appendChild(dayHeader);
    }
    lastDate = itemDay;
    dayContainerBody.appendChild(renderForecastItem(item));
  });
  document.body.appendChild(forecastContainer);
};

const renderForecastItem = (item) => {
  const hour = new Date(item.dt * 1000).getHours();
  const temperature = Math.round(item.main.temp, 0);
  const iconCode = item.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  const container = document.createElement("div");
  container.className = "forecast-item";
  const time = document.createElement("span");
  time.textContent = `${hour}:00`;
  container.appendChild(time);
  const icon = document.createElement("img");
  icon.src = iconUrl;
  container.appendChild(icon);
  const temp = document.createElement("span");
  temp.textContent = `${temperature}°C`;
  container.appendChild(temp);
  return container;
};

const renderIconAttribute = (iconName, content) => {
  let className = "";
  switch (iconName) {
    case "temperature":
      className = "fa fa-thermometer-empty";
      break;
    case "wind":
      className = "fa fa-wind";
      break;
    case "humidity":
      className = "fa fa-tint";
      break;
    default:
      className = "";
  }

  const icon = document.createElement("i");
  icon.className = className;
  const span = document.createElement("span");
  span.textContent = content;
  const container = document.createElement("div");
  container.className = "icon-container";
  container.appendChild(icon);
  container.appendChild(span);
  return container;
};
