<template>
    <div class="wrappe-order">
        <div class="go-back">
            <button>
                <router-link :to="{ name: 'Dashboard' }" style="text-decoration:none;padding:7px;color: #910101;" ><b-icon icon="arrow-bar-left"></b-icon>Exit</router-link>
            </button>
            <button @click="refreshPage">
                Refresh
            </button>
        </div>
        <div class="wrapper">
            <section>
                <p class="title">Order</p>
                <!-- ------------------take order-------------------->
                <div class="order">
                    <div class="header-order">
                        <div class="cahier">
                            <p>Cashier Name: {{username | capitaLize}}</p>
                            <p>Order Number: 0012</p>
                            <p>Table:{{table}}</p>
                        </div>
                        <div class="date">
                            <Clock></Clock>
                        </div>
                    </div>
                    <div class="body-order">
                        <table class="table-order">
                            <thead>
                                <tr>
                                    <th style="width:60px">N0.</th>
                                    <th>Pro_Name</th>
                                    <th style="width:130px">Price</th>
                                    <th style="width:130px">Qty</th>
                                    <th style="width:130px">Dis</th>
                                    <th style="width:130px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in orderItems" :key="index">
                                    <td class="text-center">{{index+1}}</td>
                                    <td>{{item.name}}</td>
                                    <td class="text-center">{{item.price | toCurrency}}</td> <!--toCurrency is a filter pls see /filter/main.js-->
                                    <td class="text-center"><div class="qty-btn"><input v-model="item.qty" type="number" min="1" title="Quantity"></div></td>
                                    <td class="text-center">{{discount}} %</td>
                                    <td class="text-center"><button @click="deleteOrder(index)" title="Delete" class="delete-order"><b-icon icon="trash" ></b-icon></button></td>
                                </tr>
                                <tr v-if="orderItems.length <= 0">
                                    <td style="text-align:center;padding:20px;" colspan="6">No item yet.</td>
                                </tr>
                            </tbody>
                        </table>
                        <div  class="order-detail">
                            <div>
                                <p>Total: <span>{{TOTAL | toCurrency}}</span></p>
                                <p>Rate: {{rate}}៛</p>
                                <p>Dis: <span>{{discount}} %</span></p>
                                <p>Amount to pay: <span>{{AMOUNTTOPAY | toCurrency}}</span> </p>
                            </div>
                            <div>
                                <button v-b-modal.modal-1 class="order-button" v-if="orderItems.length > 0">Order</button>
                            </div>
                            <!-- show order detail alert -->
                            <b-modal id="modal-1" size="lg" title="Order Detail" hide-footer>
                                <div class="body-order-detail d-flex justify-content-center">
                                    <div>
                                        <p>Item: {{orderItems.length}}</p>
                                        <p>Total: {{TOTAL | toCurrency}}</p>
                                        <p>Discount: {{discount}}%</p>
                                        <p>Amount To Pay</p>  
                                        <div class="d-flex">
                                            <p>{{AMOUNTTOPAY | toCurrency}}</p>
                                            <p>{{AMOUNTTOPAY*rate | toCurrencyReil}}</p> 
                                        </div>
                                    </div>
                                </div>
                                <div class="footer-order-detail">
                                    <b-button variant="success">Order</b-button>
                                </div>
                            </b-modal>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <p class="title">Menu</p>
                <div class="menu-option">
                    <button v-on:click="orderItems=[]">Clear Order</button>
                    <button v-on:click="Table">Table</button>
                    <button v-on:click="promoTion">Setting (%,rate)</button>
                    <button v-if="showProList || showTable || showPromoTable" @click="Back" size="sm"><b-icon icon="chevron-double-left"></b-icon> Back</button>
                </div>

                <!-- we use prop(pass from parent to child) and $emit(pass child to parent) to pass data each other child~parent -->
                <TableOrder v-if="showTable" :table="this.Alltables" @passTable="selectTab"></TableOrder>
                <!-- ------------------show category list--------------- -->
                <Category v-if="showCatList" :category="this.Allcategoires" @PassCatID="selectCat"></Category> 
                <!-- ------------------product show base on category -->
                <Product  v-if="showProList" :product="this.GetAllproducts" :category_id="this.category_id" @PassProduct="TakeOrder"></Product>
                <Promotion v-if="showPromoTable" @passDiscount="TakeDiscount"></Promotion>
            </section>
        </div>
    </div>
</template>

