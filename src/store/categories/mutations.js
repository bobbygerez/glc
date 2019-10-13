export const setCategories = (state, payload) => {
  state.categories = payload
}

export const setCategory = (state, payload) => {
  state.category = payload
}

export const setCategoryParentId = (state, payload) => {
  state.category.parent_id = payload
}

export const setSearchCategory = (state, payload) => {
  state.searchCategory = payload
}

export const setDashboardCategories = (state, payload) => {
  state.dashboardCategories = payload
}
