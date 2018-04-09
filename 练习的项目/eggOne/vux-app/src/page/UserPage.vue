<template>
  <div class="el">
  <header>
    <h1 class="headerH">
    首页
    </h1>
  </header>
  <main>
    
<table>
    <tr>
     <td>姓名</td>
     <td>年龄</td>
     <td colspan="2">操作</td>    
   </tr> 
   <tr>
     <td></td>
     <td></td>
     <td> <button>删除</button>  </td>
     <td> <button>编辑</button> </td>
   </tr>
</table>
<button class="addTd" @click="addUser()">添加</button>
<a href="#/add">提哦啊转</a>
  </main>
  </div>  
</template>

<script>


export default {
  components: {
  
  },
  data () {
    return {
   
    }
  },
  methods:{
  addUser(){

    // this.$router.push({path:'/add'});
  //  this.$axios.get('/user/add').then(( result ) => {
  //    console.log(result);
  //  }).catch(( err ) => {
  //    console.log(err);
  //  })
  }
  }
}
</script>

<style>
.el{
  width: 100%;
}
header{
  width: 100%;
}
.headerH{
  width: 20%;
  margin: 0 auto;
  margin-top:20px;
}
main{
  overflow: hidden;
}
.addTd{
  display: block;
  color: #000;
  width: 30%;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 20px;
  background-color: aquamarine;
}
 table {
   display: table; 
   width: 80%; 
   border-collapse: collapse;
   margin: 10px  auto;
   }
 tr {
   display: table-row;
    height: 30px;
    }
th {
  display: table-cell;
  font-weight: bold;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  background-color:#E5E5E5;
  }
td {
  display: table-cell;
   border: 1px solid gray;
    text-align: center;
    vertical-align: middle;
    
    }
    button{
      border:none;
      background: #ffffff;
      font-size: 15px;
    }
</style>

