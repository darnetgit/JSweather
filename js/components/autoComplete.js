const key = "?apikey=cAlRYPG7ZKA5yX9eLLjg2eXghXWyMXK9";
const complete = "https://dataservice.accuweather.com/locations/v1/cities/autocomplete";

export default class Autocomplete {
    constructor() {
    };

    // Autocomplete for form
    hinter(event, hinterXHR) {
        // retireve the input element
        let input = event.target;
        // retrieve the datalist element
        let searchBoxResults = document.getElementById('searchBoxResults');
        // minimum number of characters before we start to generate suggestions
        let min_characters = 1;
        if (input.value.length < min_characters) {
            return;
        } else {
            let url = complete + key + "&q=" + input.value;
            // abort any pending requests
            hinterXHR.abort();
            hinterXHR.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    // We're expecting a json response so we convert it to an object
                    var response = JSON.parse(this.responseText);
                    response = response.map((elem => {
                        return {LocalizedName: elem.LocalizedName + ", " + elem.Country.LocalizedName, Key: elem.Key};
                    }))
                    // clear any previously loaded options in the datalist
                    searchBoxResults.innerHTML = "";
                    response.forEach(function (item) {
                        // Create a new <option> element.
                        var option = document.createElement('option');
                        option.value = item.LocalizedName;
                        option.id = item.LocalizedName;
                        option.name = item.Key;
                        // attach the option to the datalist element
                        searchBoxResults.appendChild(option);
                        searchBoxResults.focus();
                    });
                }
            };
            hinterXHR.open("GET", url, true);
            hinterXHR.send()
        }
    }
}