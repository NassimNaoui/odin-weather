import { addDays, format } from "date-fns";

async function getWeatherData(location) {
  const apiKey = "2JDU5JUVGRGN43C3TYQ4ZTMYG";
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");
  const dateInTenDays = addDays(new Date(), 10);
  const formattedTenDays = format(dateInTenDays, "yyyy-MM-dd");

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedDate}/${formattedTenDays}?key=${apiKey}`
    );
    const allWeatherData = await response.json();
    console.log(allWeatherData);
    createNewDataframe(allWeatherData);
  } catch (error) {
    console.log(error);
  }
}

function convertTemp(f) {
  const c = ((f - 32) * 5) / 9;
}

function createNewDataframe(df) {
  const dataElement = ["datetime", "temp", "conditions", "icon"];
  const countdays = Object.keys(df.days).length;
  const lenKeysDays = Object.keys(df.days[0]).length;
  let newDf = [];

  for (let i = 0; i < countdays; i++) {
    const dayArray = [];
    newDf.push(dayArray);
    for (let j = 0; j < lenKeysDays; j++) {
      for (let k = 0; k < dataElement.length; k++) {
        if (Object.keys(df.days[i])[j] === dataElement[k]) {
          newDf[i].push(Object.entries(df.days[i])[j]);
        }
      }
    }
  }

  newDf[countdays] = Object.entries(df).filter((key) => key[0] === "address");
  console.log(newDf);
  return newDf;
}

getWeatherData("Paris");
