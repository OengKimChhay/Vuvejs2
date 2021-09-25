import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import auth from './modules/auth.js';
import category from './modules/category.js';

const store = new Vuex.Store({
    modules:{
        auth,
        category
    }
});

export default store;
