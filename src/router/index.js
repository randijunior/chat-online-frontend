import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'

const routes = [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name : 'Login',
      component : Login,
      meta: { hideForAuth: true },
      props : true
    },
    {
      path: '/signup',
      name : 'Signup',
      component: Signup,
      meta: { hideForAuth: true }
    }
  ]

const router = new VueRouter({
  mode: 'history',
    routes
  });
  router.beforeEach((to, from, next) => {
    if ((to.name !== 'Login' && to.name !== 'Signup') && !(localStorage.getItem('token'))) next({ name: 'Login' })
    else next()
  });

  export default router