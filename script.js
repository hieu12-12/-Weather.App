const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

let cityInput = "Orlando"; // Default city

// Function to fetch and display weather data
function fetchWeatherData() {
    const apiKey = "75a7d325123248d8bd304736241210"; // Your API key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Update DOM with weather data
            temp.innerHTML = `${data.current.temp_f}&#176;`;
            conditionOutput.innerHTML = data.current.condition.text;
            nameOutput.innerHTML = data.location.name;

            // Extract date and time
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);
            
            // Display formatted date and time
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/${y}`;
            timeOutput.innerHTML = time;

            // Update weather details
            icon.src = data.current.condition.icon;
            cloudOutput.innerHTML = `${data.current.cloud}%`;
            humidityOutput.innerHTML = `${data.current.humidity}%`;
            windOutput.innerHTML = `${data.current.wind_kph} km/h`;

            // Determine day/night and weather background
            updateBackground(data);

            // Fade in after data loads
            app.style.opacity = "1";
        })
        .catch(err => {
            alert("City not found, please try again");
            app.style.opacity = "1";
        });
}

// Utility function to get the day of the week
function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

// Function to update background based on weather condition
function updateBackground(data) {
    let timeOfDay = data.current.is_day ? "day" : "night";
    const conditionCode = data.current.condition.code;

    if (conditionCode === 1000) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        btn.style.background = timeOfDay === "day" ? "#e5ba92" : "#181e27";
    } else if (
        [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1287].includes(conditionCode)
    ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = timeOfDay === "day" ? "#fa6d1d" : "#181e27";
    } else if (
        [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(conditionCode)
    ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = timeOfDay === "day" ? "#647d75" : "#325c80";
    } else {
        app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = timeOfDay === "day" ? "#4d72aa" : "#1b1b1b";
    }
}

// Event listener for clicking on cities from the list
cities.forEach(city => {
    city.addEventListener("click", (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0"; // Fade out before loading new data
    });
});

// Event listener for search form submission
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (search.value.trim().length === 0) {
        alert("Please type in a city name");
    } else {
        cityInput = search.value.trim();
        fetchWeatherData();
        search.value = ""; // Clear the search input
        app.style.opacity = "0"; // Fade out before loading new data
    }
});

// Fetch default weather data for the initial city
fetchWeatherData();





