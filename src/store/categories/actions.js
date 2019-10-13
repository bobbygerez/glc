export const setCategories = ({
  commit
}, payload) => {
  commit('setCategories', payload)
}

export const setCategory = ({
  commit
}, payload) => {
  commit('setCategory', payload)
}

export const setCategoryParentId = ({ commit }, payload) => {
  commit('setCategoryParentId', payload)
}

export const setSearchCategory = ({ commit }, payload) => {
  commit('setSearchCategory', payload)
}

export const setDashboardCategories = ({ commit }, payload) => {
  commit('setDashboardCategories', payload)
}