<script>
import Mixin from '../../../../helper/mixin'; //for use of username
import {mapActions,mapGetters} from 'vuex';
import Clock from '../../../../helper/clock';
import TableOrder from "./listing/Table";
import Category from './listing/Category';
import Product from './listing/Product';
import Promotion from './listing/Promotion';
export default {
    mixins: [Mixin],
    name:'Pos',
    components:{
        Clock, 
        TableOrder,
        Category, 
        Product,
        Promotion
    },
    data(){
        return{
            table:'',
            category_id: '',
            showCatList: true,
            showProList: false,
            showTable: false,
            showPromoTable: false,
            orderItems:[],
            discount:0,
            rate:4100,
        }
    },
    computed:{
        ...mapGetters('table',['Alltables']),
        ...mapGetters('category',['Allcategoires']),
        ...mapGetters('product',['GetAllproducts']),
        
        TOTAL(){ //to get amoute total of order
             return this.orderItems.reduce((acc, item) => acc + parseFloat(item.price*item.qty), 0);
        }, 
        AMOUNTTOPAY(){
            return this.TOTAL - (this.TOTAL * (this.discount/100));
        }
    },
    methods:{
        ...mapActions('table',['getTables']),
        ...mapActions('category',['getCategoies']),
        ...mapActions('product',['getAllProduct']),
        refreshPage(){
            window.location.reload();
        },
        selectCat(catID){
            this.category_id = catID;
            this.showCatList = false;
            this.showProList = true;
        },
        Back(){
            this.showCatList= true;
            this.showProList= false;
            this.showTable= false;
            this.showPromoTable= false;
        },
        Table(){
            this.showTable= true;
            this.showCatList= false;
            this.showProList= false;
            this.showPromoTable= false;
        },
        promoTion(){
            this.showPromoTable= true;
            this.showTable= false;
            this.showCatList= false;
            this.showProList= false;
        },
        TakeDiscount(dis,rat){
            // dis and rat are take from prop
            this.discount = dis;
            this.rate = rat;
        },
        selectTab(table){
            this.table = table.name;
        },
        TakeOrder(product){
            let index = this.orderItems.findIndex((item) => item.id === product.id); 
            if(index != -1){ //check if item inorderItems array is the same with item that user just add (=-1 mean same item)
                this.orderItems[index].qty ++; //if same increase only qty and price in that index of item
            }else{
                let order = {
                    id   : product.id,
                    name : product.product_name,
                    price: product.unitprice,
                    qty  :1,
                }
                this.orderItems.push(order);
            }
        },
        deleteOrder(index){
            this.orderItems.splice(index, 1); //1 mean that remove 1 item
        },

        // order(){
        //     alert(this.TOTAL)
        //     console.log(this.orderItems);
        // }
    },
    mounted(){
        //call below mehtod from ...mapActions if  we not mouted category will not found
        this.getTables();
        this.getAllProduct();
        this.getCategoies(); 
    },
}
</script>

