<template>
    <div>
		<h5 class="title">Dashboard</h5>
		<div class="row">
            <div class="col-lg-3 col-6">
                <md-content class="md-elevation-4" style="padding:15px; border-radius:4px;">
                    <h4 v-if="Allusers.length >1 ">Users <i style="margin-left:5px;" class="fas fa-users"></i></h4>
                    <h4 v-else>User <b-avatar class="ml-3"></b-avatar></h4>
                    <div class="d-flex">
                        <h5 style="margin-left:5px">{{Allusers.length}}</h5>
                    </div>
                    <router-link :to="{name: 'UserList'}">More info</router-link>
                </md-content>
            </div>
            <div class="col-lg-3 col-6">
                <md-content class="md-elevation-4" style="padding:15px; border-radius:4px;">
                    <h4 v-if="Allcategoires.length >1 ">Categories<i style="margin-left:5px;" class="fas fa-list"></i></h4>
                    <h4 v-else>Category<i style="margin-left:5px;" class="fas fa-list"></i></h4>
                    <div class="d-flex">
                        <h5 style="margin-left:5px">{{Allcategoires.length}}</h5>
                    </div>
                    <router-link :to="{name: 'CategoryList'}">More info</router-link>
                </md-content>
            </div>
            <div class="col-lg-3 col-6">
                <md-content class="md-elevation-4" style="padding:15px; border-radius:4px;">
                    <h4>Products<i style="margin-left:5px;" class="fas fa-sitemap"></i></h4>
                    <div class="d-flex">
                        <h5>{{Allproducts.length}}</h5>
                    </div>
                    <router-link :to="{name: 'ProductList'}">More info</router-link>
                </md-content>
            </div>
        </div>
	</div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
export default {
    name: 'Dashboard',
    computed:{
        ...mapGetters('auth',['Allusers']),
        ...mapGetters('category',['Allcategoires']),
        ...mapGetters('product',['Allproducts']),
    },
    methods:{
        ...mapActions('auth',['getUsers']),
        ...mapActions('category',['getCategoies']),
        ...mapActions('product',['getProduct']),
    },
    mounted(){
        this.getUsers();   //call this mehtod from ...mapActions if  we not mouted users will not found
        this.getCategoies();
        this.getProduct();
    },
}
</script>

<style>
.title{
	padding: 30px 0;
}
</style>