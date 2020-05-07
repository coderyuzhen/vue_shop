import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '',
    redirect: 'Login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
//home路由以及子路由
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:'/welcome',
//  子路由
    children: [{
    	path: '/welcome',
    name: 'Welcome',
    component: Welcome
    },
    {
    path: '/users',
    name: 'Users',
    component: Users
    },
    {
    path: '/rights',
    name: 'Rights',
    component: Rights
  },
    {
    path: '/roles',
    name: 'Roles',
    component: Roles
  },
    {
    path: '/categories',
    name: 'Categories',
    component: Cate
  },{
    path: '/params',
    name: 'Params',
    component: Params
  },{
    path: '/goods',
    name: 'List',
    component: List
  },{
    path: '/goods/add',
    name: 'Add',
    component: Add
  }]
  }
]

const router = new VueRouter({
  routes
})

//挂载导航守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next()
	//获取token
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router
