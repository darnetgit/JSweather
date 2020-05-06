import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Favorites extends Component {
    constructor() {
        super({
            store
        });
    }

    /**
     * React to state changes and render the component's HTML
     *
     * @returns {void}
     */
    render() {
        let favoritesMap = store.state.favorites;
        let cities = [...favoritesMap.keys()];
        for (let i = 0; i < cities.length; i++) {
            if (document.getElementById(cities[i] + "tr")) {
                let rowElement = document.getElementById(cities[i] + "tr");
                let tempElement = rowElement.lastElementChild.lastElementChild;
                let temp = store.state.favorites.get(cities[i]).Temp[store.state.TemperatureUnit];
                let tempUnit = (store.state.TemperatureUnit == 'Metric') ? 'C' : 'F';
                tempElement.innerHTML = `${temp} ${tempUnit}`;
            }
        }
    }
}
