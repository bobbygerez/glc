import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  LocalStorage,
  Notify
} from 'quasar'
import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.needAuth)) {
      // console.log('route from =>', from)
      // console.log('route to =>', to)
      // console.log('route next =>', next)
      if (!store.getters['users/token']) {
        Notify.create({
          icon: 'warning',
          color: 'negative',
          message: 'You need to login.'
        })
        LocalStorage.clear()
        next('/login')
      } else {
        // console.log('to', to)
        // store.dispatch('globals/setPageMeta', to.meta)
        next()
      }
    } else {
      next() // make sure to always call next()!
    }
  })
  return Router
}
