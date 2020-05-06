export default class singleDayWeather {
    constructor(cityJson, city) {
        let today = new Date(cityJson.LocalObservationDateTime);
        this.Date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        this.Name = city.cityName;
        this.Key = city.cityKey;
        this.Temp = {Metric: cityJson.Temperature.Metric.Value, Imperial: cityJson.Temperature.Imperial.Value}
        this.Icon = cityJson.WeatherIcon < 10 ? "0" + cityJson.WeatherIcon + "-s.png" : cityJson.WeatherIcon + "-s.png";
        this.Text = cityJson.WeatherText;
        this.Link = cityJson.Link;
    }
}