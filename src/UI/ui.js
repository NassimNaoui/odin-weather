import { getWeatherData } from "../API/weather-api.js";
import { convertTemp } from "../API/weather-api.js";
import { getNameDay } from "../API/weather-api.js";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const weatherConditions = {
  "clear conditions throughout the day": "--gradient-clear",
  "clearing in the afternoon": "--gradient-clear",
  Clear: "--gradient-clear",
  partlyCloudy: "--gradient-partly-cloudy",
  "Cloud Cover": "--gradient-cloudy",
  "becoming cloudy in the afternoon": "--gradient-cloudy",
  "cloudy skies throughout the day": "--gradient-cloudy",
  "Partially cloudy": "--gradient-cloudy",
  "partly cloudy throughout the day": "--gradient-cloudy",
  "a chance of rain throughout the day": "--gradient-light-rain",
  "a chance of rain": "--gradient-light-rain",
  "Rain, Partially cloudy": "--gradient-light-rain",
  "a chance of rain or snow throughout the day": "--gradient-light-rain",
  "Light Rain": "--gradient-light-rain",
  "Light Drizzle/Rain": "--gradient-light-rain",
  "morning rain": "--gradient-heavy-rain",
  "Snow, Rain, Overcast": "--gradient-snow",
  "rain in the morning and afternoon": "--gradient-heavy-rain",
  "rain clearing later": "--gradient-heavy-rain",
  "early morning rain": "--gradient-light-rain",
  "Rain, Overcast": "--gradient-light-rain",
  "late afternoon rain": "--gradient-heavy-rain",
  "afternoon rain": "--gradient-heavy-rain",
  "morning rain or snow": "--gradient-heavy-rain",
  "rain or snow in the morning and afternoon": "--gradient-heavy-rain",
  "rain or snow clearing later": "--gradient-heavy-rain",
  "rain or snow": "--gradient-heavy-rain",
  "early morning snow or rain": "--gradient-heavy-rain",
  "late afternoon rain or snow": "--gradient-heavy-rain",
  "afternoon rain or snow": "--gradient-heavy-rain",
  "Heavy Freezing Drizzle/Freezing Rain": "--gradient-heavy-rain",
  "Heavy Freezing Rain": "--gradient-heavy-rain",
  "Heavy Rain And Snow": "--gradient-heavy-rain",
  "Rain Showers": "--gradient-heavy-rain",
  "Heavy Rain": "--gradient-heavy-rain",
  "Snow And Rain Showers": "--gradient-heavy-rain",
  "Heavy Drizzle/Rain": "--gradient-heavy-rain",
  "Freezing Drizzle/Freezing Rain": "--gradient-heavy-rain",
  "Lightning Without Thunder": "--gradient-thunderstorm",
  Thunderstorm: "--gradient-thunderstorm",
  "Thunderstorm Without Precipitation": "--gradient-thunderstorm",
  Snow: "--gradient-snow",
  "a chance of snow throughout the day": "--gradient-snow",
  "morning snow": "--gradient-snow",
  "snow in the morning and afternoon": "--gradient-snow",
  "a chance of snow": "--gradient-snow",
  "snow clearing later": "--gradient-snow",
  snow: "--gradient-snow",
  "Snow Depth": "--gradient-snow",
  "early morning snow": "--gradient-snow",
  "late afternoon snow": "--gradient-snow",
  "afternoon snow": "--gradient-snow",
  "Snow, Partially cloudy": "--gradient-snow",
  "Blowing Or Drifting Snow": "--gradient-snow",
  "Heavy Snow": "--gradient-snow",
  "Light Snow": "--gradient-snow",
  Fog: "--gradient-fog",
  "Freezing Fog": "--gradient-fog",
  "Wind Gust": "--gradient-windy",
  "Wind Chill": "--gradient-windy",
  "Wind speed": "--gradient-windy",
  Overcast: "--gradient-overcast",
};

function applyWeatherGradient(condition) {
  const root = document.documentElement;
  const gradientVariable = weatherConditions[condition];
  if (gradientVariable) {
    document.body.style.background = `var(${gradientVariable})`;
  } else {
    document.body.style.background = `linear-gradient(
        to right top,
        #051937,
        #004d7a,
        #008793,
        #00bf72,
        #a8eb12
      )`;
  }
}

// applyWeatherGradient("clear");

