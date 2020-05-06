import singleDayWeather from '../types/singleDayWeather.js';
import store from '../store/index.js';
import multiDayWeather from '../types/multiDayWeather.js';

const key = "?apikey=cAlRYPG7ZKA5yX9eLLjg2eXghXWyMXK9";
const currentCondUrl = "https://dataservice.accuweather.com/currentconditions/v1/";
const nextFiveDays = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";

export default class info {

    constructor(mainInfo, fiveDayInfo) {
        this.latestResponse = "";
        this.mainInfo = mainInfo;
        this.fiveDayInfo = fiveDayInfo;
    }

    //main current weather display
    renderCurrentWeather(response) {
        this.latestResponse = response;
        let element = document.querySelector('.info');
        let temp = response.Temp[store.state.TemperatureUnit];
        let tempUnit = (store.state.TemperatureUnit == 'Metric') ? 'C' : 'F';
        element.innerHTML = `
            <h2>currently in ${response.Name}:</h2>
            <h3>${response.Text}</h3>
            <img src=https://developer.accuweather.com/sites/default/files/${response.Icon}></img>
            <h3 id="mainTemp">${temp} ${tempUnit}</h3>
            <button id="addFavorite"> Add to favorites</button>
            <button id="removeFavorite" hidden> Remove from favorites</button>
            `;
        this.addButtons(response);
    }

    //additional display- next 5 days 
    renderNextFiveDays(forecasts) {
        let elements = document.querySelectorAll('.square');
        let tempUnit = store.state.TemperatureUnit == 'Metric' ? 'C' : 'F';
        for (let i = 0; i < 5; i++) {
            let dayIcon = forecasts[i].dayIcon < 10 ? "0" + forecasts[i].dayIcon + "-s.png" : forecasts[i].dayIcon + "-s.png";
            let nightIcon = forecasts[i].nightIcon < 10 ? "0" + forecasts[i].nightIcon + "-s.png" : forecasts[i].nightIcon + "-s.png";
            let MinTemp = forecasts[i].MinTemp;
            let MaxTemp = forecasts[i].MaxTemp;
            if (tempUnit == 'C') {
                MinTemp = Math.round((forecasts[i].MinTemp - 32) / 1.8);
                MaxTemp = Math.round((forecasts[i].MaxTemp - 32) / 1.8)
            }
            elements[i].innerHTML = `
            <h3>${forecasts[i].Day}</h3>
            <h4>${forecasts[i].Date}</h4>
            <p id="forecastTemp${i}">${MinTemp} ${tempUnit} - ${MaxTemp} ${tempUnit}</p>
            <p>Day:</p>
            <img src=https://developer.accuweather.com/sites/default/files/${dayIcon}>
            <div>${forecasts[i].dayText}</div>
            <br><br>
            <p>Night:</p>
            <img src=https://developer.accuweather.com/sites/default/files/${nightIcon}>
            <div>${forecasts[i].nightText}</div>
            `
        }
    }

    //favorite add/remove buttons
    addButtons(currentweather) {
        let addFavoriteButton = document.querySelector('#addFavorite');
        let removeFavoriteButton = document.querySelector('#removeFavorite');
        if (store.state.favorites.get(currentweather.Key)) {
            addFavoriteButton.style.display = "none";
            removeFavoriteButton.style.display = "inline-block";
        }

        addFavoriteButton.addEventListener('click', evt => {
            store.dispatch('addItem', currentweather);
            localStorage.favorites = JSON.stringify(Array.from(store.state.favorites.entries()));
            addFavoriteButton.style.display = "none";
            removeFavoriteButton.style.display = "inline-block";
            this.addFavorite(this.latestResponse);
        });

        removeFavoriteButton.addEventListener('click', () => {
            store.dispatch('clearItem', currentweather);
            localStorage.favorites = JSON.stringify(Array.from(store.state.favorites.entries()));
            removeFavoriteButton.style.display = "none";
            addFavoriteButton.style.display = "inline-block";
            this.removeFavorite(currentweather.Key);
        });
    }

    //build favorite display
    addFavorite(currentInfo) {
        let element = document.querySelector('.favorites')
        let temp = currentInfo.Temp[store.state.TemperatureUnit];
        let tempUnit = (store.state.TemperatureUnit == 'Metric') ? 'C' : 'F';
        element.innerHTML = element.innerHTML + `
        <tr id="${currentInfo.Key}tr">
        <th>
            <p>${currentInfo.Name}</p>
        </th>
        <th>
            <img src=https://developer.accuweather.com/sites/default/files/${currentInfo.Icon}></img>
        </th>
        <th>
            <p>${currentInfo.Text}</p>
        </th>
        <th>
            <p id="favoriteForecastTemp">${temp} ${tempUnit}</p>
        </th>
        </tr>
        `;
    }

    //remove favorite line
    removeFavorite(currentCityKey) {
        let favoriteElement = document.getElementById(currentCityKey + "tr");
        favoriteElement.parentElement.removeChild(favoriteElement);
    }

    //display all favorite cities
    //TODO: query from server again when moving to favorites
    displayAll() {
        let element = document.querySelector('.favorites');
        element.innerHTML = "";
        let favoritesMap = store.state.favorites;
        let cities = [...favoritesMap.keys()];
        if (cities.length == 0) {
            element.innerHTML = "you don't have any favorites yet!";
        }
        for (let i = 0; i < cities.length; i++) {
            let city = favoritesMap.get(cities[i]);
            this.addFavorite(city);
        }
        let self = this;
        document.querySelector('.favorites').querySelectorAll('tr').forEach(function (item) {
            item.onclick = function () {
                let favoritesMap = store.state.favorites;
                let cityKey = this.id.substr(0, this.id.length - 2);
                let cityFullInfo = favoritesMap.get(cityKey);
                let city = {cityName: cityFullInfo.Name, cityKey: cityFullInfo.Key};
                let currentUrl = currentCondUrl + cityKey + key;
                let futureUrl = nextFiveDays + cityKey + key;
                self.displayCurrentData(currentUrl, city);
                self.displayFutureData(futureUrl);
                document.querySelector('#href_main').click();
            }.bind(item);
        })
    }

    //API calss
    displayCurrentData(url, city) {
        let self = this;
        fetch(url).then(function (response) {
            return response.json();
        })
            .then(function (jsonResponse) {
                let cityInfo = new singleDayWeather(jsonResponse[0], city);
                self.mainInfo.updateResponse(cityInfo);
                self.renderCurrentWeather(cityInfo);
            })
            .catch(function (response) {
                console.log('cant display current Weather', response);
                let forcast = document.querySelector('.forcast');
                forcast.innerHTML = "can't display the weather! " + response;
            });
    }

    displayFutureData(url) {
        let self = this;
        fetch(url).then(function (response) {
            return response.json();
        })
            .then(function (jsonResponse) {
                let info = jsonResponse.DailyForecasts;
                let array = [];
                info.forEach(day => {
                    array.push(new multiDayWeather(day))
                })
                self.fiveDayInfo.updateForecasts(array);
                self.renderNextFiveDays(array);
            })
            .catch(function (response) {
                console.log('cant display future Weather', response);
            });
    }

}