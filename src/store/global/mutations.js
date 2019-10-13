import _ from 'lodash'

export const setLeftDrawer = (state, payload) => {
  state.leftDrawer = payload
}

export const setBreadCrumbs = (state, payload) => {
  state.breadCrumbs = payload
}

export const setCart = (state, payload) => {
  state.cart.push(payload)
}

export const setDefaultCart = (state, payload) => {
  state.cart = payload
}

export const setQty = (state, payload) => {
  state.qty = payload
}

export const setTotalCart = (state) => {
  state.totalCart = _.sumBy(state.cart, (i) => {
    return (parseFloat(i.product.price) * i.qty) + state.deliveryPrice
  })
}

export const deleteCartRow = (state, payload) => {
  state.cart.splice(payload, 1)
}

export const setProvinces = (state, payload) => {
  state.provinces = payload
}

export const setDelCities = (state, payload) => {
  state.delCities = payload
}

export const setCities = (state, payload) => {
  state.cities = payload
}

export const setBrgys = (state, payload) => {
  state.brgys = payload
}

export const setDelBrgys = (state, payload) => {
  state.delBrgys = payload
}

export const setSearchStringProduct = (state, payload) => {
  state.searchStringProduct = payload
}

export const setDeliveryPrice = (state, payload) => {
  state.deliveryPrice = payload
}
