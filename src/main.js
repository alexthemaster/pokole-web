import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.use(VueMaterial)

Vue.config.productionTip = false

import App from './App.vue'
import './assets/main.css'

import Login from './components/login.vue'
import Logout from './components/logout.vue'
import Register from './components/register.vue'
import Admin from './components/admin/admin.vue'
import Links from './components/admin/links.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/admin', component: Admin },
  { path: '/admin/links', component: Links }
]

const router = new VueRouter({routes})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')