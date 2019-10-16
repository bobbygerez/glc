import { axios } from 'boot/axios'

export const setProducts = ({ commit }, payload) => {
  commit('setProducts', payload)
}

export const setProduct = ({ commit }, payload) => {
  commit('setProduct', payload)
}

export const setProductBranch = ({ commit }, payload) => {
  commit('setProductBranch', payload)
}

export const setProductMainCategory = ({ commit }, payload) => {
  commit('setProductMainCategory', payload)
}

export const setProductSubCategory = ({ commit }, payload) => {
  commit('setProductSubCategory', payload)
}

export const setProductMoreCategory = ({ commit }, payload) => {
  commit('setProductMoreCategory', payload)
}

export const searchProduct = ({ commit }, payload) => {
  payload.vm.start()
  axios.get(`/product-search?string=${payload.string}&page=${payload.page}&perPage=${payload.perPage}&catId=${payload.id}`)
    .then(res => {
      commit('setProducts', res.data.products)
      payload.vm.stop()
    })
}

export const setMainCategories = ({ commit }, payload) => {
  commit('setMainCategories', payload)
}

export const setSubCategories = ({ commit }, payload) => {
  commit('setSubCategories', payload)
}

export const setMoreCategories = ({ commit }, payload) => {
  commit('setMoreCategories', payload)
}

export const setGroups = ({ commit }, payload) => {
  commit('setGroups', payload)
}

export const setCatalogs = ({ commit }, payload) => {
  commit('setCatalogs', payload)
}
