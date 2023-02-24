const link =
  "http://api.weatherstack.com/current?access_key=47b496e3996d3012666a93355e8e211b";


let store = {
  city: 'Ekaterinburg',
  observationTime: "00:00 AM",
  temperature: 0,
  pressure: 0,
  isDay: "true",
  description: "",
  cloudcover: {},
  humidity: {},
  windSpeed: {},
  visibility: {},
  uvIndex: {},
}

const root = document.getElementById('root')
const city = document.getElementById('city')
const popup = document.getElementById('popup')
const textInput = document.getElementById('text-input')
const form = document.getElementById('form')
const closePopup = document.getElementById('close')

const fetchData = async () => {
  try {
    const result = await fetch(`${link}&query=${store.city}`);
    const data = await result.json()

    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        pressure,
        uv_index: uvIndex,
        observation_time: observationTime,
        wind_speed: windSpeed,
        weather_descriptions: description,
        is_day: isDay,
        visibility
      }
    } = data

    store = {
      ...store,
      observationTime,
      temperature,
      pressure,
      description: description[0],
      isDay,
      properties: {
        cloudcover: {
          title: "Cloudcover",
          value: `${cloudcover}`,
          icon: "cloud.png"
        },
        humidity: {
          title: "Humidity",
          value: `${humidity}`,
          icon: 'humidity.png'
        },
        windSpeed: {
          title: "Wind Speed",
          value: `${windSpeed} km/h`,
          icon: 'wind.png'
        },
        visibility: {
          title: "Visibility",
          value: `${visibility}`,
          icon: "visibility.png"
        },
        uvIndex: {
          title: "Uv Index",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png"
        },
      }
    }

    renderComponent()
    console.log(store.properties)
  } catch (err) {
    console.log(err)
  }
}

const getImage = (description) => {
  const value = description.toLowerCase();


  switch (value) {
    case ("sunny"):
      return "sunny.png";
    case ("cloud"):
      return "cloud.png"
    case ("partly cloudy"):
      return "partly.png"
    case ("fog"):
      return "fog.png"
    case ("clear"):
      return "clear.png"
    default:
      return "the.png"
  }

}

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, description, observationTime, temperature, properties } = store

  return `<div class="container">
    <div class="top">
      <div class="city">
        <div class="city-subtitle">Weather Today in</div>
          <div class="city-title" id="city">
          <span>${city}</span>
        </div>
      </div>
      <div class="city-info">
        <div class="top-left">
        <img class="icon" src="./img/${getImage(description)}" alt="" />
        <div class="description">${description}</div>
      </div>
    
      <div class="top-right">
        <div class="city-info__subtitle">as of ${observationTime}</div>
        <div class="city-info__title">${temperature}°</div>
      </div>
    </div>
  </div>
  <div id="properties">${renderProperty(properties)}</div>
</div>`;
}

const hengleClickPopup = () => {
  popup.classList.toggle('active')
}

const renderComponent = () => {
  root.innerHTML = markup()

  const city = document.getElementById('city')
  city.addEventListener('click', hengleClickPopup)
}

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};


const hangleSubmit = (e) => {
  e.preventDefault()

  const valueCity = store.city

  if (!valueCity) return null //дабы не было возможности прокинуть пустую строчку

  fetchData();
  hengleClickPopup();
}

const hangleClosePopup = () => {
  hengleClickPopup();

  fetchData()
}

textInput.addEventListener('input', handleInput)
form.addEventListener('submit', hangleSubmit)
closePopup.addEventListener('click', hangleClosePopup)



fetchData()