
import http from '@/axiosAPI/axios.js';
import router from '@/route/index';

const auth = {
    namespaced: true,
    state:{
        Products: [],
        Allproducts:[],
        Errors: [],
        Success:"",
    },
    getters:{
        Allproducts(state){
            return state.Products;
        },
        GetAllproducts(state){
            return state.Allproducts;
        },
        Allerrors(state){
            return state.Errors;
        },
        Success(state){
            return state.Success;
        },
    },
    mutations:{
        ADD_PRODUCT(state,formData){
            state.Products = formData;
        },
        UPDATE_PRODUCT(state,formData){
            state.Products = formData; 
        },
        GET_PRODUCT(state,product){
            state.Products = product;
        },
        GET_ALL_PRODUCT(state,allproduct){
            state.Allproducts = allproduct;
        },
        GET_ERRORS(state,error){
            state.Errors = error;
        },
        SUCCESS(state,payload){
            state.Success = payload;
        },
    },
    actions:{
        addProduct({commit},formData,config){
            http.post("/ui/product",formData,config).then((response)=>{
                if(response.data.status ==='success'){
                    commit("ADD_PRODUCT",formData); //we have to commit data otherwise formData won't be pass to route 
                    commit('SUCCESS',response.data.message);
                    setTimeout(function(){
                        router.push({name: 'ProductList'});
                        window.location.reload();
                    },3000);
                }else{
                    commit("GET_ERRORS",response.data.message);
                }
            })
            .catch(error=>{
                if(error){
                    commit("GET_ERRORS",error.response.data.errors);
                    console.log(error.response)
                }
            })
        },
        getProduct({commit},page){ //this method is get product with pagiantion for dispaly in product list
            http.get("/ui/product?page="+ page).then((response)=>{
                commit("GET_PRODUCT",response.data); 
            })
            .catch((error)=>{ 
                console.log(error.response);
            })
        },
        getAllProduct({commit}){ //this method is get all product for display in pos
            http.get("/ui/allproduct").then((response)=>{
                commit("GET_ALL_PRODUCT",response.data); 
            })
            .catch((error)=>{ 
                console.log(error.response);
            })
        },
        udpateProducts({commit},{productID,formData,config}){
            http.post('/ui/product/'+productID, formData, config).then((response)=>{
                if(response.data.status ==='success'){
                    commit("UPDATE_PRODUCT",formData);
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
                    console.log(error.response);
                }
            });
        },
        deleteProducts({commit},productID){
            http.delete("/ui/product/"+productID).then((response)=>{
                if(response.data.status === 'success'){
                    commit("SUCCESS",response);
                    window.location.reload(); //to reload page
                }
                else if(response.data.status ==='fail'){
                    commit("GET_ERRORS",response.data.message);
                }
            })
            .catch((error)=>{
                console.log(error.response);
            });
        },
    },
}


export default auth;