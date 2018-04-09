<template>
    <div class="content">
        <!--<header-con></header-con>-->
         <p class="nav" ><span class="left">我关注的模块</span> <span class="right"> <a @click="btnClick">编辑</a> </span></p>
          <div class="con">
              <ul class="table" v-if="show1">
                  <li v-for="(data,index) in datas" :key="index"><a :href="'#/cater/'+data">{{data}}</a> <i v-if="show"  @click="delCoge(index)"   class="fa fa-minus-square"></i></li>

              </ul>
              <h3 class="tip-m" v-if="!show1">你还没有关注任何模块,赶紧关注吧.......</h3>
          </div>
          <p class="more">更多精彩等待发现.......</p>
      <tabbar class="footer">
      <tabbar-item link="/shouye" >

        <i  slot="icon"  class="fa fa-star-o"></i>
        <span slot="label">{{('动态')}}</span>
      </tabbar-item>
      <tabbar-item  selected   link="/seccon" show-dot>

        <i slot="icon" class="fa fa-heart-o"></i>
        <span  slot="label">{{('关注模版')}}</span>
      </tabbar-item>
      <tabbar-item link="/thidcon">


        <i slot="icon" class="fa fa-cube"></i>
        <span slot="label">{{('杂谈信息')}}</span>

      </tabbar-item>
      <tabbar-item link="/forcon">

        <i slot="icon" class="fa fa-user-o"></i>
        <span slot="label">{{('我的')}}</span>
      </tabbar-item>
    </tabbar>
         <!-- <footer-con></footer-con> -->
    </div>

</template>

<script>
import {  Group, Cell, XButton, ButtonTab, ButtonTabItem,Tabbar,TabbarItem } from "vux";
import HeaderCon from '../components/HeaderCon';
import FooterCon from '../components/FooterCon';
import axios from 'axios'
export default {
    data() {
    return {
     datas:[

     ],
     show:false,
     show1:true
    };
  },
  components: {
    HeaderCon,
    FooterCon,
    Tabbar,
    TabbarItem
  },
mounted:function(){
//  有问题
        axios.get('/host/getCate').then((resData)=>{

              this.datas = resData.data.data;
              var arr =  this.datas ;
                if(arr.length > 0){
                       this.show1 = true
                } else{
                    this.show1 = false;
                }
        }).catch((error)=>{
            console.log(error)
        })
    }
,
  methods: {
   btnClick:function(){
       this.show = !this.show
   },
   delCoge:function(index){
//            console.log(index)
        var id = this.datas[index];
    axios.get('/host/defalike/'+id).then((resData)=>{
                location.reload()
                 console.log(resData.data)
    }).catch((error)=>{
//            console.log(error)
       alert('系统错误')
    })

   }
  },

};
</script>

<style scoped>
  .content{
    font-size: 0.32rem;
    background: white;
  }
.nav{
    width: 94%;
    margin: 0.05rem auto;
    overflow: hidden;
    padding: 0.25rem;
    color: black;
}
.nav .left{
    display: block;
    float: left;
}
.nav .right{
    display: block;
    float: right;
}
.right a{
    color: black;
}
.con{
    width: 94%;
    margin: 0 auto;

}
.con .table{
    width: 100%;
    overflow: hidden;
    margin: 0.12rem;
}
.table li{
    width: 40%;
    float: left;
    text-align: center;
    padding: 0.25rem;
    margin:0.1rem;
    border-bottom: solid 1px #eee;
}
.table li a{
    color: black;
}
.table li i{
    color: red;
}
.more{
    width: 80%;
    margin: 2.5rem auto;
    text-align: center;
    color: #aaaaaa;
}
.footer{
    position: fixed;
    bottom: 0;
}
.tip-m{
    width:98%;
    margin-top:3rem ;
    text-align:center;
}
</style>

