const form = document.getElementById("weatherForm");

function KelvinToCelsius(fahrenheit) {
    return (fahrenheit -273.15);
}

form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    const container = document.getElementsByClassName("container");
    const mainContainer= container[0];
    
    const dis = document.getElementById("weatherDisplay");
    if(dis){
        dis.remove();
    }

    const formData = new FormData(event.target);
    const city = formData.get("cityInput");

    try{
        const response = await fetch("/weatherData",{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(city)
        });
        if(response.ok){
            const weatherData = await response.json();

            const displayArea = document.createElement("div");
            displayArea.id = "weatherDisplay";
            displayArea.className = "displayArea";


            const location = document.createElement("h2");
            location.innerText = `${city}, ${weatherData.sys.country}`;

            const ul = document.createElement("ul");
            ul.innerHTML = 
            `<li>Coordinates: ${weatherData.coord.lon}, ${weatherData.coord.lat}</li>
            <li>Weather Condition: ${weatherData.weather[0].description}</li>
            <li>Temperature: ${KelvinToCelsius(weatherData.main.temp).toFixed(2)}°C</li>
            <li>Feels Like: ${KelvinToCelsius(weatherData.main.feels_like).toFixed(2)}°C</li>
            <li>Min_temp: ${KelvinToCelsius(weatherData.main.temp_min).toFixed(2)}°C</li>
            <li>Max_temp: ${KelvinToCelsius(weatherData.main.temp_max).toFixed(2)}°C</li>
            <li>Wind Speed: ${weatherData.wind.speed}</li>`;

            displayArea.insertAdjacentElement("beforeend",location);
            displayArea.insertAdjacentElement("beforeend",ul);

            mainContainer.insertAdjacentElement("beforeend",displayArea);
            event.target.reset();
        }
        else{
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    }
    catch(err){
        console.log(err);
    }
})