export const setRoles = (state, payload) => {
  state.roles = payload
}

export const setRole = (state, payload) => {
  state.role = payload
}

export const setRoleParentId = (state, payload) => {
  state.role.parent_id = payload
}

export const setMenus = (state, payload) => {
  state.menus = payload
}
