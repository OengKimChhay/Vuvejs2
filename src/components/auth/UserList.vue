<template>
    <div>
        <!-- whenever we use child route we have to add router-view to wrappe all parent component -->
        <!-- and router-view plz see in layout/layout -->
        
        <h5 class="title">User List <i class="fa fa-users"></i></h5>
        <md-table  md-card v-if="this.Allusers.length >0">
            <md-table-toolbar>
                <h1 class="md-title">Users</h1>
                <router-link :to="{name:'UserRegister'}"><button class="btn btn-secondary btn-sm text-right"><i class="fas fa-plus"></i> Add New User</button></router-link>
            </md-table-toolbar>

            <md-table-row style="background-color:#ADD8E6;">
                <md-table-head md-numeric>NO_</md-table-head>
                <md-table-head>Photo</md-table-head>
                <md-table-head>Name</md-table-head>
                <md-table-head>Email</md-table-head>
                <md-table-head>Phone</md-table-head>
                <md-table-head>Role</md-table-head>
                <md-table-head>Created</md-table-head>
                <md-table-head>Updated</md-table-head>
                <md-table-head>Action</md-table-head>
            </md-table-row>

            <md-table-row slot="md-table-row" v-for="(user, index) in this.Allusers" :key="user.id">
                <md-table-cell md-numeric>{{ index+1 }}</md-table-cell>
                <md-table-cell><img class="img" :src="'http://127.0.0.1:8000/images/users/'+user.image" alt="photo"></md-table-cell>
                <md-table-cell>{{ user.name }}</md-table-cell>
                <md-table-cell>{{ user.email }}</md-table-cell>
                <md-table-cell>{{ user.phone }}</md-table-cell>
                <md-table-cell>{{ user.userType }}</md-table-cell>
                <md-table-cell>{{ user.created_at | formatDate }}</md-table-cell> <!-- formatDate is a custom filter in main.js root -->
                <md-table-cell>{{ user.updated_at | formatDate }}</md-table-cell> <!-- formatDate is a custom filter in main.js root -->
                <md-table-cell>
                    <b-button v-b-modal.modal @click="Edit(user.id)" size="sm" variant="info" title="Edit"><b-icon icon="file-earmark-medical"></b-icon></b-button>
                    <b-button @click="Delete(user.id)" size="sm" variant="danger" title="Delete"><b-icon icon="trash"></b-icon></b-button>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-table md-card v-if="this.Allusers.length == 0">
            <md-table-toolbar>
                <h1 class="md-title">No User</h1><router-link :to="{name:'UserRegister'}"><button class="btn btn-secondary btn-sm text-right">Add New User</button></router-link>
            </md-table-toolbar>
        </md-table>

<!-- =====================showign modal vue bootstrap for update user================== -->
        <b-modal id="modal" hide-footer title="Update User">
            <b-alert show variant="success" v-if="this.Success">{{this.Success}}</b-alert>
            <b-form  @submit.prevent="Update(editUser.id)">
                <div class="row">
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="name" class="mb-2">New Name</label>
                        <b-form-input size="sm" id="name"  v-model="editUser.new_name" type="text" placeholder="New Name"></b-form-input>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.new_name">{{this.Allerrors.new_name[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="email" class="mb-2">New Email</label>
                        <b-form-input size="sm" id="email"  v-model="editUser.new_email" type="email" placeholder="Example@gmail.com"></b-form-input>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.new_email">{{this.Allerrors.new_email[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="password" class="mb-2">Old Password</label>
                        <b-form-input size="sm" id="password"  v-model="editUser.old_password" type="password" placeholder="Old Password"></b-form-input>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.old_password">{{this.Allerrors.old_password[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="re_password" class="mb-2">New Password</label>
                        <b-form-input size="sm" id="re_password"  v-model="editUser.new_password" type="password" placeholder="New Password"></b-form-input>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.new_password">{{this.Allerrors.new_password[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="phone" class="mb-2">New Phone</label>
                        <b-form-input size="sm" id="phone"  v-model="editUser.new_phone" type="text" placeholder="New Phone"></b-form-input>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.new_phone">{{this.Allerrors.new_phone[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="usertype" class="mb-2">User Type</label>
                        <select v-model="editUser.new_userType" class="form-select form-select-sm">
                            <option :value="'User'"  :selected="editUser.new_userType === 'User'">User</option>
                            <option :value="'Admin'" :selected="editUser.new_userType === 'Admin'">Admin</option>
                        </select>
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.userType">{{this.Allerrors.userType[0]}}</small>
                    </div>
                    <div class="mb-3 col-lg-6 col-sm-12">
                        <label for="image" class="mb-2">Image</label>
                        <input @change="processFile" id="image" class="form-control form-control-sm" type="file">
                        <small class="text-danger" v-if="this.Allerrors && this.Allerrors.image">{{this.Allerrors.image[0]}}</small>
                    </div>
                    <div class="d-flex justify-content-start">
                        <div id="preview">
                            <img v-if="preview" :src="preview" alt="">
                            <img v-else :src="'http://127.0.0.1:8000/images/users/'+editUser.new_image" alt="">
                        </div>
                    </div>
                    <b-button variant="info" size="sm" type="submit" style="width:fit-content;margin:10px;">Update</b-button>
                </div>
            </b-form>
        </b-modal>
