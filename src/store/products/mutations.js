export const setProducts = (state, payload) => {
  state.products = payload
}

export const setProduct = (state, payload) => {
  state.product = payload
}

export const setMainCategories = (state, payload) => {
  state.mainCategories = payload
}

export const setSubCategories = (state, payload) => {
  state.subCategories = payload
}

export const setMoreCategories = (state, payload) => {
  state.moreCategories = payload
}

export const setProductBranch = (state, payload) => {
  state.product.branch_id = payload
}

export const setProductMainCategory = (state, payload) => {
  state.product.main_category_id = payload
}

export const setProductSubCategory = (state, payload) => {
  state.product.sub_category_id = payload
}

export const setProductMoreCategory = (state, payload) => {
  state.product.more_category_id = payload
}
