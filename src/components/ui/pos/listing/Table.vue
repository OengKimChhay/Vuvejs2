<template>
  <div  class="wrappe-menu">
      <p v-for="tab in table" :key="tab.id" class="table-name" @click="passTable(tab)">{{tab.name}}</p>
  </div>
</template>

<script>
export default {
    props:['table'],
    name:'TableOrder',
    methods:{
        passTable(table){
            this.$emit('passTable',table);
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
.wrappe-menu p.table-name{
    width: 60px;
    height: 60px;
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
p.table-name:hover{
    outline: 2px solid #a1a1a1;
}
</style>