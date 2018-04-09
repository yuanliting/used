<template>
    <div class="content">
       <nav>
           <h5 class="title">绑定手机号</h5>
           <button ref="submit" class="submit" @click="btnClick">提交</button>
       </nav>
       <div class="con">
           <p class="tip">输入手机号/密码,成注册</p>
            <form action="">
                <x-input   should-toast-error :max="13" v-model="uname" title="手机号码" name="uname" keyboard="number" is-type="china-mobile" required></x-input>
                <!-- <input v-model="uname" type="text"  placeholder="请输入你的手机号码" required><br> -->
                 <x-input title="请输入6-11位密码" type="password" placeholder="" v-model="password" :min="6" :max="11" required ></x-input>
                 <x-input title="请确认6-11位密码" v-model="password2" type="password" placeholder="" :equal-with="password" required></x-input>

            </form>
            <p class="tip">确认教育信息</p>

       </div>

        <!-- 学校信息 -->
        <div class="select">
          <div>
                <span  class="cather"> {{'学校'}}</span>
                <select class="sel"  id="" v-model="data.school">
                  <option v-for="(item, ins) in data1" :key="ins" :value="item" >{{item}}</option>
                </select>
          </div>
             <div class="side">
            </div>
        </div>
<!-- 专业信息 -->
          <div class="select">
          <div>
                <span class="cather"> {{'学院'}}</span>
                <select  class="sel"  v-model="data.acad">
                  <option v-for="(item, ins) in data2" :key="ins" :value="item" >{{item}}</option>
                </select>
          </div>
             <div class="side">
            </div>
        </div>
        <!-- 学年 -->
             <div class="select">
          <div>
                <span class="cather"> {{'学年'}}</span>
                <select  class="sel"  v-model="data.age" >
                  <option v-for="(item, ins) in data3" :key="ins" :value="item" >{{item}}</option>
                </select>
          </div>
             <div class="side">
            </div>
        </div>
        <!-- 学历 -->
           <div class="select">
          <div>
                <span class="cather"> {{'学历'}}</span>
                <select class="sel"  v-model="data.education">
                  <option v-for="(item, ins) in data4" :key="ins" :value="item" >{{item}}</option>
                </select>
          </div>
             <div class="side">
            </div>
             <div class="hidden"></div>
        </div>






    <p class="flow">注册后表示你同意<a href="https://segmentfault.com/tos">《表表使用条款与隐私政策》</a></p>
    <p v-if="error" class="error">{{error}}</p>
        <div class="foote">
            <span>已有平台账号,<a href="#/">点击去登录>></a></span>
        </div>
    </div>

</template>

<script>
import axios from "axios";
import { XInput, Group, XButton, Cell } from "vux";
// 手机号正则表达式/^((133)|(149)|(153)|(17[3,7])|(18[0,1,9]))\\d{8}|(170[0-2])\\d{7}$/
export default {

  data: function() {
    return {

      uname:'',
      password:'',
      password2:'',
      index:0,
      error:'',
      data:{

      },
      data1:["河南科技学院", "新乡医学院", "新乡学院", "河南职业技术学院", "河南师范大学"],
      data2:["信息工程学院", "外国语学院", "机电学院", "食品工程学院", "数学学院"],
      data3:["2017年", "2016年", "2015年", "2014年", "2013年"],
      data4:["本科/专科", "研究生", "博士"],
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
                school:this.data.school,
                acad:this.data.acad,
                age:this.data.age,
                education:this.data.education,

            }

            axios.post('/host/zhuce',parmas).then((resData)=>{
                    console.log(resData.data.error)
                    console.log(1234,resData.data)
                    if(resData.data.error == 1){
                      this.error = resData.data.message
                    }
                    if(resData.data.error == 0){
                        location.href="#/";
                    }

            }).catch((err)=>{
            alter("发生错误");
            })
        },
        getClick:function(index){
                this.index = index;
        },
     change (val) {
    },


  }
};
</script>

<style src="../css/resTig.css" scoped>
/*@import "../css/resTig.css";*/
</style>