function displayData() {
  const searchButton = document.getElementById("location-search-button");
  searchButton.addEventListener("click", async function () {
    try {
      const inputValue = document.getElementById("location-search").value;
      const weatherData = await getWeatherData(inputValue);
      console.log(weatherData);
      displayLocation(weatherData);
      displayIcon(weatherData);
      displayTemp(weatherData);
      displayCondition(weatherData);
      loadingChart(weatherData);
    } catch (error) {
      console.log("Erreur lors de la récupération des données météo :", error);
    }
  });
}

function displayLocation(df) {
  const location = document.getElementById("location-today-card");
  location.textContent = df[11][0][1]; // Location in DF;
  const locationWeek = document.getElementById("location-week-card");
  locationWeek.textContent = df[11][0][1];
}

function displayIcon(df) {
  const iconWeather = document.getElementById("icon-weather-today-card");
  if (iconWeather.children.length === 1) {
    iconWeather.removeChild(iconWeather.children[0]);
  }
  const newIcon = document.createElement("img");
  newIcon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[0][3][1]}.png`;
  newIcon.alt = df[0][3][1];
  newIcon.id = "icon-weather-today";
  iconWeather.appendChild(newIcon);
}

function displayTemp(df) {
  const temp = document.getElementById("temp-today-card");
  const tempConverted = convertTemp(parseFloat(df[0][1][1]));
  temp.textContent = `${Math.round(tempConverted)} °C`;
}

function displayCondition(df) {
  const condition = document.getElementById("condition-today-card");
  condition.textContent = df[0][2][1];
  applyWeatherGradient(`${df[0][2][1]}`);
}

let chartInstance = null;
async function loadingChart(df) {
  const ctx = document.getElementById("chart-container").getContext("2d");

  // Créer un dégradé vertical pour le fond
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.3)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.1)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");

  // Fonction pour récupérer les labels et leurs images
  const labelsWithImages = [
    {
      label: "Today",
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[0][3][1]}.png`,
    },
    {
      label: getNameDay(df[1][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[1][3][1]}.png`,
    },
    {
      label: getNameDay(df[2][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[2][3][1]}.png`,
    },
    {
      label: getNameDay(df[3][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[3][3][1]}.png`,
    },
    {
      label: getNameDay(df[4][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[4][3][1]}.png`,
    },
    {
      label: getNameDay(df[5][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[5][3][1]}.png`,
    },
    {
      label: getNameDay(df[6][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[6][3][1]}.png`,
    },
    {
      label: getNameDay(df[7][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[7][3][1]}.png`,
    },
    {
      label: getNameDay(df[8][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[8][3][1]}.png`,
    },
    {
      label: getNameDay(df[9][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[9][3][1]}.png`,
    },
    {
      label: getNameDay(df[10][0][1]),
      image: `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${df[10][3][1]}.png`,
    },
  ];

  // Plugin personnalisé pour ajouter les images et les labels sur l'axe X
  const customLabelPlugin = {
    id: "customLabelPlugin",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;

      // Boucle pour dessiner les images et le texte sous les labels
      labelsWithImages.forEach((item, index) => {
        const x = xAxis.getPixelForTick(index); // Position horizontale du label
        const y = chart.height - 10; // Position verticale ajustée

        // Dessiner l'image
        const image = new Image();
        image.src = item.image;
        image.onload = () => {
          ctx.drawImage(image, x - 12, y - 5, 20, 20); // Dessine l'image (position x et y ajustée)
        };

        // Dessiner le texte sous l'image
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "12px Arial";
        ctx.fillText(item.label, x, y - 10);
      });
    },
  };

  // Détruire l'ancienne instance si elle existe
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Création du graphique
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelsWithImages.map((item) => item.label), // Labels simples pour Chart.js
      datasets: [
        {
          data: [
            Math.floor(convertTemp(parseFloat(df[0][1][1]))),
            Math.floor(convertTemp(parseFloat(df[1][1][1]))),
            Math.floor(convertTemp(parseFloat(df[2][1][1]))),
            Math.floor(convertTemp(parseFloat(df[3][1][1]))),
            Math.floor(convertTemp(parseFloat(df[4][1][1]))),
            Math.floor(convertTemp(parseFloat(df[5][1][1]))),
            Math.floor(convertTemp(parseFloat(df[6][1][1]))),
            Math.floor(convertTemp(parseFloat(df[7][1][1]))),
            Math.floor(convertTemp(parseFloat(df[8][1][1]))),
            Math.floor(convertTemp(parseFloat(df[9][1][1]))),
            Math.floor(convertTemp(parseFloat(df[10][1][1]))),
          ],
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 1)",
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            display: false, // Cache les labels par défaut pour afficher les nôtres
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
    plugins: [customLabelPlugin], // Ajout du plugin personnalisé
  });
}

displayData();
