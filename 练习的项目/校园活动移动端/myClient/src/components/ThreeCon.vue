<template>
    <div class="content">

      <div class="select-con">
        <p class="select-icon" :class="five == 'true'?'seleced':''"  @click="select('school')" >校内信息</p>
        <p class="select-icon" :class="five == 'false'?'seleced':''" @click="select('outside')" >校外江湖</p>
      </div>
        <div v-if="five =='true'" class="fir table ">
            <aside>
                <h4 :class="index == 0?'color':''" ref="index" v-for="(data,index) in data" :key="index" @click="xuan(index)">
                     {{data}}</h4>
             </aside>
            <div class="cate">

            <ul v-if="show" class="one color">
                <li v-for="(data,index) in  data1" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>
            <ul v-if="one" class="two" >
                <li v-for="(data,index) in data2" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>
            <ul v-if="two" class="three">
                <li v-for="(data,index) in data3" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>
            <ul v-if="three" class="four">
                <li v-for="(data,index) in data4" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>
            <ul v-if="four" class="five">
                <li v-for="(data,index) in data5" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>

            </div>

        </div>
        <div v-if="five =='false' " class="sec table">
            <ul class="six">
                <li v-for="(data,index) in data6" :key="index">
                    <a :href="'#/cater/'+data">{{data}}</a>
                </li>
            </ul>
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
      <tabbar-item selected link="/thidcon">


        <i slot="icon" class="fa fa-cube"></i>
        <span slot="label">{{('杂谈信息')}}</span>

      </tabbar-item>
      <tabbar-item link="/forcon">

        <i slot="icon" class="fa fa-user-o"></i>
        <span slot="label">{{('我的')}}</span>
      </tabbar-item>
    </tabbar>
      <!-- <footer-con></footer-con> -->
    </div>
</template>
<script>
import HeaderCon from '../components/HeaderCon';
import FooterCon from '../components/FooterCon';
import {
  Tab,
  TabItem,
  Sticky,
  Divider,
  XButton,
  Swiper,
  SwiperItem,
   Tabbar,
    TabbarItem
} from "vux";
export default {
  data() {
    return {

      demo2: "校内频道",
      index: 0,
      show: true,
      one: false,
      two: false,
      three: false,
      four: false,
      five: 'true',
      data: ["新生咨询", "学习平台", "社团活动", "物品交换", "平常小聊"],
      data1: ["学校纪年表", "吃货餐厅", "学校门派", "校园景色", "建筑分布", "宿舍条件", "录取条件"],
      data2: [ "难题解答",  "原创小说", "技能学习","考试互助","知识百科交流","考研资料共享", "专业知识分享"],
      data3: ["社团活动时间", "平常爱好交流","校内活动", "爱好加盟"],
      data4: ["闲置交通工具交换", "外出旅游设备交换", "校内物品交换", "资料图书交换"],
      data5: ["课程信息", "考试", "活动", "物品交换", "娱乐八卦", "游戏竞技"],
      data6: ["好店推荐", "兼职信息", "优惠活动", "旅游组团", "吃货频道"]
    };
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
     HeaderCon,
    FooterCon,
     Tabbar,
    TabbarItem
  },
  methods: {
    select($action)
    {
      if($action == 'school'){

        this.five = 'true';

      } else if($action == 'outside')
      {
        this.five = 'false';
      }

    },
    xuan: function(index) {
      // console.log(this.$refs.index)
      var id = index;

      this.$refs.index.forEach((el, index) => {
        if (index == id) {
          this.$refs.index[index].className = "color";
        } else {
          this.$refs.index[index].className = " ";
        }
      });

      if (index == 0) {
        this.show = true;
        this.one = false;
        this.two = false;
        this.three = false;
        this.four = false;
      } else if (index == 1) {
        this.show = false;
        this.one = true;
        this.two = false;
        this.three = false;
        this.four = false;
      } else if (index == 2) {
        this.show = false;
        this.one = false;
        this.two = true;
        this.three = false;
        this.four = false;
      } else if (index == 3) {
        this.show = false;
        this.one = false;
        this.two = false;
        this.three = true;
        this.four = false;
      }
      if (index == 4) {
        this.show = false;
        this.one = false;
        this.two = false;
        this.three = false;
        this.four = true;
      }
    }
  },
  mounted: function() {
    this.$refs.index[0].className = "color";
  }
};
</script>

<style src="../css/threeCon.css" scoped>
/*@import "../css/threeCon.css";*/
</style>