<!-- ======================showing spinner========================= -->
        <Spinner :active="spinnerActive" text="Loading..."></Spinner>
    </div>
</template>

<script>
import Spinner from '../spinner/Spinner'; //import this ixin for use spinner
import Mixin from '../../../helper/mixin.js'; //import this ixin for use spinner
import {mapActions,mapGetters} from 'vuex';
export default {
    components: {Spinner},
    mixins: [Mixin],
    data(){
        return{
            editUser:{
                id:"",
                new_name:"",
                new_email:"",
                old_password:"",
                new_password:"",
                new_image:"",
                new_phone:"",
                new_userType:"",
            },
            preview: ""
        }
    },
    computed:{
        ...mapGetters('auth',['Allusers','Allerrors','Success']),
    },
    methods:{
        ...mapActions('auth',['getUsers','deleteUsers','udpateUsers']),
        Edit(userID){
            const secificUser = this.Allusers.find(user=> user.id === userID); //to get old value of data to show when user click edit
            this.editUser.id = userID;
            this.editUser.new_name = secificUser.name;
            this.editUser.new_email = secificUser.email;
            this.editUser.new_image = secificUser.image;
            this.editUser.new_phone = secificUser.phone;
            this.editUser.new_userType = secificUser.userType;
        },
        Update(userID){
            let formData = new FormData();
            formData.append('new_name',this.editUser.new_name);
            formData.append('new_email',this.editUser.new_email);
            formData.append('new_password',this.editUser.new_password);
            formData.append('old_password',this.editUser.old_password);
            formData.append('new_userType',this.editUser.new_userType);
            formData.append('new_phone',this.editUser.new_phone);
            formData.append('new_image',this.editUser.new_image);
            formData.append('_method', 'PUT')  //in this route js can't understand put request so we have to use post request instead but make sure we append the formData with _'method':'PUT')
            
            let config = {
                headers:{
                    'Content-Type':'multipart/form-data',         
                }        
            }
            
            this.udpateUsers({userID,formData,config});    // use this if we dont use mapAction this.$store.dispatch('auth/udpateUsers',{userID,formData,config})           
            this.showSpinner();                            //to show spinnser we call showSpinner functions from mixin that we import above
        },
        Delete(userID){
            if(confirm("Are your sure want to delete this user?")){
                this.deleteUsers(userID);
                this.showSpinner();                         //to show spinnser we call showSpinner functions from mixin that we import above
            }
            
        },
        processFile(event) {
            this.editUser.new_image = event.target.files[0];
            this.preview = URL.createObjectURL(this.editUser.new_image);
        }
    },
    mounted(){
       this.getUsers();   //call this mehtod from ...mapActions if  we not mouted users will not found
    },

    //mounted(){this.$store.dispatch( 'auth/getUsers'); // use this we dont use mapActions}
}
</script>

<style>
#preview{
    width: 70%;
}
img{
    width: 100%;
}
.img{
    width: 60px;
}
.title{
    padding: 20px 0;
}
</style>