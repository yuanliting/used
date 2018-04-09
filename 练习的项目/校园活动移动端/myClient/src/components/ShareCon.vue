<template>
  <div class="content">
    <x-header class="header">分享文章</x-header>
    <!-- <h2>发布文章</h2>  -->
    <x-input v-model="title" :placeholder="('标题')" disabled required></x-input>
    <x-textarea :max="300" name="description" v-model="ShareCon" required :placeholder="('发表内容')"></x-textarea>

    <!-- 转发 -->
    <p class="con">
      <span>转发</span>
      <a v-if="author.name" href=""> @{{author.name}} </a>
      <a v-else href=""> @{{author.uname}}</a>
      {{content}}
    </p>
    <button class="btn" @click="Share">转发</button>
    <p v-if="show" class="tip">标题/内容不能为空</p>
  </div>


</template>

<script>
  import axios from 'axios';
  import {XTextarea, Group, XInput, XHeader} from "vux";
  export default {
    data() {
      return {
        // 转发的文章内容
        content: "",
        title: "",
        show: false,
        // 转发文章id
        id: '',
        author: {},
        ShareCon: '',
        category: '',

      };
    },
    components: {
      XTextarea,
      Group,
      XInput,

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
      // 获取动态id
      fetchData() {
        var id = this.$route.params.id;

        axios.get("/host/edit/" + id).then(resData => {
          // console.log(resData.data.data)
          var article = resData.data.data;
        this.content = article.content;

        this.id = article._id;
        this.author = article.author;
        this.title = article.title;
        this.category = article.category

      })
      .
        catch(error => {
          console.log(error);
      })
        ;
      },

      Share: function ()
      {

        if (!this.ShareCon)
        {
          return this.show = !this.show
        }
        var parmas = {};
        parmas.title = this.title;
        parmas.content = this.ShareCon;
        parmas.id = this.id;
        parmas.category = this.category;
        parmas.article_author = this.author;

        axios.post('/host/share', parmas).then((resData) => {
          // console.log(resData.data)
          location.href = '#/shouye';
      }).
        catch((error) => {
          console.log(error)
      })

      },
    }
  };
</script>


<style scoped>
  .content {
    font-size: 0.3rem;
  }

  .btn {
    display: block;
    width: 35%;
    margin: 0.2rem auto;
    line-height: 0.5rem;
    border: none;
    background: darkorchid;
    border-radius: 0.3rem;
    color: white;
  }

  .tip {
    width: 40%;
    margin: 0.2rem auto;
    color: red;

  }

  .con {
    width: 70%;
    margin: 0.3rem auto;
    background: #eeeeee;
    /*height: 3rem;*/
    padding: 0.2rem;
    font-size: 0.25rem;
  }
</style>
