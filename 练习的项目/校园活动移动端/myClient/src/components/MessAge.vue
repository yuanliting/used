<template>
  <div class="content">
    <!-- <x-header>{{item}}</x-header> -->
    <x-header>消息通知</x-header>

    <!-- ********文章显示************** -->
    <!-- 该模版若有文章则显示 -->
  
    <div class="com" v-if=" count.length > 0">
      
      <div class="con" v-for=" (item , index) in count" :key="index">
        <!-- 回复消息通知 -->
        <div v-if="item.atType == 'reply'">
          <img v-if="item.author_id.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author_id.avatar" alt="">
          <img v-else class="img" :src="img" alt="">


          <section class="right">
            <h5 v-if="item.author_id.name">{{item.author_id.name}}</h5>
            <h5 v-else>{{item.author_id.uname}} </h5>
            <span> {{item.time}} 来自[ {{item.author_id.school}} ]</span>
            <h4>{{item.reply_id.content}}</h4>
          </section>
          <p class="left">{{item.article_id.content}}#{{item.article_id.category}}#</p>

        </div>
        <!-- 点赞通知 -->
        <div v-if="item.atType == 'at'">
          <!-- {{item}} -->
          <img v-if="item.author_id.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author_id.avatar" alt="">
          <img v-else class="img" :src="img" alt="">


          <section class="right">
            <h5 v-if="item.author_id.name">{{item.author_id.name}}</h5>
            <h5 v-else>{{item.author_id.uname}} </h5>
            <span> {{item.time}} 来自[ {{item.author_id.school}} ]</span>
            <h4>{{'赞了你'}}</h4>
          </section>
          <!-- {{item}} -->
          <p class="left">{{item.article_id.content}}#{{item.article_id.category}}#</p>
        </div>
        <!-- 转发通知 -->
        <div v-if="item.atType == 'share'">
          <!-- {{item}} -->
          <img v-if="item.author_id.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author_id.avatar" alt="">
          <img v-else class="img" :src="img" alt="">


          <section class="right">
            <h5 v-if="item.author_id.name">{{item.author_id.name}}</h5>
            <h5 v-else>{{item.author_id.uname}} </h5>
            <span> {{item.time}} 来自[ {{item.author_id.school}} ]</span>
            <h4>{{'转发了'}}</h4>
          </section>
          <!-- {{item}} -->
          <p class="left">{{item.article_id.content}}#{{item.article_id.category}}#</p>
        </div>


      </div>
      <!-- {{}} -->
    </div>
    <!-- 若无 -->
    <div class="com" v-else>
      <p>
        <h1>没有相关信息通知</h1>
      </p>
    </div>


  </div>
</template>

<script>
  import img1 from "../assets/tushu.jpg";
  import axios from "axios";
  import { XHeader, Confirm } from "vux";
  export default {
    data: function () {
      return {
        img: img1,
        count: [],
        show: false
      };
    },
    components: {
      XHeader,
      Confirm
    },
    mounted: function () {
      axios
        .get("/host/message").then(resData => {
         
          this.count = resData.data.data;
        }).catch(error => {
        
          alert('系统错误');
        });
    },
    methods: {
      //  待定
      btnClick: function () { },
      delte: function (index) {
        
        var params = this.count[index];

        axios.post("/host/del/article", params)
          .then(resData => {
            console.log(resData.data);
            location.reload();
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
</script>
<style src="../css/messAge.css" scoped>
  /*@import "../css/messAge.css";*/
</style>