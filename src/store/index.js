import Vue from 'vue'
import Vuex from 'vuex'

import users from './users'
import categories from './categories'
import products from './products'
import global from './global'
import roles from './roles'
import menus from './menus'
import accessRights from './access-rights'
import branches from './branches'
import provinces from './provinces'
import cities from './cities'
import brgys from './brgys'
import paymentOptions from './payment-options'
import payments from './payments'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      categories,
      users,
      products,
      global,
      roles,
      menus,
      accessRights,
      branches,
      provinces,
      cities,
      brgys,
      paymentOptions,
      payments
    },
    plugins: [createPersistedState()]
  })

  return Store
}
