<template>
    <b-row>
        <b-col>
            <section>
                <p class="title">Order</p>
                <!-- ------------------take order------------------ -->
                <div class="order">
                    <div class="header-order">
                        <div class="cahier">
                            <p>Cashier Name: {{username | capitaLize}}</p>
                            <p>Order Number: 0012</p>
                        </div>
                        <div class="date">
                            <clock></clock>
                        </div>
                    </div>
                    <div class="body-order">
                    </div>
                </div>
            </section>
        </b-col>
        <b-col>
            <section>
                <p class="title">Menu</p>
                <!-- ------------------show category--------------- -->
                <div v-if="showCat">
                    <div  class="wrappe-menu">
                        <div v-for="category in this.Allcategoires" :key="category.id">
                            <div @click="selectCat(category.id)" class="cat">
                                <p class="cat-name">{{category.category_name | capitaLize}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ------------------product show base on category -->
                <div v-if="showPro">
                    <div class="back">
                        <b-button @click="showCatHidePro" size="sm"><b-icon icon="chevron-double-left"></b-icon>Back</b-button>
                    </div>
                    <div class="wrappe-menu">
                        <div v-for="product in this.filterProduct" :key="product.id">
                            <div class="product">
                                <div class="pro-img">
                                    <b-img style="width:126px;height:100px;" :src="ImageURL+'/product/'+product.image" alt=" image"></b-img>
                                    <!-- <img   alt="photo"> -->
                                    <span>{{product.unitprice}} $</span>
                                </div>
                                <div class="pro-name">
                                    <p>{{ product.product_name | capitaLize }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </b-col>
    </b-row>
</template>

<script>
import Mixin from '../../../../helper/mixin.js'; //import this ixin for use spinner
import {mapActions,mapGetters} from 'vuex';
import clock from '../../../../helper/clock.vue';
export default {
    name:'Pos',
    mixins: [Mixin],
    components:{clock},
    data(){
        return{
            category_id: '',
            showCat: true,
            showPro: false,
        }
    },
    computed:{
        ...mapGetters('category',['Allcategoires']),
        ...mapGetters('product',['GetAllproducts']),
        // to filter product by category
        filterProduct(){
            return this.GetAllproducts.filter((product) => product.category_id == this.category_id);
        }
    },
    methods:{
        ...mapActions('category',['getCategoies']),
        ...mapActions('product',['getAllProduct']),
        selectCat(catID){
            this.category_id = catID;
            this.showCat = false;
            this.showPro = true;
        },
        showCatHidePro(){
            this.showCat = true;
            this.showPro = false;
        }
    },
    mounted(){
        //call below mehtod from ...mapActions if  we not mouted category will not found
        this.getAllProduct();
        this.getCategoies();   
    },
}
</script>

<style>
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
/* product */
.product{
    width: 118px;
    height: 135px;
    margin: 3px;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
}
.product:hover{
    border: 1px solid #6a6a6a;
    cursor: pointer;
}
.pro-img{
    position: relative;
}
.pro-img span{
    position: absolute;
    top: 5px;
    left: 5px;
    color: #000000;
    font-size: 18px;
    background: rgb(255 255 255 / 62%);
    font-weight: 700;
    padding: 2px;
}
.pro-name{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 2px;
}
.pro-name p{
    margin: 0;
    color: black;
    font-size: 13px;
}
/* end product */
section{
    width: 100%;
    border: 1px solid #0000005e;
}
p.title{
    background: #93b4ff;
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: black;
}
.back{
    width: 100%;
    height: fit-content;
    padding: 3px;
}
.wrappe-menu{
    display: flex;
    flex-wrap: wrap;
    height: 434px;
    overflow: hidden;
    overflow-y: scroll;
    align-content: flex-start;
    justify-content: center;
    margin: 1px;
}
.cat{
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
    margin: 2px;
    cursor: pointer;
    background: #f6f9ff;
    overflow: hidden;
}
.cat:hover{
    background: #e1e1e1;
    border: 1px solid #6a6a6a;
}
.cat p{
    margin: 0;
    word-break: break-all;
    margin: 5px;
}
</style>