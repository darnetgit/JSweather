export default class multiDayWeather {
    constructor(dailyJSON) {
        let today = new Date(dailyJSON.Date);
        this.Date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        this.Day = today.toLocaleDateString('en-US', {weekday: 'long'})
        this.MinTemp = dailyJSON.Temperature.Minimum.Value;
        this.MaxTemp = dailyJSON.Temperature.Maximum.Value;
        this.dayIcon = dailyJSON.Day.Icon;
        this.dayText = dailyJSON.Day.IconPhrase;
        this.nightIcon = dailyJSON.Night.Icon;
        this.nightText = dailyJSON.Night.IconPhrase;
        this.link = dailyJSON.Link;
    }
}