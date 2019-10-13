import {
  Platform
} from 'quasar'
import axios from 'axios'

/**
 * Axios plugin declaration
 * @author renren@ixbase.net
 */

/**
 * Used for intercepting axios requests and responses
 * and logging it in the console, useful when testing
 * @param {*} isIntercept boolean pass true to intercept
 * requests otherwise pass false
 */
const intercept = (isIntercept) => {
  if (!isIntercept) {
    return
  }
  // register a standard request interceptor
  axios.interceptors.request.use(config => {
    // Do something before request is sent
    console.log('%c[REQUEST] sent -> ' + config.url, 'color: blue; font-weight: bold;', config)
    return config
  }, error => {
    // Do something with request error
    // console.log('%c[REQUEST] error -> ' + error.config.url, 'color: red; font-weight: bold;', error.message || error)
    return Promise.reject(error)
  })
  // Add a response interceptor
  axios.interceptors.response.use(response => {
    // Do something with response data
    console.log('%c[RESPONSE] received -> ' + response.config.url, 'color: green; font-weight: bold;', response)
    return response
  }, error => {
    // Do something with response error
    /**
     * @error object
     * @response only exist if the server responded with an error     *
     */
    console.log('%c[RESPONSE] error ->' + error.config.url, 'color: red; font-weight: bold;', error.response || error.message)
    // return the error object
    return Promise.reject(error)
  })
}

/**
 * Convenience function for getting the baseUrl
 * that will be used in the axios requests
 * @param {*} type String object literal
 * @returns String used for axios baseUrl
 */
const appMode = (type) => ({
  'live': 'http://another.iitcebu.net/api',
  'test': 'http://127.0.0.1:8099/api',
  'local': 'http://192.168.254.2:90/api',
  get mobile () {
    return Platform.is.cordova ? this.local : this.test
  }
})[type]

/**
 * Default exported object
 */
export default ({
  Vue,
  store
}) => {
  // set base url appMode params: 'live', 'test', 'local', 'mobile'
  axios.defaults.baseURL = appMode('test')
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  intercept(false)

  // request interceptor
  axios.interceptors.request.use(config => {
    console.log('%c[REQUEST] sent -> ' + config.url, 'color: blue; font-weight: bold;', config)
    return config
  }, error => {
    console.log('%c[REQUEST] error -> ' + error.config.url, 'color: red; font-weight: bold;', error.message || error)
    return Promise.reject(error)
  })
  // Add a response interceptor
  axios.interceptors.response.use(response => {
    console.log('%c[RESPONSE] received -> ' + response.config.url, 'color: green; font-weight: bold;', response)
    // if (store.getters['globals/getHandleAsyncValidation']) {
    //   store.dispatch('globals/setServerErrorResponse', null)
    // }
    return response
  }, error => {
    console.log('%c[RESPONSE] error ->' + error.config.url, 'color: red; font-weight: bold;', error.response || error.message)
    // if (error.response) {
    // if has response save to store
    // console.log('server error response =>', error.response.data)
    // if (store.getters['globals/getHandleAsyncValidation'] && error.response) {
    //   store.dispatch('globals/setServerErrorResponse', error.response.data.message)
    // }
    // }
    return Promise.reject(error)
  })

  const token = store.getters['users/token']
  if (token) {
    setAuthHeader(token)
  }

  Vue.prototype.$axios = axios
}
export const setAuthHeader = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

/**
 * unset the header part of your axios instance
 * in logging out or token expiry etc..
 */
export const unSetAuthHeader = () => {
  axios.defaults.headers.common['Authorization'] = null
}
// import this instance for use in other files other than vue
// in the case that you have no access of the Vue.prototype version this.$axios
// it is so you are using the same axios instance accross your code
export {
  axios
}
