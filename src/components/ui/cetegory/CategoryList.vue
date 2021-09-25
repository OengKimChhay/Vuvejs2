<template>
    <div>
        <!-- whenever we use child route we have to add router-view to wrappe all parent component -->
        <!-- and router-view plz see in layout/layout -->
        <h5 class="title">Category List <i class="fa fa-dashboard"></i></h5>
        <md-table  md-card v-if="this.Allcategoires.length>0">
            <md-table-toolbar>
                <h1 class="md-title">Category</h1>
                <router-link :to="{name:'CreateCategory'}"><button class="btn btn-secondary btn-sm text-right"><i class="fas fa-plus"></i> Add New Category</button></router-link>
            </md-table-toolbar>

            <md-table-row style="background-color:#ADD8E6;">
                <md-table-head>NO_</md-table-head>
                <md-table-head>Category Name</md-table-head>
                <md-table-head>Created</md-table-head>
                <md-table-head>Updated</md-table-head>
                <md-table-head>Action</md-table-head>
            </md-table-row>

            <md-table-row slot="md-table-row" v-for="(category, index) in this.Allcategoires" :key="category.id">
                <md-table-cell >{{index+1}}</md-table-cell>
                <md-table-cell >{{category.category_name}}</md-table-cell>
                <md-table-cell >{{category.created_at | formatDate}}</md-table-cell>
                <md-table-cell >{{category.updated_at | formatDate}}</md-table-cell>
                <md-table-cell>
                    <b-button v-b-modal.modal @click="Edit(category)" size="sm" variant="info" title="Edit"><b-icon icon="file-earmark-medical"></b-icon></b-button>
                    <b-button @click="Delete(category.id)" size="sm" variant="danger" title="Delete"><b-icon icon="trash"></b-icon></b-button>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-table md-card v-if="this.Allcategoires.length<=0">
            <md-table-toolbar>
                <h1 class="md-title">No Category</h1><router-link :to="{name:'CreateCategory'}"><button class="btn btn-secondary btn-sm text-right"><i class="fas fa-plus"></i> Add New Category</button></router-link>
            </md-table-toolbar>
        </md-table>

        <!-- =====================showign modal vue bootstrap for update user================== -->
        <b-modal id="modal" hide-footer title="Update User">
            <b-alert show variant="success" v-if="this.Success">{{this.Success}}</b-alert>
            <b-form @submit.prevent="Update(categoryID)">
                <div>
                    <label for="name" class="mb-2">Category Name</label>
                    <b-form-input size="sm" id="name"  v-model="category_name" type="text" placeholder="New Category Name"></b-form-input>
                    <small class="text-danger" v-if="this.Allerrors && this.Allerrors.category_name">{{this.Allerrors.category_name[0]}}</small>  
                </div>   
                <b-button variant="primary" size="sm" type="submit" style="width:fit-content;margin:10px;">Create</b-button>
            </b-form>
        </b-modal>
        <!-- ======================showing spinner========================= -->
        <Spinner :active="spinnerActive" text="Loading..."></Spinner>
    </div>
</template>

<script>
import Spinner from '../../spinner/Spinner'; //import this ixin for use spinner
import Mixin from '../../../../helper/mixin.js'; //import this ixin for use spinner
import {mapActions,mapGetters} from 'vuex';
export default {
    components: {Spinner},
    mixins: [Mixin],
    name:'CategoryList',
    data(){
        return{
            categoryID: '',
            category_name:''
        }
    },
    computed:{
        ...mapGetters('category',['Allcategoires','Allerrors','Success']),
    },
    methods:{
        ...mapActions('category',['getCategoies','updateCategoies','deleteCategoies']),
        Edit(category){
            this.categoryID = category.id;
            this.category_name = category.category_name;
        },
        Update(categoryID){
            let formData = new FormData();
            formData.append('category_name',this.category_name);
            formData.append('_method', 'PUT')  //in this route js can't understand put request so we have to use post request instead but make sure we append the formData with _'method':'PUT')
            this.updateCategoies({categoryID,formData})
            this.showSpinner(); //to show spinnser we call showSpinner and hideSpinnser functions from mixin that we import above
        
            
        },
        Delete(categoryID){
            if(confirm("Are your sure want to delete this category?")){
                this.deleteCategoies(categoryID);
                this.showSpinner(); //to show spinnser we call showSpinner and hideSpinnser functions from mixin that we import above
            }
            
        }
    },
    mounted(){
       this.getCategoies();   //call this mehtod from ...mapActions if  we not mouted users will not found
    },
        //     mounted(){
        //        this.$store.dispatch( 'auth/getUsers'); // use this we dont use mapActions
        //    }
}
</script>


<style>

</style>