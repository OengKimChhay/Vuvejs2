
import http from '@/axiosAPI/axios.js';
import router from '@/route/index';
const category = {
    namespaced: true,
    state:{
        Categories: [],
        Errors: [],
        Success:"",
    },
    mutations:{
        ADD_CATEGORY:(state,data)=>{
            state.Categories = data;
        },
        GET_CATEGORY:(state,data)=>{
            state.Categories = data;
        },
        UDATE_CATEGORY:(state,data)=>{
            state.Categories = data;
        },
        GET_ERRORS:(state,error)=>{
            state.Errors = error;
        },
        SUCCESS:(state,success)=>{
            state.Success = success;
            console.log(state.Success);
        }
    },
    actions:{
        addCategoies: ({commit,state},formData) =>{
            http.post("/ui/category",formData)
            .then((response)=>{
                if(response.data.status ==='success'){
                    state.Errors = "";
                    commit("ADD_CATEGORY",formData); //we have to commit data otherwise formData won't be pass to route 
                    commit("SUCCESS",response.data.message);
                    setTimeout(function(){
                        router.push({name: 'CategoryList'}); 
                        window.location.reload();//reload page after go to another route;
                    },3000);
                }else if(response.data.status ==='fail'){
                    commit("GET_ERRORS",response.data.message);
                }
                console.log(response.data);
            })
            .catch(error=>{
                if(error){
                    commit("GET_ERRORS",error.response.data.errors);
                    console.log(error.response.data);
                }
            })
        },
        deleteCategoies: ({commit,state},catID) =>{
            http.delete("/ui/category/"+catID)
            .then((response)=>{
                state.Errors = "";
                console.log(response.data);
                commit("SUCCESS",response.data.message);
                router.go(); //to reload page
                
            })
            .catch((error)=>{
                console.log(error.response)
            })
        },
        updateCategoies: ({commit}, {categoryID, formData}) => {
            http.post("/ui/category/"+categoryID, formData) //we use post req instead of put coz vue dont understand put but if we want to update we have to add 'method':'_PUT'in form data when edit
            .then((response)=>{
                console.log(response.data);
                commit("UDATE_CATEGORY",formData);
                commit("SUCCESS",response.data.message);
                setTimeout(function(){
                    window.location.reload(); //to reload page
                },3000);
            })
            .catch((error)=>{
                if(error){
                    commit("GET_ERRORS",error.response.data.errors);
                    console.log(error.response);
                }
            })
        },
        getCategoies: ({commit}) =>{
            http.get("/ui/category")
            .then((response)=>{
                commit("GET_CATEGORY",response.data);
            })
            .catch((error)=>{
                console.log(error)
            })
        },
    },
    getters:{
        Allcategoires: (state) => {
            return state.Categories;
        },
        Allerrors: (state) => {
            return state.Errors;
        },
        Success: (state) =>{
            return state.Success;
        }
    }
}
export default category