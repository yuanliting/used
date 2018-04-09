import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from "../pages/Home.vue";

import ResTig from "../pages/ResTig.vue";
import UserCenter from '../pages/UserCenter.vue';

import FirCon from '../components/FirCon.vue';
import SecCon from '../components/SecCon.vue';
import ThreeCon from '../components/ThreeCon';
import ForCon from '../components/ForCon.vue';
import FaBu from '../components/FaBu.vue';
import ComMit from '../components/ComMit.vue';
import CateCory from '../components/CateGory.vue';
import ArtCenter from '../components/ArtCenter.vue';
import ChanImg from '../components/ChanImg.vue';
import ForGet from '../components/ForGet.vue';
import MessAge from '../components/MessAge.vue';
import radio from "../components/radio.vue";
import ErrorMes from "../components/ErrorMes.vue";
import EditArt from "../components/EditArt.vue";
import ShareCon from "../components/ShareCon.vue";


export default new Router({
  routes: [
    {
      path: '/',
      name:"首页登陆页",
      component: Home,


    },

    // cesi代码**************************
    {
      path: '/zhuce',
      name:"注册页面",
      component: ResTig,

    },
    {
      path: '/shouye',
      name:"首页部分",
      component: FirCon,

    },
    {
      path: '/radio',
      name:"功能开发页面",
      component: radio
    },
    {
      path:'/logout',
      name:"退出",
      component:Home
    },
    {
      path:'/userCenter',
      name:"个人中心",
      component:UserCenter,

    },
    {
      path:'/fircon',
      name:"动态页面",
      component:FirCon
    },
    {
      path:'/seccon',
      name:"关注模板",
      component:SecCon
    },
    {
      path:'/thidcon',
      name:"模板分类板块",
      component:ThreeCon
    },
    {
      path:'/forcon',
      name:"我的",
      component:ForCon
    },
    {
      path:'/fabu',
      name:"文章发布",
      component:FaBu
    },
    {
      path:'/commit/:id',
      name:"文章评论功能",
      component:ComMit
    },
    {
      path:'/cater/:name',
      name:"分类详情",
      component:CateCory
    },
    {
      path:'/user/article',
      name:"个人文章详情",
      component:ArtCenter
    },
    {
      path:'/change',
      name:"修改图像",
      component:ChanImg
    },
    {
      path:'/forget',
      name:"忘记密码",
      component:ForGet
    },
    {
      path:'/message',
      name:"通知页面",
      component:MessAge
    },{
      path:'/error',
      name:"错误页面",
      component:ErrorMes
    },
    {
      path:'/edit/:id',
      name:"文章编辑页面",
      component:EditArt
    },
    {
      path:'/share/:id',
      name:"分享页面",
      component:ShareCon
    }

  ]
})
//
