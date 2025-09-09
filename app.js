const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-btn");
const notFoundPart = document.querySelector(".not-found");
const searchCityPart = document.querySelector(".search-city");
const weatherInfoPart = document.querySelector(".weather-info");
const countryText = document.querySelector(".country");
const temperature = document.querySelector(".temp-text");
const conditionC = document.querySelector(".condition");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");
const weatherImage = document.querySelector(".weather-image");
const currentDayDate = document.querySelector(".current-day-date");
const forecastItemsContainer = document.querySelector(".forecast-items-container");

const weatherApi = "963c2d397b88afe5203660b534632d19";

searchBtn.addEventListener("click",() => {
    if(cityInput.value.trim() != ""){
     updateWeatherInfo(cityInput.value);
    cityInput.value="";
    cityInput.blur();
}})
cityInput.addEventListener("keydown",(event)=>{
    if(event.key == "Enter" && cityInput.value.trim() != ""){
       updateWeatherInfo(cityInput.value);
        cityInput.value="";
        cityInput.blur();
    }
}
)
async function getFetchData(endPoint, city){
         const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${weatherApi}&units=metric`;
         const response = await fetch(apiUrl);

         return response.json();
}

         function getWeatherIcon(id) {
          if (id >= 200 && id <= 232) return "thunderstorm.svg";
          if (id >= 300 && id <= 321) return "drizzle.svg";
          if (id >= 500 && id <= 531) return "rain.svg";
          if (id >= 600 && id <= 622) return "snow.svg";
          if (id >= 701 && id <= 781) return "atmosphere.svg";
          if (id === 800) return "clear.svg";
        else  return "clouds.svg";
}
        function getCurrentDate(){
            const currentDate = new Date();
            const options = {
                weekday : "short",
                day : "2-digit",
                month: "short",
            }
            return currentDate.toLocaleDateString("en-GB",options);
        }

async function updateWeatherInfo(city) {
        const weatherData = await getFetchData("weather",city);

        if (weatherData.cod != 200){
            showDisplaySection(notFoundPart);
            return;
        }
        console.log(weatherData);
        
        const{
            name:country,
            main:{temp,humidity},
            weather:[{id,main:condition}],
            wind:{speed} 
        } = weatherData
        
        countryText.textContent = country;
        temperature.textContent =( Math.round(temp) + "°C");
        conditionC.textContent = condition;
        humidityValue.textContent = (humidity + "%");
        windValue.textContent =( speed + "M/s");
         

        currentDayDate.textContent = getCurrentDate();
        

         weatherImage.src = `weather/${getWeatherIcon(id)}`;
         setWeatherAnimation(id);  

        await updateForecastsInfo(city);
        showDisplaySection(weatherInfoPart);
    }
        async function updateForecastsInfo(city) {
            const forecastsData = await getFetchData("forecast",city);

            const timeTaken = "12:00:00";
            const todayDate = new Date().toISOString().split("T");
            
            


             forecastItemsContainer.innerHTML = "";
            forecastsData.list.forEach(forecastWeather =>{
                if(forecastWeather.dt_txt.includes(timeTaken)&&
                   !forecastWeather.dt_txt.includes(todayDate)){
                    updateForecastItems(forecastWeather);  
                }
                
            })
        }

            function  updateForecastItems(weatherData) {
                    
                    const{
                        dt_txt:date,
                        weather:[{id}],
                        main:{ temp }
                    } = weatherData 
                
                   const dateTaken = new Date(date);
                   const dateOption = {
                    day:"2-digit",
                    month:"short"
                   };
                    const dateResult = dateTaken.toLocaleDateString("en-US",dateOption);
                
                 
                   const forecastItem = `
                 <div class="forecast-item">
                    <h5 class="forecast-date condition"> ${dateResult}</h5>
                    <img src="weather/${getWeatherIcon(id)}" alt="" class="forecast-image">
                    <h5 class="forecast-temp"> ${Math.round(temp)}°C </h5>
                </div>
                    ` ;


                forecastItemsContainer.insertAdjacentHTML("beforeend",forecastItem);
                } 
        
function showDisplaySection(section){
    [weatherInfoPart,searchCityPart,notFoundPart]
    .forEach(section => section.style.display = "none");

    section.style.display="flex";
}
function setWeatherAnimation(id) {
    const mainContainer = document.querySelector(".main-container");

    document.body.classList.remove("rainy", "snowy", "thunderstorm","cloudy");
    mainContainer.classList.remove("rainy", "snowy", "thunderstorm","cloudy");

          document.querySelectorAll(".cloud").forEach(el => el.remove());


    if (id >= 500 && id <= 531) {
        document.body.classList.add("rainy");
        mainContainer.classList.add("rainy");
    }
    else if (id >= 600&& id <= 622) {
        document.body.classList.add("snowy");
        mainContainer.classList.add("snowy");
    }
    else if (id >= 200 && id <= 232) {
        document.body.classList.add("rainy");
        mainContainer.classList.add("rainy");
    }
    
    else if (id >= 801&& id <= 804) {   
    document.body.classList.add("cloudy");
    document.querySelector(".main-container").classList.add("cloudy");

   const cloud1 = document.createElement("div");
        cloud1.className = "cloud cloud1";
        document.body.appendChild(cloud1);

        const cloud2 = document.createElement("div");
        cloud2.className = "cloud cloud2";
        document.body.appendChild(cloud2);

        const cloud3 = document.createElement("div");
        cloud3.className = "cloud cloud3";
        document.body.appendChild(cloud3);
    
    }

    else if (id === 800) {
        weatherImage.classList.add("sunny");
    } else {
        weatherImage.classList.remove("sunny");
    }
}






