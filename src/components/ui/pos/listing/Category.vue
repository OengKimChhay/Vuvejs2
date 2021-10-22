<template>
    <div  class="wrappe-menu">
        <div v-for="cat in category" :key="cat.id" >
            <div class="cat" @click="passCatID(cat.id)">
                <p class="cat-name">{{cat.category_name | capitaLize}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Category',
    props: ['category'], //'category' is a prop name in parent component
    methods:{
        passCatID(catID){
            this.$emit('PassCatID',catID);
        }
    },
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
    
    outline: 2px solid #a1a1a1;
}
.cat p.cat-name{
    margin: 0;
    word-break: break-all;
    margin: 5px;
}
</style>