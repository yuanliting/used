<template>
    <div class="content">
        <div class="total">
       <nav>
           <h5>找回密码</h5>

       </nav>
       <div class="con-total">
           <p>请填写信息</p>
            <form action="">
                <x-input  class="input-tip"  should-toast-error :max="13" v-model="uname" title="手机号码" name="uname" keyboard="number" is-type="china-mobile" required></x-input>

                 <x-input class="input-tip" title="输入新密码" type="password" placeholder="" v-model="password" :min="6" :max="11" required ></x-input>
                 <x-input class="input-tip" title="请确认新密码" v-model="password2" type="password" placeholder="" :equal-with="password" required></x-input>
              <div class="flow"></div>

            </form>


       </div>
        <button ref="submit" class="submit" @click="btnClick">提交</button>

            <p v-if="error" class="error">{{error}}</p>
             </div>
        <div class="foote">
            <span>找回密码时,请仔细阅读<<<a href="https://segmentfault.com/tos">服务条款</a>>></span>
        </div>


    </div>

</template>

<script>
import axios from "axios";
import { XInput, Group, XButton, Cell } from "vux";
// 手机号正则表达式/^((133)|(149)|(153)|(17[3,7])|(18[0,1,5,2,9]))\\d{8}|(170[0-2])\\d{7}$/
export default {

  data: function() {
    return {
      datas: [

      ],
      uname:'',
      password:'',
      password2:'',
      error:''
    };
  },
  components: {
    XInput,
    Group,
    XButton,
    Cell
  },
  methods: {
        btnClick:function(){
           var password = this.password;
           var password2 = this.password2
           if(password != password2){
             return   this.error="两次输入密码不一致"
           }
            var parmas = {
                uname:this.uname,
                password:this.password,

            }

            axios.post('/host/forget',parmas).then((resData)=>{
//               console.log(resData);
                      this.error = resData.data.message

                //   location.href="#/";

            }).catch((err)=>{
            }).catch((err)=>{
            alert("系统错误");
            })
        },
        getClick:function(index){
                this.index = index;
//               console.log(this.index)
        },
     change (val) {
    //   console.log('on change', val)
    },

  }
};
</script>

<style src="../css/forGet.css" scoped>
/*@import "../css/forGet.css";*/
</style>
