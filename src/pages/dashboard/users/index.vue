<template>
  <div class="row">
    <div class="col-md-12 gt-sm">
      <generic-table
        :data="serverData"
        :columns="columns"
        :pagination="serverPagination"
        @serverside-request="request"
        @search-change="filter = $event"
        :search-field="filter"
        @selected="selected"
        ref="userTable"
        :title="'All Users'"
        :loading="loading"
        :search-placeholder="'Search Users...'"
        entity="User"
        @edit="edit"
        @restore="restore"
        @del="del"
      >
      </generic-table>
    </div>
    <div class="col-xs-12 lt-md">
      <grid
        :data="serverData"
        :columns="columns"
        :pagination="serverPagination"
        @serverside-request="request"
        @search-change="filter = $event"
        :search-field="filter"
        @selected="selected"
        ref="userTable"
        :title="'All Users'"
        :loading="loading"
        :search-placeholder="'Search Users...'"
        :grid="true"
        entity="User"
        @edit="edit"
        @restore="restore"
        @del="del"
      >
      </grid>
    </div>
  </div>
</template>

<script>
// $q.platform.is.mobile
import grid from 'components/data-table/grid'
import genericTable from 'components/data-table/generic'
import catchError from 'components/api-errors/catch'
import {
  debounce
} from 'quasar'
import {
  values
} from 'lodash'
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  mixins: [catchError],
  components: {
    genericTable, grid
  },
  data () {
    return {
      selectedValue: [],
      debouncedFunction: '',
      loading: false,
      options: [5, 10, 15, 20],
      serverPagination: {
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [{
        name: 'name',
        label: 'Name',
        field: row => `${row.name}`,
        align: 'left'
      },
      {
        name: 'email',
        label: 'Email',
        align: 'left',
        field: 'email'
      },
      {
        name: 'mobile',
        label: 'Mobile',
        align: 'left',
        field: 'mobile'
      },
      {
        name: 'created_at',
        label: 'Created At',
        align: 'left',
        field: 'created_at'
      }
      ],
      filter: ''
    }
  },
  computed: {
    ...mapState('users', ['users', 'editUser'])
  },

  methods: {
    ...mapActions('users', ['setUsers', 'setEditUser']),
    add () {

    },
    restore () {

    },
    selected (val) {
      this.selectedValue = val
    },
    del (optimusId) {
      this.$q.loadingBar.start()
      this.$axios
        .get(`/users/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.$q.loadingBar.stop()
          this.setEditUser(res.data.user)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Delete ${this.editUser.firstname} ${this.editUser.lastname}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$q.loadingBar.start()
                this.$axios
                  .delete(`/users/${this.editUser.optimus_id}?id=${this.editUser.optimus_id}`)
                  .then(res => {
                    this.$q.loadingBar.stop()
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.editUser.firstname} ${this.editUser.lastname} deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
                    this.$refs.userTable.selected = []
                  })
                  .catch(err => {
                    this.catch(err)
                  })
              }
            }]
          })
        })
    },
    edit (optimusId) {
      this.$q.loadingBar.start()
      this.$axios.get(`/users/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.$q.loadingBar.stop()
          let user = res.data.user
          let roles = []
          for (var i = 0; i < user.roles.length; i++) {
            roles.push({
              label: user.roles[i].name,
              value: user.roles[i].id
            })
          }

          let groups = []
          for (var aa = 0; aa < user.groups.length; aa++) {
            groups.push({
              label: user.groups[aa].name,
              value: user.groups[aa].value
            })
          }
          let address = {
            province_id: null,
            city_id: null,
            brgy_id: null,
            street_lot_blk: ''
          }
          console.log(user.address !== null)
          if (user.address !== null) {
            var a = user.address
            address = {
              province_id: {
                label: a.province.description,
                value: a.province.id
              },
              city_id: {
                label: a.city.description,
                value: a.city.id
              },
              brgy_id: {
                label: a.brgy.description,
                value: a.brgy.id
              },
              street_lot_blk: a.street_lot_blk
            }
          }
          console.log(roles)
          this.setEditUser({
            fullname: user.fullname,
            username: user.name,
            email: user.email,
            mobile: user.mobile,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            notes: user.notes,
            address: address,
            roles: roles,
            group_id: groups
          })
          this.$router.push({
            path: `/dashboard/user/${optimusId}`
          })
        })

      // .catch(err => {
      //   this.catch(err)
      // })
    },
    request (props) {
      this.debouncedFunction(props)
    }
  },
  mounted () {
    this.debouncedFunction = debounce((props) => {
      this.$q.loadingBar.start()
      this.$axios.get(`/users?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.$q.loadingBar.stop()
          this.serverData = values(res.data.users.data)
          this.serverPagination.rowsNumber = res.data.users.total
          this.serverPagination = props.pagination
          this.lastPage = res.data.users.last_page
        })
        .catch(err => {
          this.$router.go(-1)
          this.catch(err)
        })
    }, 500)

    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>
