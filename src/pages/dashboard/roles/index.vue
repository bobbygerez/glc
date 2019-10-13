<template>
  <div class="row">
    <div class="col-sm-12 gt-sm">
      <generic-table
        :data="serverData"
        :columns="columns"
        :pagination="serverPagination"
        @serverside-request="request"
        @search-change="filter = $event"
        :search-field="filter"
        @selected="selected"
        ref="roleTable"
        :title="'All Roles'"
        :loading="loading"
        :search-placeholder="'Search role...'"
        entity="Role"
        @add="add"
        @edit="edit"
        @restore="restore"
        @del="del"
      >
      </generic-table>
    </div>
    <div class="col-sm-12 lt-md">
      <grid
        :data="serverData"
        :columns="columns"
        :pagination="serverPagination"
        @serverside-request="request"
        @search-change="filter = $event"
        :search-field="filter"
        @selected="selected"
        ref="roleTable"
        :title="'All Roles'"
        :loading="loading"
        :search-placeholder="'Search role...'"
        :grid="true"
        entity="Role"
        @add="add"
        @edit="edit"
        @restore="restore"
        @del="del"
      >
      </grid>
    </div>
  </div>
</template>

<script>
function truncate (text, max) {
  return text.substr(0, max - 1) + (text.length > max ? '...' : '')
}
import genericTable from 'components/data-table/generic'
import grid from 'components/data-table/grid'
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
    genericTable,
    grid
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
        field: 'name',
        align: 'left'
      },
      {
        name: 'description',
        label: 'Description',
        field: 'description'
      },
      {
        name: 'subordinate',
        label: 'Subordinates',
        style: 'word-wrap: break-word;',
        field: (row) => this.allchildren(row)

      }
      ],
      filter: ''
    }
  },
  computed: {
    ...mapState('roles', ['role'])
  },
  methods: {
    ...mapActions('roles', ['setRole', 'setRoles']),
    allchildren (row) {
      var res = []
      const cb = (e) => {
        res.push(e.name)
        e.all_children && e.all_children.forEach(cb)
      }
      row.all_children.forEach(cb)
      return truncate(res.toString(), 30)
    },
    selected (val) {
      this.selectedValue = val
    },
    restore () {

    },
    del (optimusId) {
      this.$axios
        .get(`/dashboard_role/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setRole(res.data.role)
          this.$q.notify({
            color: 'negative',
            icon: 'delete',
            message: `Delete ${this.role.name}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$axios
                  .delete(`/dashboard_role/${this.role.optimus_id}?id=${this.role.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.role.name}  deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
                    this.$refs.roleTable.selected = []
                  })
                  .catch(err => {
                    this.catch(err)
                  })
              }
            }]
          })
        })
    },
    add () {
      this.$axios.get('/dashboard_role/create')
        .then(res => {
          this.setRole({
            name: '',
            description: '',
            parent_id: null,
            menu_id: null,
            desc: ''
          })
          this.$router.push({
            path: `/dashboard/role/create`
          })
        })
    },
    edit (optimusId) {
      this.$axios.get(`/dashboard_role/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          let role = res.data.role
          let parent = null
          if (role.parent != null) {
            parent = {
              value: role.parent.optimus_id,
              label: role.parent.name
            }
          }
          let menus = []
          for (let i = 0; i < role.menus.length; i++) {
            menus.push({
              label: role.menus[i].label,
              value: role.menus[i].value
            })
          }
          this.setRole({
            optimus_id: role.optimus_id,
            name: role.name,
            description: role.description,
            parent_id: parent,
            menu_id: menus
          })
          this.setRoles(res.data.roles)
          this.$router.push({
            path: `/dashboard/roles/${optimusId}`
          })
        }).catch(err => {
          this.catch(err)
        })
    },
    request (props) {
      this.debouncedFunction(props)
    }
  },
  mounted () {
    this.debouncedFunction = debounce((props) => {
      this.loading = true
      this.$axios.get(`/dashboard_role?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.roles.data)
          this.serverPagination.rowsNumber = res.data.roles.total
          this.lastPage = res.data.roles.last_page
          this.loading = false
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
