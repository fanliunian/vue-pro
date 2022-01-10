import Vue from 'vue';
import Vuex from 'vuex';
import admin from './modules/admin';
import menu from "./modules/menu";
// import getters from "./getters";

Vue.use(Vuex);

let store = new Vuex.Store({
    modules: {
        admin,
        menu
    },
})
export default store;
