<template>
  <div class="content">
    <div class="logo">
      <img src="../assets/logo.png" alt="" class="g-logo">
    </div>
    <div class="form">
      <form action="">

        <x-input class="input-con" :max="13" v-model="uname" title="手机号码" name="uname" keyboard="number"
                 is-type="china-mobile" required></x-input>
        <x-input class="input-con" title="请输入6-11位密码" type="password" v-model="password" :min="6" :max="11"
                 required></x-input>
      </form>
      <button @click="btnClick" class="btn">登录</button>

      <p class="thir"><a class="fir" href="#/zhuce">马上注册</a> | <a href="#/forget">忘记密码</a></p>
    </div>

    <div>
      <p v-if="error" class="error">{{error}}</p>
      <p class="vb">
        <divider>{{msg}}</divider>
        <!--<a href="#/aa">调试</a>-->
      </p>

      <tabbar class="foot">
        <tabbar-item class="con">
          <i slot="icon" class="fa fa-weixin icon"></i>
          <span slot="label">微信登录 </span>
        </tabbar-item>
        <tabbar-item class="con">
          <i slot="icon" class="fa fa-weibo icon"></i>
          <span slot="label">微博登录 </span>
        </tabbar-item>
        <tabbar-item class="con ">
          <i slot="icon" class="fa fa-qq icon"></i>
          <span slot="label"> QQ登录</span>
        </tabbar-item>
      </tabbar>
    </div>

  </div>
</template>

<script>
  import {Actionsheet, Alert, Tabbar, Divider, XInput, TabbarItem} from "vux";
  import axios from "axios";
  export default {
    data: function ()
    {
      return {
        uname: '',
        password: '',
        error: '',
        msg: '第三方登录'
      };
    },
    components: {
      Actionsheet,
      Alert,
      Tabbar,
      TabbarItem,
      XInput,
      Divider
    },
    methods: {
      btnClick: function ()
      {
        var parmas = {
          uname: this.uname,
          password: this.password,
        }
//        console.log(parmas)
        axios.post('/host/login', parmas).then((resData) => {

        this.error = resData.data.message
        if (resData.data.error == 0)
        {
          location.href = '#/shouye'
        }

      }).catch((err) =>{
//          console.log(err)
      alert('系统错误');
      })
      }
    }
  };
</script>

<style src="../css/home.css" scoped>
  /*@import "../css/home.css";*/
</style>
