import Vue from 'vue'
//vue的路由
import VueRouter from 'vue-router'
//这个首页
import Home from '../page/UserPage';
import UserAdd from '../page/UserAdd'
//用户页面

Vue.use(VueRouter);

const routes = [
    {
    path: '/',
    component: Home
},
{
    path: '/add',
    component: UserAdd 
}
]

export default new VueRouter({
    routes
})