import Component from '../lib/component.js';
import store from '../store/index.js';

export default class fiveDayInfo extends Component {
    constructor() {
        super({
            store
        });
        this.latestForcasts;
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        if (this.latestForcasts != null) {
            let tempUnit = store.state.TemperatureUnit == 'Metric' ? 'C' : 'F';
            for (let i = 0; i < 5; i++) {
                let tempElement = document.getElementById('forecastTemp' + i);
                let MinTemp = this.latestForcasts[i].MinTemp;
                let MaxTemp = this.latestForcasts[i].MaxTemp;
                if (tempUnit == 'C') {
                    MinTemp = Math.round((this.latestForcasts[i].MinTemp - 32) / 1.8);
                    MaxTemp = Math.round((this.latestForcasts[i].MaxTemp - 32) / 1.8)
                }
                tempElement.innerHTML = `${MinTemp} ${tempUnit} - ${MaxTemp} ${tempUnit}`;
            }
        }
    }

    updateForecasts(response) {
        this.latestForcasts = response;
    }

}