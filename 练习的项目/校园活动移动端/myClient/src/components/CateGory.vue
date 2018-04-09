<template>
  <div class="content">
    <x-header>{{item}}</x-header>
    <!-- <h5>标题页面</h5> -->
    <div class="nav" v-if="show">
      <h4>{{item}}</h4>
      <button @click="btnClick" class="btn"> + 关注</button>
    </div>
    <div class="nav" v-if="!show">
      <h4>{{item}}</h4>
      <button @click="btnClick " class="btn"> 已关注</button>

    </div>
    <!-- ********文章显示************** -->
    <!-- 该模版若有文章则显示 -->
    <div class="con" v-if=" count.length > 0">

      <div class="con" v-for=" (item , index) in count" :key="index">
        <img v-if="item.author.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author.avatar" alt="">
        <img v-else class="img" :src="img" alt="">
        <section class="right">
          <h5 v-if="item.author.name">{{item.author.name}}</h5>
          <h5 v-else>{{item.author.uname}} </h5>
          <span> {{item.time}} 来自[ {{item.author.school}} ]</span>
        </section>
        <div class="con">
          <p>#<a :href="'#/cater/'+item.category">{{item.category}}</a># {{item.content}} </p>
          <p><img src="" alt=""></p>

          <p class="icon"><a :href="'#/share/'+item._id "><i class="fa fa-share"> 转发</i></a>

            <a :href="'#/commit/'+item._id"> <i class="fa fa-commenting-o"> 评论</i></a>
            <!-- <a href=""><i class="fa fa-thumbs-o-up">  点赞 </i></a> -->
            <!-- 测试作用 1  -->

            <button @click="dian(index)" v-if="item.author.follows.indexOf(item._id) < 0"><i class="fa fa-thumbs-o-up">点赞</i></button>
            <button @click="onClick_deClick(index)" v-show="item.author.follows.indexOf(item._id) >= 0"><i class="fa fa-thumbs-o-up">已赞</i>
            </button>

            <a :href="'#/commit/'+item._id">浏览次数{{item.click_num}}</a>
          </p>


        </div>

      </div>
      <!-- {{}} -->
    </div>
    <!-- 若无 -->
    <div class="com" v-if="count.length <= 0">
      <p>
      <h1>该标签还没有文章,请添加</h1></p>
    </div>


  </div>
</template>

<script>
  import img1 from "../assets/tushu.jpg";
  import axios from 'axios';
  import {XHeader} from 'vux';
  export default {
    data: function ()
    {
      return {
        item: '',
        show: true,
        count: [],
        img: img1,
        user: [],
        show2: [],
      };
    },
    computed: {},
    components: {
      XHeader
    },
    mounted() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.fetchData();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route: "fetchData"
    },
    methods: {
      onEvent(event) {
        console.log("on", event);
      },
      onItemClick(value, disabled) {
        console.log(value, disabled);
        if (!this.disabled)
        {
          this.showPopup = false;
        }
      },
      fetchData() {
        var id = this.$route.params.name;
        // console.log(id)
        this.item = id;
        var that = this.show;

        axios.get("/host/cater/" + id)
          .then(resData => {
          //  console.log(resData.data)
          this.count = resData.data.data;
        this.user = resData.data.user;
        this.user.forEach((item, index) => {
          // console.log(item)
          if(item == id
      )
        {
          this.show = false
        }
      })
        ;
      }).catch(error => {
//          console.log(error);
          alert("系统错误");
      });
      },
      // 关注模版****************************************待开发
      btnClick(){
        this.show = !this.show;
        var id = this.$route.params.name;

        if (!this.show)
        {
          axios.get('/host/like/' + id).then((resData) => {
//          console.log(resData.data);

          }
        ).
          catch((error) => {
//            console.log(error)
            alert(
            "系统错误"
        )
          ;
        })
        }
        else
        {
          axios.get('/host/defalike/' + id).then((resData) => {
            console.log(resData.data);

        }).
          catch((error) => {
//            console.log(error)
            alert(
            "系统错误"
        )
          ;
        })
        }

      },
      dian: function (index)
      {
        // 获取当前文章的id,school为所有文章的数组集合
        var id = this.count[index]._id;
        this.showId = id;
        // 点赞请求
        axios.post("/host/dian", {
            id: id
          })
          .then(resData => {
        location.reload();
       }).catch(error => {
          alert(
          "系统错误"
        )
        ;
       });
      },
      onClick_deClick(index)
      {
        var id = this.count[index]._id;
        // 取消点赞请求
        axios.post("/host/defdian", {
          id: id
        }).then(resData => {
          location.reload();
        }).catch(error => {
          alert("系统错误");
      }) ;

    },
  }
  }
</script>
<style src="../css/cateGory.css" scoped>
  /*@import "../css/cateGory.css";*/
</style>
