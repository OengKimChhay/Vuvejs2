
import http from '@/axiosAPI/axios.js';
import router from '@/route/index';

const auth = {
    namespaced: true,
    state:{
        Users: [],
        Errors: [],
        Success:"",
        Loginerror:"",
        Token: sessionStorage.getItem('access_token') || null, //false is for to check if user not login will redirect to login route
    },
    getters:{
        Allusers(state){
            return state.Users;
        },
        Allerrors(state){
            return state.Errors;
        },
        Success(state){
            return state.Success;
        },
        Loginerrors(state){
            return state.Loginerror;
        },
        loggedIn(state){
            return state.Token === null
        }
    },
    mutations:{
        ADD_USER(state,formData){
            state.Users = formData;
        },
        UPDATE_USERS(state,formData){
            state.Users = formData;
        },
        GET_USERS(state,payload){
            state.Users = payload;
        },
        GET_ERRORS(state,error){
            state.Errors = error;
        },
        SUCCESS(state,payload){
            state.Success = payload;
        },
        LOGIN_ERROR(state,erro){
            state.Loginerror = erro;
        },
        AUTH(state,accessToken){
            state.Token = accessToken;
        },
        UNAUTH(state){
            state.Token = null;
        }
    },
    actions:{
        addUsers({commit},formData,config){
            http.post("/register",formData,config).then((response)=>{
                if(response.data.status ==='success'){
                    commit("ADD_USER",formData); //we have to commit data otherwise formData won't be pass to route 
                    commit('SUCCESS',response.data.message);
                    setTimeout(function(){
                        router.push({name: 'UserList'});
                        window.location.reload();
                    },3000);
                }else{
                    commit("GET_ERRORS",response.data.message);
                }
            })
            .catch(error=>{
                if(error){
                    commit("GET_ERRORS",error.response.data.errors);
                }
            })
        },
        getUsers({commit}){
            http.get("/auth/GetUserData").then((response)=>{
                commit("GET_USERS",response.data);
            })
            .catch((error)=>{
                console.log(error.response);
            })
        },
        checkLogin({commit}){
            commit('AUTH',sessionStorage.getItem('access_token'));
        },
        udpateUsers({commit}, {userID, formData, config}){
            http.post("/auth/update/"+userID, formData, config).then((response)=>{
                if(response.data.status ==='success'){
                    commit("UPDATE_USERS",formData);
                    commit('SUCCESS',response.data.message);
                    setTimeout(function(){
                        window.location.reload(); //to reload page
                    },3000);
                }else{
                    commit("GET_ERRORS",response.data.message);
                }
            })
            .catch((error)=>{
                if(error){
                    commit("GET_ERRORS",error.response.data.errors);
                }
            })
        },
        loginUser({commit}, formData){
                http.post("/login",formData).then((response)=>{
                    if(response.data.status === 'success'){
                        //set token
                        const token = response.data.token;
                        sessionStorage.setItem('access_token',token);
                        sessionStorage.setItem('user',response.data.user);
                        commit('AUTH',token); 
                        router.push({name:'Dashboard'});
                        router.go();
                    }else{
                        commit("LOGIN_ERROR",response.data.message);
                    }
                })
                .catch((error)=>{
                    if(error){
                        commit('UNAUTH');
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('user');
                        commit("GET_ERRORS",error.response.data.errors);
                    }
                });
        },
        logoutUser({commit}){
                http.post("/auth/logout").then((response)=>{
                    if(response.data.status === "success"){
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('user');
                        commit('UNAUTH');
                        router.push({name:'Login'});
                        window.location.reload();
                    }else{
                        commit("LOGIN_ERROR",response.data.message);
                    }
                })
                .catch((error)=>{
                    if(error){
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('user');
                        commit('UNAUTH');
                        commit("GET_ERRORS",error.response.data.errors);
                    }
                });
        },
        deleteUsers({commit},userID){
            http.delete("/auth/delete/"+userID).then((response)=>{
                if(response.data.status === 'success'){
                    commit("SUCCESS",response);
                    router.go(); //to reload page
                }
                else if(response.data.status ==='fail'){
                    commit("GET_ERRORS",response.data.message);
                }
            })
            .catch((error)=>{
                console.log(error.response);
            });
        }
    },
}
export default auth