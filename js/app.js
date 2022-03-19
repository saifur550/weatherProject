// window.navigator.geolocation.getCurrentPosition()

function $(id){
    return document.querySelector(id)
}

const key = "f64f157b7259a274b9d1d28e34b737ed";
let weatherInfo = {};


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        ({coords})=>{
            const lat = coords.latitude;
            const lon = coords.longitude
            const urlKey = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
            fetch(urlKey)
            .then(res => res.json())
            .then(data=> {
                // console.log(data);

                const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                const cityAndCountry = data.name + ", "+ data.sys.country;
                const condition = data.weather[0].description;
                const kelvinTemp = data.main.temp - 273.15;
                const humidity =data.main.humidity ;
                const pressure = data.main.pressure;

                weatherInfo={
                    icon,
                    cityAndCountry,
                    condition,
                    kelvinTemp,
                    humidity,
                    pressure
                };

            })
            .catch (err => console.log(err))
            .finally(()=> {
                // console.log(weatherInfo);
                DataDisplay()
            })

    } , (err)=>{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${key}`;
        fetch(url)
        .then(res => res.json())
        .then(data=> {
            const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` //;
            const cityAndCountry = data.name + ", "+ data.sys.country;
            const condition = data.weather[0].description;
            const kelvinTemp = data.main.temp - 273.15;
            const humidity =data.main.humidity ;
            const pressure = data.main.pressure;

            weatherInfo={
                icon,
                cityAndCountry,
                condition,
                kelvinTemp,
                humidity,
                pressure
            };

         
            

        })
        .catch (err => console.log(err))
        .finally(()=> {
            console.log(weatherInfo);
            DataDisplay()
        })
    })
}

//http://openweathermap.org/img/wn/10d@2x.png
function DataDisplay(){
       
        $('#img').src = weatherInfo.icon;
        $('#cityName').innerHTML = weatherInfo.cityAndCountry;
        $('#condition').innerHTML = weatherInfo.condition;
        $('#temp').innerHTML = weatherInfo.kelvinTemp.toFixed(2);
        $('#pressure').innerHTML = weatherInfo.pressure;
        $('#humidity').innerHTML = weatherInfo.humidity;

}


$('#searchBtn').addEventListener('click', function(){
    console.log('click');

    const searchInput = $('#searchInput').value;
    
    if(!searchInput) return;
    console.log(searchInput);
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${key}`;

  
    fetch(url)
    .then(res => res.json())
    .then(data=> {
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` //;
        const cityAndCountry = data.name + ", "+ data.sys.country;
        const condition = data.weather[0].description;
        const kelvinTemp = data.main.temp - 273.15;
        const humidity =data.main.humidity ;
        const pressure = data.main.pressure;

        weatherInfo={
            icon,
            cityAndCountry,
            condition,
            kelvinTemp,
            humidity,
            pressure
        };

        
        const historyList = document.querySelectorAll('.history');
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="history">
            <div>
            <img class="search-img"   src =${icon} />
            </div>
            <div>
            <h3 id="">${cityAndCountry}</h3>
            <p id="condition">${condition}</p>
             Temp: <span id="temp">${kelvinTemp.toFixed(2)}</span> &#176;c , 
            Pressure : <span id="pressure">${pressure}</span> , 
            Humidity : <span id="humidity">${humidity}</span>.
            </div>
        </div>
        `; 


        const history = getDataFromLocalStorage();
        if(history.length === 4){
            historyList[3].remove()
            history.pop()
            history.unshift(weatherInfo);
        }else{

            history.unshift(weatherInfo);
        }
        $('.search__history').insertAdjacentElement('afterbegin', div)
        localStorage.setItem('weather', JSON.stringify(history))

    })
    .catch (e => {
        alert('Plz Enter the Valid City Name')
    })
    .finally(()=> {
        // console.log(weatherInfo);
        $('#searchInput').value ='';
        DataDisplay()

    })
   
   
})



function getDataFromLocalStorage(){
    const data = localStorage.getItem('weather');
    let weather = [];
    if(data){
        weather = JSON.parse(data)
    }
    return weather;
}


window.onload = function(){
    const history = getDataFromLocalStorage();
    history.forEach(h=>{
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="history">
            <div>
            <img class="search-img"   src =${h.icon} />
            </div>
            <div>
            <h3 id="">${h.cityAndCountry}</h3>
            <p id="condition">${h.condition}</p>
             Temp: <span id="temp">${h.kelvinTemp.toFixed(2)}</span> &#176;c , 
            Pressure : <span id="pressure">${h.pressure}</span> , 
            Humidity : <span id="humidity">${h.humidity}</span>.
            </div>
        </div>
        `;

        $('.search__history').appendChild(div)
    })
}



