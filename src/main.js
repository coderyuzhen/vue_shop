import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入对应的样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

import axios from 'axios'

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
//配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
	console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})


Vue.prototype.$http = axios


//全局时间过滤器
Vue.filter( 'dateFormat', function(originVal) {
		const dt = new Date(originVal)
		const y = dt.getFullYear()
		const m = (dt.getMonth() + 1 + '').padStart(2,'0')
		const d = (dt.getDate() + ''). padStart(2, '0')
		const hh = (dt.getHours() + '').padStart(2, '0' )
		const mm = (dt.getMinutes() + '').padStart(2, '0')
		const ss = (dt.getSeconds() + '').padStart(2, '0')
		return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