<style>
.body-order-detail div p{
    font-size: 19px;
    font-weight: 500;
}
.body-order-detail div div p{
    ont-size: 19px;
    color: #bc0000;
    font-weight: 500;
    border: 1px solid #a2a2a2;
    padding: 15px;
    background: #ffcdc3;
}
.body-order-detail div div p:nth-child(2){
    margin-left: 12px;
}
.promotion-form{
    background: #dedede;
    border-radius: 3px;
    width: fit-content;
    padding: 23px;
}
.promotion-form .group-input{
    margin: 10px 5px;
}
.promotion-form .group-input p{
    font-size: 16px;
    margin: 4px 0;
}
.promotion-form .group-input input{
    outline: none;
    font-size: 16px;
    padding: 5px 12px;
    border: 1px solid #f98666;
}
.promotion-form .group-input button:nth-child(1){
    border: none;
    font-size: 16px;
    padding: 6px 14px;
    border-radius: 2px;
    box-shadow: 0px 1px 3px #090909;
    background: #28a745;
}
.promotion-form .group-input button:nth-child(2){
    border: none;
    margin-left: 13px;
    font-size: 16px;
    padding: 6px 14px;
    border-radius: 2px;
    box-shadow: 0px 1px 3px #090909;
    background: #d54343;
}
.wrapper{
    display: flex;
    margin: 20px;
    height: 88%;
}
.order-button{
    margin-right: 6px;
    border: none;
    background: #93b4ff;
    font-size: 18px;
    border-radius: 3px;
    font-weight: 500;
    box-shadow: 0px 1px 4px 0px #000000;
    padding: 9px 22px;
}
.order-button:hover{
    outline: 2px solid #a1a1a1;
}
.order-detail{
    margin-top: 10px;
    position: sticky;
    bottom: 0;
    background: lightgoldenrodyellow;
    display: flex;
    justify-content: space-between;
    padding: 12px 0px 0px;
}
.order-detail > div p{
    font-size: 17px;
    margin: 4px 0px;
    font-weight: 500;
}
button.delete-order{
    border: 2px solid #ff6d6d;
    background: white;
    border-radius: 3px;
    padding: 2px 4px;
    color: red;
}
.qty-btn{
    display: flex;
    justify-content: center;
}
.qty-btn input{
    width: 100%;
    outline: none;
    padding: 3px;
    text-align: center;
    border: none;
}
.order{
    height: 90%;
    padding: 15px;
}
.menu-option{
    display: -webkit-inline-box;
    width: 100%;
    padding: 10px 3px 5px;
    overflow: hidden;
    border-bottom: 1px solid #a19996;
    overflow-x: scroll;
}
.menu-option button{
    border: none;
    padding: 9px 12px;
    margin-left: 9px;
    font-size: 17px;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ff6347c4;
    box-shadow: 0px 1px 3px 0px #000000;
}
.menu-option button:hover{
    outline: 2px solid #a1a1a1;
}
.go-back{
    padding: 14px;
    background: navajowhite;
    box-shadow: 0px 0px 3px 0px #808080;
    display: flex;
}
.go-back button{
    box-shadow: 0px 1px 4px 0px #000000;
    background: white;
    font-size: 17px;
    margin-right: 13px;
    font-weight: 500;
    color: #3c3c3c;
    border-radius: 2px;
    padding: 7px;
    border: none;
}
.go-back button:hover{
    background: #dddddd;
}
.wrappe-order{
    position: fixed;
    top: 0px;
    left: 0;
    z-index: 1000;
    height: 100%;
    width: 100%;
    background-color: white;
}
/* order */
.header-order{
    display: flex;
    justify-content: space-between;
}
.header-order .cahier p,.date p{
    margin-bottom: 8px;
    font-size: 17px;
    font-weight: 500;
}
/* end order */
section{
    box-shadow: 0px 0px 5px 0px #5e5e5e;
    background: lightgoldenrodyellow;
    width: 50%;
}
section:nth-child(1){
margin-right: 20px;
}
p.title{
    background: #55b0ff;
    margin: 0;
    text-transform: uppercase;
    padding: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}

.body-order{
    position: relative;
    height: 90%;
    overflow: hidden;
    overflow-y: scroll;
}
.table-order{
    width: 100%;
    background: #dfe9fe;
}
.table-order > thead tr,thead th{
    padding: 10px;
    text-align: center;
	border: 1px solid #0000005e;
}
.table-order > thead{
    position: sticky;
    top: -1px;
    background: #FFDEAD;
}
.table-order td, th { 
	padding: 6px; 
	border: 1px solid #0000005e;
	text-align: left; 
	font-size: 16px;
}
.wrappe-menu{
    display: flex;
    flex-wrap: wrap;
    height: 85%;
    overflow: hidden;
    overflow-y: scroll;
    align-content: flex-start;
    justify-content: flex-start;
    padding: 20px;
}
.cat{
    width: 118px;
    height: 118px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
    margin: 4px;
    cursor: pointer;
    background: white;
    overflow: hidden;
}
.cat:hover{
    
    outline: 2px solid #a1a1a1;
}
.cat p.cat-name{
    margin: 0;
    word-break: break-all;
    font-size: 17px;
}
.wrappe-menu p.table-name{
    width: 80px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
    margin: 2px;
    cursor: pointer;
    background: #f6f9ff;
    overflow: hidden;
    font-size: 17px;
}
p.table-name:hover{
    outline: 2px solid #a1a1a1;
}

/* product */
.product{
    width: 135px;
    height: 186px;
    margin: 5px;
    background: white;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
    cursor: pointer;
}
.product:hover{
    outline: 2px solid #a1a1a1;
}
.pro-img{
    position: relative;
    height: 70%;
}
.pro-img .img{
    width: 145px;
    height: 130px;
}
.pro-img span{
    position: absolute;
    top: 5px;
    left: 5px;
    color: #000000;
    font-size: 18px;
    background: rgb(255 255 255 / 72%);
    font-weight: 700;
    padding: 2px;
}
.pro-name{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 2px;
    height: 30%;
}
.pro-name p{
    margin: 0;
    color: black;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>