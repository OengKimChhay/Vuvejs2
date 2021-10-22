import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import auth from './modules/auth.js';
import category from './modules/category.js';
import product from './modules/product.js';
import table from './modules/table.js';

const store = new Vuex.Store({
    modules:{
        auth,
        category,
        product,
        table
    },
});

export default store;
