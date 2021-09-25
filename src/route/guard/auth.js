// import route from '@/route/index.js';
// import store from '@/store/modules/auth';

// route.beforeEach((to, from, next) => {
//     console.log(!store.getters.loggedIn);
//     var requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//     if(requiresAuth){ //check if each route has requiresAuth:true; and if toke is empty or null 
//         if(!store.getters.loggedIn){
//             next({name: 'Login'}); 
//         }else{
//             next();
//         }
//     }else{ 
//         next();
//     }
// });

