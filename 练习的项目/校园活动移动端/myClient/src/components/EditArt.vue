<template>
    <div class="content">
<x-header class="header">编辑文章</x-header>

      <x-input v-model="title" :placeholder="('标题')"  disabled required></x-input>
      <x-textarea :max="300" name="description" v-model="content"  required :placeholder="('发表内容')"></x-textarea>
         <button class="btn" @click="updata">编辑</button>
         <p v-if="show" class="tip">内容不能为空</p>



    </div>

    </div>

    </div>
</template>

<script>
import axios from 'axios';
import { XTextarea, Group, XInput, XHeader } from "vux";
export default {
  data() {
    return {
      content: "",
      title: "",
      show:false,
      id:''



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

      axios.get("/host/edit/"+id).then(resData => {

             var article = resData.data.data;
            this.title = article.title;
            this.content = article.content;
            this.id = article._id;

        })
        .catch(error => {
          console.log(error);
        });
    },
    // 发布文章
    updata:function(){

            if(!this.content){
               return  this.show = ! this.show
            }
            var parmas = {};
            parmas.title = this.title;
            parmas.content = this.content;

            var id = this.id;

    axios.post('/host/edit/'+id,parmas).then((resData)=>{
                    // console.log(resData)
                    location.href = '#/commit/'+id;
    }).catch((error)=>{
            console.log(error)
    })



    },
  }
};
</script>


<style scoped>
.content{
  font-size: 0.3rem;
}

.btn{
    display: block;
    width: 35%;
    margin: 0.3rem auto;
    line-height:0.5rem;
    border: none;
    background: darkorchid;
    border-radius:0.25rem;
    color: white;
}
.tip{
    margin: 0.6rem auto;
  text-align: center;
    color: red;

}
</style>
