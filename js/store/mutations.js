export default {
    addItem(state, payload) {
        state.favorites.set(payload.Key,payload)
        return state;
    },
    clearItem(state, payload) {
        state.favorites.delete(payload.Key);
        return state;
    },
    changeTempUnit(state,payload){
        if(state.TemperatureUnit!=payload){
            state.TemperatureUnit=payload;   
        }
        return state;
    }
};
