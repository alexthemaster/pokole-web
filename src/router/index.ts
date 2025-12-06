import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../components/admin/Admin.vue'
import Links from '../components/admin/Links.vue'
import Configuration from '../components/Configuration.vue'
import Login from '../components/Login.vue'

import Register from '../components/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },

    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/admin/links',
      name: 'links',
      component: Links
    },
    {
      path: '/settings',
      name: 'settings',
      component: Configuration
    }
  ]
})

import { isAuthenticated } from '../utils/auth'

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
