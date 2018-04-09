<template>
    <div class="content">
        <h5>资料设置</h5>
        <div class="con">
            <section class="one">
                <cell  link = "/message" >
        <span  slot="title" style="color:red;"><span style="vertical-align:middle;">{{ ('消息') }}</span> <badge :text="num"></badge></span>
      </cell>
            </section>

        <!-- <cell :title="('消息通知')" link="/component/radio" ></cell> -->
        <section class="one">
             <cell class="cell" :title="('账号管理')" link="/userCenter" ></cell>
        <cell class="cell" :title="('手机号码')" link="/radio" >{{tephone}}</cell>
        </section>

       <section class="one">
 <cell class="cell" :title="('个人主页')" link="/user/article" ></cell>
       </section>
       <section class="one">
            <cell class="cell" :title="('功能')" link="/radio" ></cell>
             <cell class="cell" :title="('辅助功能')" link="/radio" ></cell>
              <cell class="cell" :title="('设备锁,账号安全')" link="/radio" ></cell>
       </section>
        <section  class="one">
 <cell class="cell" :title="('关于与帮助')" link="/radio" ></cell>
       </section>
       <button class="logout" @click="logout">退出</button>

        </div>
         <tabbar class="footer">
      <tabbar-item link="/shouye"  >
        <!-- <img slot="icon" src="../assets/demo/icon_nav_button.png"> -->
        <i  slot="icon"  class="fa fa-star-o"></i>
        <span slot="label">{{('动态')}}</span>
      </tabbar-item>
      <tabbar-item  link="/seccon" show-dot>
        <!-- <img slot="icon" src="../assets/demo/icon_nav_msg.png"> -->
        <i slot="icon" class="fa fa-heart-o"></i>
        <span  slot="label">{{('关注模版')}}</span>
      </tabbar-item>
      <tabbar-item  link="/thidcon">


        <i slot="icon" class="fa fa-cube"></i>
        <span slot="label">{{('杂谈信息')}}</span>

      </tabbar-item>
      <tabbar-item selected link="/forcon">

        <i slot="icon"  class="fa fa-user-o"></i>
        <span slot="label">{{('我的')}}</span>
      </tabbar-item>
    </tabbar>
        <!-- <footer-con></footer-con> -->
    </div>
</template>

<script>
import HeaderCon from '../components/HeaderCon';
import FooterCon from '../components/FooterCon';
import axios from "axios";
import { Cell, CellBox, CellFormPreview, Group, Badge,Tabbar,TabbarItem} from "vux";
export default {
  data() {
    return {
      // 手机号码
      tephone:'',
      num:''
    };
  },
  components: {
    Group,
    Cell,
    CellFormPreview,
    CellBox,
    Badge,
    HeaderCon,
    FooterCon,
    Tabbar,TabbarItem
  },
  methods: {
    logout: function() {
      axios
        .get("/host/tuichu")
        .then(resData => {

          location.href = "#/logout";
        })
        .catch(error => {
        alert("发生错误");
        });
    },

  },
    mounted:function(){
        axios.get('/host/getUser').then((resData)=>{

          this.num = resData.data.data;
            var arr = resData.data.tephone;

           this.tephone = arr.substr(0, 3) + '****' + arr.substr(7);
        }).catch((error)=>{
        alert("发生错误");
        })
    }
};
</script>

<style scoped>
.content {
  width: 7.5rem;
  font-size: 0.32rem;
  background: #eeeeee;
}
.content h5 {
  width: 100%;
  background: white;
  position: fixed;
  top: -.01rem;
  line-height: .6rem;
  padding: 0.15rem;
  text-align: center;
  z-index: 100;
  font-size: 0.3rem;
  border-bottom: #eeeeee solid 1px;
  margin: 0;
  /*padding: 0;*/
}
.content .con {
  margin-top:1.15rem;
}
.con .one {
  margin-top: 0.4rem;
  background: white;
}
.logout {
  border: none;
  width: 100%;
  margin-top: 0.8rem;
  display: block;
  line-height: 0.5rem;
  padding: 0.2rem;
  background: red;
  color: white;
  font-size: .32rem;
  margin-bottom: 1.5rem;
}
.cell {
  line-height: 0.54rem;
}
.footer{
    position: fixed;
    bottom: 0px;
}
</style>
