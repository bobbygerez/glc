
export const setUsers = (state, payload) => {
  state.users = payload
}

export const setUser = (state, payload) => {
  state.user = payload
}

export const setEditUser = (state, payload) => {
  state.editUser = payload
}

export const setToken = (state, payload) => {
  state.token = payload
}

export const setPage = (state, payload) => {
  state.page = payload
}

export const setPerPage = (state, payload) => {
  state.perPage = payload
}

export const setDelProvId = (state, payload) => {
  state.delivery.address.province_id = payload
}

export const setProvinceId = (state, payload) => {
  state.user.address.province_id = payload
}

export const setDelCityId = (state, payload) => {
  state.delivery.address.city_id = payload
}

export const setCityId = (state, payload) => {
  state.user.address.city_id = payload
}

export const setDelBrgyId = (state, payload) => {
  state.delivery.address.brgy_id = payload
}

export const setBrgyId = (state, payload) => {
  state.user.address.brgy_id = payload
}

export const setDelStreetLotBlk = (state, payload) => {
  state.delivery.address.street_lot_blk = payload
}

export const setStreetLotBlk = (state, payload) => {
  state.user.address.street_lot_blk = payload
}

export const setFullname = (state, payload) => {
  state.user.fullname = payload
}

export const setDelFullname = (state, payload) => {
  state.delivery.fullname = payload
}

export const setMobile = (state, payload) => {
  state.user.mobile = payload
}

export const setDelMobile = (state, payload) => {
  state.delivery.mobile = payload
}

export const setNotes = (state, payload) => {
  state.user.notes = payload
}

export const setDelNotes = (state, payload) => {
  state.delivery.notes = payload
}

export const setDelivery = (state, payload) => {
  state.delivery = payload
}

export const setRoles = (state, payload) => {
  state.roles = payload
}

export const setEditRoleIds = (state, payload) => {
  state.editUser.role_ids = payload
}

export const setEditProvinces = (state, payload) => {
  state.editProvinces = payload
}

export const setEditProvinceId = (state, payload) => {
  state.editUser.address.province_id = payload
}

export const setEditCities = (state, payload) => {
  state.editCities = payload
}

export const setEditCityId = (state, payload) => {
  state.editUser.address.city_id = payload
}

export const setEditBrgys = (state, payload) => {
  state.editBrgys = payload
}

export const setEditBrgyId = (state, payload) => {
  state.editUser.address.brgy_id = payload
}

export const setEditStreetLotBlk = (state, payload) => {
  state.editUser.address.street_lot_blk = payload
}

export const setDialogChangePassword = (state, payload) => {
  state.dialogChangePassword = payload
}
