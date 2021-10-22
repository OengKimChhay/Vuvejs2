<template>
    <div class="wrappe-order">
        <div class="go-back">
            <router-link :to="{ name: 'Dashboard' }" style="text-decoration:none;" ><p><b-icon icon="arrow-bar-left"></b-icon>Exit</p></router-link>
        </div>
        <div style="display:flex;width:100%; padding: 0 13px;">
            <section>
                <p class="title">Order</p>
                <!-- ------------------take order------------------ -->
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
                                <th style="width:50px">N0.</th>
                                <th>Pro_Name</th>
                                <th style="width:80px">Price</th>
                                <th style="width:80px">Qty</th>
                                <th style="width:80px">Dis</th>
                                <th style="width:80px">Action</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="(item,index) in orderItems" :key="index">
                                <td class="text-center">{{index+1}}</td>
                                <td>{{item.name}}</td>
                                <td class="text-center">{{item.price | toCurrency}}</td> <!--toCurrency is a filter pls see /filter/main.js-->
                                <td class="text-center"><div class="qty-btn"><input v-model="item.qty" type="number" min="1" title="Quantity"></div></td>
                                <td class="text-center">{{discount}} %</td>
                                <td class="text-center"><button @click="deleteOrder(index)" title="Delete" class="delete-order"><b-icon icon="trash" ></b-icon></button></td>
                            </tr>
                            <tr v-if="orderItems.length <= 0">
                                <td style="text-align:center;padding:5px;" colspan="6">No item yet.</td>
                            </tr>
                        </tbody>
                        </table>
                        <div v-if="orderItems.length > 0" class="order-detail">
                            <div>
                                <p>Total: <span>{{TOTAL | toCurrency}}</span></p>
                                <p>Dis: <span>{{discount}} %</span></p>
                                <p>Amount to pay: <span>{{AMOUNTTOPAY | toCurrency}}</span></p>
                            </div>
                            <div>
                                <button   @click="order" class="order-button">Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <p class="title">Menu</p>
                <div class="menu-option">
                    <button v-on:click="orderItems=[]">Clear Order</button>
                    <button v-on:click="showTable=true">Table</button>
                    <button v-if="showProList || showTable" @click="Back" size="sm"><b-icon icon="chevron-double-left"></b-icon> Back</button>
                </div>
                <TableOrder v-if="showTable" :table="this.Alltables" @passTable="selectTab"></TableOrder>
                <!-- we use prop(pass from parent to child) and $emit(pass child to parent) to pass data each other child~parent -->
                <!-- ------------------show category list--------------- -->
                <Category v-if="showCatList" :category="this.Allcategoires" @PassCatID="selectCat"></Category> 
                <!-- ------------------product show base on category -->
                <Product  v-if="showProList" :product="this.GetAllproducts" :category_id="this.category_id" @PassProduct="TakeOrder"></Product>
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
export default {
    mixins: [Mixin],
    name:'Pos',
    components:{
        Clock, 
        TableOrder,
        Category, 
        Product,
    },
    data(){
        return{
            table:'',
            category_id: '',
            showCatList: true,
            showProList: false,
            showTable: false,
            orderItems:[],
            discount:10
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

        selectCat(catID){
            this.category_id = catID;
            this.showCatList = false;
            this.showProList = true;
        },
        Back(){
            this.showCatList = true;
            this.showProList = false;
            this.showTable   = false;
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

        order(){
            alert(this.TOTAL)
            console.log(this.orderItems);
        }
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
.order-button{
    margin-right: 6px;
    border: none;
    background: #93b4ff;
    font-size: 15px;
    border-radius: 3px;
    font-weight: 500;
    box-shadow: 0px 1px 4px 0px #000000;
    padding: 5px 12px;
}
.order-button:hover{
    outline: 2px solid #a1a1a1;
}
.order-detail{
    margin-top: 10px;
    position: sticky;
    bottom: 0;
    background: #fff2ed;
    display: flex;
    justify-content: space-between;
    padding: 12px 0px 0px;
}
.order-detail > div p{
    font-size: 14px;
    margin: 3px 0px;
    font-weight: 500;
}
button.delete-order{
    border: 2px solid #ff6d6d;
    background: white;
    border-radius: 3px;
    color: red;
}
.qty-btn{
    display: flex;
    justify-content: center;
}
.qty-btn input{
    width: 100%;
    outline: none;
    text-align: center;
    border: 1px solid #838383;
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
    padding: 4px 6px;
    margin-left: 9px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #93b4ff;
    box-shadow: 0px 1px 4px 0px #000000;
}
.menu-option button:hover{
    outline: 2px solid #a1a1a1;
}
.go-back{
    padding: 14px;
    background: #93b4ff;
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px 0px #808080;
}

.go-back p{
    box-shadow: inset 0px 0px 5px black;
    background: white;
    font-size: 17px;
    margin: 0;
    color: #910101;
    font-weight: 500;
    width: fit-content;
    padding: 8px;
}
.go-back p:hover{
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
    justify-content: space-around;
}
.header-order .cahier p,.date p{
    margin: 3px;
    font-size: 14px;
    font-weight: 500;
}
/* end order */
section{
    width: 50%;
    height: 536px;
    box-shadow: 0px 0px 5px 0px #5e5e5e;
    background: #fff2ed;
}
section:nth-child(1){
    margin-right: 10px;
}
p.title{
    background: darksalmon;
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: black;
}

.body-order{
    position: relative;
    margin: 0 15px;
    height: 436px;
    overflow: hidden;
    overflow-y: scroll;
}
.table-order{
    width: 100%;
}
.table-order > thead tr,thead th{
    padding: 7px;
    text-align: center;
    background: #dfe9ff;
	border: 1px solid #0000005e;
}
.table-order > thead{
    position: sticky;
    top: -1px;
}
.table-order td, th { 
	padding: 3px 5px; 
	border: 1px solid #0000005e;
	text-align: left; 
	font-size: 13px;
	}

</style>