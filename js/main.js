import store from './store/index.js';
import mainInfo from './components/mainInfo.js';
import fiveDayInfo from './components/5dayInfo.js';
import Autocomplete from './components/autoComplete.js';
import errorService from './services/errorService.js';
import info from './services/getInfo.js';
import Favorites from './components/favorites.js'

const key = "?apikey=cAlRYPG7ZKA5yX9eLLjg2eXghXWyMXK9";
const currentCondUrl = "https://dataservice.accuweather.com/currentconditions/v1/";
const nextFiveDays = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";
const latLong = "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search";

const autoComplete = new Autocomplete();
const maininfo = new mainInfo();
const fiveDayinfo = new fiveDayInfo();
const Favoritesד = new Favorites();
const weatherInfo = new info(maininfo, fiveDayinfo);
const errorservice = new errorService();

const favorites = document.querySelector('.favorites');
const search = document.querySelector('.search');
const forcast = document.querySelector('.forcast');
const infoDiv = document.querySelector('.info');
const mainButton = document.querySelector('#href_main');
const favoritesButton = document.querySelector('#href_favorites');
const searchInput = document.getElementById('searchBox');
const changeTheme = document.getElementById('changeTheme');
const changeTempUnit = document.getElementById('changeTempUnit');

//load favorites from localstorage
store.state.favorites = localStorage.favorites ? new Map(JSON.parse(localStorage.favorites)) : new Map();

//menu buttons
mainButton.classList.add("darkBlue");
favoritesButton.addEventListener('click', evt => {
    search.style.display = "none";
    forcast.style.display = "none";
    infoDiv.style.display = "none";
    favorites.style.display = "block";
    weatherInfo.displayAll();
    favoritesButton.classList.add("darkBlue");
    mainButton.classList.remove("darkBlue");
});
mainButton.addEventListener('click', evt => {
    search.style.display = "";
    forcast.style.display = "";
    infoDiv.style.display = "";
    favorites.style.display = "none";
    favoritesButton.classList.remove("darkBlue");
    mainButton.classList.add("darkBlue");
});

//toggles
changeTheme.addEventListener('change', function (event) {
    (event.target.checked) ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
});

changeTempUnit.addEventListener('click', function () {
    let payload;
    if (store.state.TemperatureUnit == 'Metric') {
        payload = 'Imperial';
    } else {
        payload = 'Metric';
    }
    store.dispatch('changeTempUnit', payload);
});

//search events
// create one global XHR object so we can abort old requests when a new one is make
window.hinterXHR = new XMLHttpRequest();
// Add a keyup event listener to our input element
searchInput.addEventListener("keyup", function (event) {
    autoComplete.hinter(event, window.hinterXHR);
});

function displayPage(currentUrl,city,futureUrl){
    weatherInfo.displayCurrentData(currentUrl,city);
    weatherInfo.displayFutureData(futureUrl)
}
function displayTelAviv(){
    let city={cityName:"Tel Aviv", cityKey:"215854"};
    let currentUrl=currentCondUrl+"215854"+key;
    let futureUrl=nextFiveDays+"215854"+key;
    displayPage(currentUrl,city,futureUrl)
}

searchInput.addEventListener("input", function (e) {
        let isInputEvent = (Object.prototype.toString.call(e).indexOf("InputEvent") > -1);
        if (!isInputEvent) {
            let dataListId = document.getElementById('searchBoxResults').options.namedItem(e.target.value);
            if (dataListId && dataListId.value.toLowerCase() == searchInput.value.toLowerCase()) {
                let city = {cityName: dataListId.value, cityKey: dataListId.name};
                let currentUrl = currentCondUrl + city.cityKey + key;
                let futureUrl = nextFiveDays + city.cityKey + key;
                displayPage(currentUrl,city,futureUrl);
            } else {
                alert('please select city from the dropdown list')
            }
        }
    }, false
);

//on entry- get current location and display the weather. if failed, display Tel Aviv.
navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let url = latLong + key + "&q=" + lat + "%2C" + long;
    fetch(url).then(function (response) {
        return response.json();
    })
        .then(function (jsonResponse) {
            let city = {cityName: jsonResponse.LocalizedName, cityKey: jsonResponse.Key};
            let currentUrl = currentCondUrl + city.cityKey + key;
            let futureUrl = nextFiveDays + city.cityKey + key;
            displayPage(currentUrl,city,futureUrl);
        })
        .catch(function () {
            displayTelAviv();
        });
}, function () {
    displayTelAviv();
});

// Initial renders
maininfo.render();
