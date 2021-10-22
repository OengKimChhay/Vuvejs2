<template>
    <div class="wrappe-menu">
        <div v-for="product in this.filterProduct" :key="product.id" >
            <div class="product" @click="passProduct(product)">
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
</template>

<script>
import Mixin from '../../../../../helper/mixin.js'; //for use of ImageURL
export default {
    mixins: [Mixin],
    name:"Product",
    props: ['product','category_id'], //'product and category_id' is a prop name in parent component
    computed:{
        filterProduct(){ // to filter product by category
            return this.product.filter((product) => product.category_id == this.category_id);
        }
    },
    methods:{
        passProduct(product){
            this.$emit('PassProduct',product);
        }
    }
}
</script>

<style>
.wrappe-menu{
    display: flex;
    flex-wrap: wrap;
    height: 460px;
    overflow: hidden;
    overflow-y: scroll;
    align-content: flex-start;
    justify-content: flex-start;
    padding: 10px;
}
/* product */
.product{
    width: 118px;
    height: 135px;
    margin: 3px;
    background: #f6f9ff;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 36%);
    border-radius: 3px;
    cursor: pointer;
}
.product:hover{
    outline: 2px solid #a1a1a1;
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
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>