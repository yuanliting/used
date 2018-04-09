<template>
  <div class="content">
    <div class="select-con">
      <p class="select-icon" :class="show == 'true'?'seleced':''" @click="select('school')">校内信息</p>
      <p class="select-icon" :class="show == 'false'?'seleced':''" @click="select('outside')">校外江湖</p>
    </div>
    <div v-if="show == 'true'" class="fir-con">
      <div class="con" v-for=" (item , index) in shool" :key="index">

        <img v-if="item.author.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author.avatar" alt="">
        <img v-else class="img" :src="img" alt="">
        <section class="right">
          <h5 v-if="item.author.name">{{item.author.name}}</h5>
          <h5 v-else>{{item.author.uname}} </h5>
          <span> {{item.time}} 来自[ {{item.author.school}} ]</span>
        </section>
        <div class="con">
          <p>#<a :href="'#/cater/'+item.category">{{item.category}}</a># {{item.content}} </p>
          <!--
					转发文章的显示
					 -->
          <p v-if="item.share_article"><span>转发了
                     <a v-if="item.article_author.name" href="">@{{item.article_author.name}}</a>
                     <a v-else href="">@{{item.article_author.uname}}</a>
                     </span>
            {{item.share_article.content}}</p>
          <p class="icon">
            <!-- 分享 -->
            <a :href="'#/share/'+item._id "><i class="fa fa-share"> 转发</i></a>
            <a :href="'#/commit/'+item._id"> <i class="fa fa-commenting-o"> 评论</i></a>
            <!-- 测试作用 1  -->

            <button @click="dian(item._id)" v-if="show2.indexOf(item._id) < 0"><i class="fa fa-thumbs-o-up">点赞</i></button>
            <button @click="onClick_deClick(item._id)" v-show="show2.indexOf(item._id) >= 0"><i class="fa fa-thumbs-o-up">已赞</i>
            </button>
            <a :href="'#/commit/'+item._id">浏览次数{{item.click_num}}</a>
          </p>
        </div>

      </div>

    </div>

    <div v-if="show == 'false'" class="fir-con">
      <div class="con" v-for=" (item , index) in border" :key="index">
        <img v-if="item.author.avatar" class="img" :src="'http://localhost:3000/uploads/'+item.author.avatar" alt="">
        <img v-else class="img" :src="img" alt="">
        <section class="right">
          <h5 v-if="item.author.name">{{item.author.name}}</h5>
          <h5 v-else>{{item.author.uname}} </h5>
          <span> {{item.time}} 来自[ {{item.author.school}} ]</span>
        </section>
        <div class="con">

          <p>#<a :href="'#/cater/'+item.category">{{item.category}}</a># {{item.content}} </p>
          <!--
			转发文章的显示
			 -->
          <p v-if="item.share_article"><span>转发了
            <!-- {{item.article_author}} -->
                     <a v-if="item.article_author.name" href="">@{{item.article_author.name}}</a>
                     <a v-else href="">@{{item.article_author.uname}}</a>
                     </span>
            {{item.share_article.content}}</p>
          <p class="icon">
            <!-- 分享 -->
            <a :href="'#/share/'+item._id "><i class="fa fa-share"> 转发</i></a> <a :href="'#/commit/'+item._id"> <i
            class="fa fa-commenting-o"> 评论</i></a>
            <!-- 测试  2 -->
            <button @click="dian(item._id)" v-show="show2.indexOf(item._id) < 0"><i class="fa fa-thumbs-o-up"> 点赞 </i>
            </button>
            <button @click="onClick_deClick(item._id)" v-show="show2.indexOf(item._id) >= 0"><i class="fa fa-thumbs-o-up">已赞</i>
            </button>


            <a :href="'#/commit/'+item._id">浏览次数{{item.click_num}}</a>
          </p>
        </div>

      </div>

    </div>
    <p class="fiex"><a href="#/fabu">
      <x-icon type="ios-plus" size="50"></x-icon>
    </a></p>
    <!--显示下拉加载按钮-->

    <div class="load-more">
      <!--<load-more :tip="('正在加载')"></load-more>-->
      <load-more :show-loading="false" :tip="('暂无数据')" background-color="#fbf9fe"></load-more>
    </div>

    <!-- ******************************ceshi**************************** -->
    <tabbar class="footer">
      <tabbar-item selected link="/shouye">

        <i slot="icon" class="fa fa-star-o"></i>
        <span slot="label">{{('动态')}}</span>
      </tabbar-item>
      <tabbar-item link="/seccon" show-dot>

        <i slot="icon" class="fa fa-heart-o"></i>
        <span slot="label">{{('关注模版')}}</span>
      </tabbar-item>
      <tabbar-item link="/thidcon">

        <!-- <div> -->
        <i slot="icon" class="fa fa-cube"></i>
        <span slot="label">{{('杂谈信息')}}</span>
        <!-- </div> -->
      </tabbar-item>
      <tabbar-item link="/forcon">

        <i slot="icon" class="fa fa-user-o"></i>
        <span slot="label">{{('我的')}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import axios from "axios";
  import img1 from "../assets/tushu.jpg";
  // import { Tab, TabItem, Sticky } from "vux";
  import {
    Search,
    Group,
    Cell,
    XButton,
    ButtonTab,
    ButtonTabItem,
    Tabbar,
    TabbarItem,
    Tab,
    TabItem,
    Sticky,
    LoadMore
  } from "vux";
  import HeaderCon from "../components/HeaderCon";
  export default {
    data() {
      return {
        show: 'true',
        img: img1,
        cat1: ["好店推荐", "兼职信息", "优惠活动", "旅游组团", "吃货频道"],
        shool: [],
        border: [],
        show1: false,
        num: 0,
        Count: 1,
        //判断用户是否已经点赞
        show2: [],
        showId:'',
        loadMore:false,

      };
    },
    // prop :['badge'],
    components: {
      Search,
      Group,
      Cell,
      XButton,
      ButtonTab,
      ButtonTabItem,
      Tabbar,
      TabbarItem,
      HeaderCon,
      Tab,
      TabItem,
      Sticky,
      LoadMore
    },
    methods: {
      select($action)
      {

        if ($action == "school")
        {
          this.show = 'true';

        }
        else if ($action = 'outside')
        {
          this.show = 'false';
        }
      },

      dian: function ($id)
      {
        // 获取当前文章的id,school为所有文章的数组集合
        console.log($id)
        var id = $id;
        this.showId = $id;
        // 点赞请求
        axios.post("/host/dian", {
            id: id
          })
          .then(resData => {
          // 判断点赞显示的条件
//              console.log(resData.data);
          this.show2.push(resData.data.data);
//        location.reload();
      }).catch(error => {
          alert("系统错误");
      });

      },
      onClick_deClick($id)
      {
        var id = $id;
        // 取消点赞请求
        axios.post("/host/defdian", {
          id: id
        }).then(resData => {
        location.reload();
        }
      ).
        catch(error => {
          alert("系统错误");
      })  ;
      }

    },
    mounted: function ()
    {
      var that = this;

      axios
        .get(`/host/show/?limit=${that.Count}`)
        .then(resData => {
        // 判断是否为校外消息 还是校内消息
        // console.log(resData.data)
        this.num = resData.data.num;
      this.show2 = resData.data.user.follows;
      var arr1 = this.cat1;
      var arr2 = [];
      var arr3 = [];
      resData.data.data.forEach(function (item, ins)
      {
        // console.log(this)
        arr1.forEach(function (arr, index)
        {
          // console.log
          if (arr == item.category)
          {
            arr2.push(item);
            resData.data.data.splice(ins, 1);
          }
        });
      });
      arr3 = resData.data.data;

      this.shool = arr3;
      this.border = arr2;
      // 加载更多..************************.....
      var isMore = false;
      //滚动加载更多...
      window.onscroll = function ()
      {
        // 获取body内容的高度
        var height = document.body.clientHeight;
        // 滚动偏移量
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 获取/窗口的高度
        var windowH = window.innerHeight;
        // console.log(scrollTop + windowH > height - 10)
        if (scrollTop + windowH > height - 10)
        {
//           console.log(isMore)
          if (!isMore)
          {
            isMore = true;

            that.Count += that.Count;


          axios.get(`/host/show/?limit=${that.Count}`).then(resData => {
              //判断是否为校外消息,还是校内消息
//                console.log(resData.data)
            that.num = resData.data.num;
            that.show2 = resData.data.user.follows;
            var arr1 = that.cat1;
            var arr2 = [];
            var arr3 = [];
            resData.data.data.forEach(function (item, ins)
            {

              arr1.forEach(function (arr, index)
              {

                if (arr == item.category)
                {
                  arr2.push(item);
                  resData.data.data.splice(ins, 1);
                }
              });
            });
            arr3 = resData.data.data;
            that.shool = arr3;
            that.border = arr2;
            isMore = false;

          });
          }
        }
      };
    }).catch(error => {
       alert('系统错误');
    });
    }
  };
</script>

<style scoped>

  .content {
    font-size: 0.28rem;
    margin-top: 0.8rem;
  }

  .select-con {
    overflow: hidden;
    width: 7.5rem;
    position: fixed;
    top: 0;
    background: white;
  }

  .select-con .select-icon {
    float: left;
    text-align: center;
    width: 50%;
    line-height: 0.8rem;
    border-bottom: solid 1px #cccc77;
  }

  .select-con .seleced {
    z-index: 99;
    border-bottom: solid 1px red;
    color: red;

  }

  .fir-con {
    width: 7.5rem;
    margin-bottom: 0.7rem;
  }

  .img {
    width: .9rem;
    height: .9rem;
    margin: 0.1rem;
    border-radius: 50%;
  }

  .con {
    width: 100%;
    overflow: hidden;
    border: solid 1px #eeeeee;
    background: white;
    padding: 0.2rem;
  }

  .con .img {
    display: block;
    float: left;
  }

  .con .right {
    float: left;
    padding: 0.2rem;
  }

  .con .right h5 {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  .con .right span {
    color: #aaaaaa;
    font-size: 0.25rem;
  }

  .con .icon {
    /*border: solid 1px #eee;*/
    margin-top: 0.3rem;
    line-height: 0.58rem;
  }

  .con .icon a {
    display: block;
    width: 24%;
    float: left;
    text-align: center;
    color: #aaaaaa;
  }

  .vux-x-icon {
    fill: #f70968;
  }

  .cell-x-icon {
    display: block;
    fill: green;
  }

  .fiex {
    position: fixed;
    bottom: 1.5rem;
    right: 0.8rem;
  }

  .footer {
    position: fixed;
    bottom: 0px;
  }

  .icon button {
    border: none;
    width: 24%;
    line-height: 0.36rem;
    background: white;
    color: #aaaaaa;
  }
  .load-more{
    /*margin-top: 0.5rem;*/
    margin-bottom:1.5rem;
  }
  a{
    color:#7aa6da;
  }
</style>
