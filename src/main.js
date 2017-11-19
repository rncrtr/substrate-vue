// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'

// Import Components
import Hello from './components/Hello'
import About from './components/About'
import Login from './components/Login'
import Register from './components/Register'

require('./assets/sass/main.scss');

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Hello },
	{ path: '/about', component: About },
	{ path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
