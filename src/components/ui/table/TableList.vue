<template>
    <div>
        <!-- whenever we use child route we have to add router-view to wrappe all parent component -->
        <!-- and router-view plz see in layout/layout -->
        <h5 class="title">Table List <i class="fa fa-dashboard"></i></h5>
        <md-table  md-card v-if="this.Alltables.length>0">
            <md-table-toolbar>
                <h1 class="md-title">Table</h1>
                <b-form-input v-model="search" size="sm" style="width:200px;margin-right:5px;" class="" placeholder="Search Table name..."></b-form-input >
                <router-link :to="{name:'CreateTable'}"><button class="btn btn-secondary btn-sm text-right"><i class="fas fa-plus"></i> Add New Table</button></router-link>
            </md-table-toolbar>

            <md-table-row style="background-color:#ADD8E6;">
                <md-table-head>NO_</md-table-head>
                <md-table-head>Table Name</md-table-head>
                <md-table-head>Created</md-table-head>
                <md-table-head>Updated</md-table-head>
                <md-table-head>Action</md-table-head>
            </md-table-row>

            <md-table-row slot="md-table-row" v-for="(table, index) in searchFilter" :key="table.id">
                <md-table-cell >{{index+1}}</md-table-cell>
                <md-table-cell >{{table.name}}</md-table-cell>
                <md-table-cell >{{table.created_at | formatDate}}</md-table-cell>
                <md-table-cell >{{table.updated_at | formatDate}}</md-table-cell>
                <md-table-cell>
                    <b-button :disabled="usertype === 'User'" v-b-modal.modal @click="Edit(table)" size="sm" variant="info" title="Edit"><b-icon icon="file-earmark-medical"></b-icon></b-button>
                    <b-button :disabled="usertype === 'User'" @click="Delete(table.id)" size="sm" variant="danger" title="Delete"><b-icon icon="trash"></b-icon></b-button>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-table md-card v-if="this.Alltables.length <= 0">
            <md-table-toolbar>
                <h1 class="md-title">No Table</h1><router-link :to="{name:'CreateTable'}"><button class="btn btn-secondary btn-sm text-right"><i class="fas fa-plus"></i> Add New Table</button></router-link>
            </md-table-toolbar>
        </md-table>

        <!-- =====================showign modal vue bootstrap for update user================== -->
        <b-modal id="modal" hide-footer title="Update Table">
            <b-alert show variant="success" v-if="this.Success">{{this.Success}}</b-alert>
            <b-form @submit.prevent="Update(tableID)">
                <div>
                    <label for="name" class="mb-2">Table Name</label>
                    <b-form-input size="sm" id="name"  v-model="name" type="text" placeholder="New Table Name"></b-form-input>
                    <small class="text-danger" v-if="this.Allerrors && this.Allerrors.name">{{this.Allerrors.name[0]}}</small>  
                </div>   
                <b-button variant="primary" size="sm" type="submit" style="width:fit-content;margin:10px;">Update</b-button>
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
    name:'TableList',
    data(){
        return{
            tableID: '',
            name:'',
            search:'',
        }
    },
    computed:{
        ...mapGetters('table',['Alltables','Allerrors','Success']),
        searchFilter(){
            return this.Alltables.filter((item) => {
                return item.name.toLowerCase().includes(this.search.toLowerCase());
            });
        }
    },
    methods:{
        ...mapActions('table',['getTables','updateTables','deleteTables']),
        Edit(table){
            this.tableID = table.id;
            this.name = table.name;
        },
        Update(tableID){
            let formData = new FormData();
            formData.append('name',this.name);
            formData.append('_method', 'PUT')  //in this route js can't understand put request so we have to use post request instead but make sure we append the formData with _'method':'PUT')
            this.updateTables({tableID,formData})
            this.showSpinner(); //to show spinnser we call showSpinner and hideSpinnser functions from mixin that we import above
    
        },
        Delete(tableID){
            if(confirm("Are your sure want to delete this category?")){
                this.deleteTables(tableID);
                this.showSpinner(); //to show spinnser we call showSpinner and hideSpinnser functions from mixin that we import above
            }
            
        }
    },
    mounted(){
       this.getTables();   //call this mehtod from ...mapActions if  we not mouted users will not found
    },
        //     mounted(){
        //        this.$store.dispatch( 'auth/getUsers'); // use this we dont use mapActions
        //    }
}
</script>


<style>

</style>