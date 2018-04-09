<template>
    <div class="content">
        <x-header>头像修改</x-header>
    <div class="auto-wrap">
    <form action=" "  ref="auto" enctype="multipart/form-data">
        <div class="auto-inp">
          <img src="" id="show" alt="" width="200"><br>
            <input id="file" class="filepath" type="file" accept="img/*" name="auto" @change="changepic(this)"><br>



        </div><br>
<button type="submit" @click.prevent="updata">修改</button>
    </form>

    </div>

    </div>

</template>
<script>
import {XHeader} from 'vux';
import axios from 'axios';
export default {
    data:function(){
        return {
            user:''
        }
    },
    components:{
        XHeader,
    },
    methods:{
        updata:function(){
            var fabu = this.$refs.auto;
            // console.log(fabu);
            var data = new FormData(fabu);
            const that = this;
        var config ={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        };
        axios.post('/host/imageupload',data,config).then((resData)=>{

          location.href = '#/userCenter'
        }).catch((error)=>{
//                console.log(error);
          alert("系统错误")
        })
        },
     changepic() {
  var reads= new FileReader();
  var f=document.getElementById('file').files[0];
  reads.readAsDataURL(f);
  reads.onload=function (e) {
    document.getElementById('show').src=this.result;
  };
}

    }

}
</script>

<style scoped>
.auto-inp{
  width: 7.5rem;
  text-align: center;

}
.auto-inp input{
    width: 3rem;
    height:1rem;
}
.auto-wrap form{

    margin: 1rem auto;
}
.auto-wrap form button{
    display: block;
    width: 90%;
    line-height:0.7rem;
    border: none;
    margin: 0.2rem auto;
    border-radius: 0.25rem;
    background: darkcyan;
  color: white;
}
  #show{
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
</style>
