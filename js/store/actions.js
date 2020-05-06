export default {
    addItem(context, payload) {
        context.commit('addItem', payload);
    },
    clearItem(context, payload) {
        context.commit('clearItem', payload);
    },
    changeTempUnit(context,payload) {
        context.commit('changeTempUnit',payload);
    }
};
