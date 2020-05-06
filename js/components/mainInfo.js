import Component from '../lib/component.js';
import store from '../store/index.js';

export default class mainInfo extends Component {
    // Pass our store instance and the HTML element up to the parent Component
    constructor() {
        super({
            store
        });
        this.latestResponse;
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        if (this.latestResponse != null) {
            let temp = this.latestResponse.Temp[store.state.TemperatureUnit];
            let tempUnit = (store.state.TemperatureUnit == 'Metric') ? 'C' : 'F';
            let tempElement = document.getElementById('mainTemp');
            tempElement.innerHTML = `${temp} ${tempUnit}`
        }

    };

    updateResponse(response) {
        this.latestResponse = response;
    }
};
