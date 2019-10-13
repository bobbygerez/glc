<template>
<div class="row">
    <div class="col-sm-12 gt-sm">
      <generic-table :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="storeTable" :title="'All Stores'" :loading="loading" :search-placeholder="'Search store...'" entity="Store" @add="add" @edit="edit" @restore="restore" @del="del">
      </generic-table>
    </div>
    <div class="col-sm-12 lt-md">
      <grid :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="storeTable" :title="'All Categories'" :loading="loading" :search-placeholder="'Search store...'" :grid="true" entity="Store" @add="add" @edit="edit" @restore="restore" @del="del">
      </grid>
    </div>
  </div>
</template>

<script>
import catchError from 'components/api-errors/catch'
import genericTable from 'components/data-table/generic'
import grid from 'components/data-table/grid'
import { values } from 'lodash'
import {
  debounce
} from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [catchError],
  components: {
    genericTable, grid
  },
  data () {
    return {
      selectedValue: '',
      debouncedFunction: '',
      loading: false,
      filter: '',
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
        align: 'left',
        field: 'desc'
      },
      {
        name: 'created_by',
        label: 'Created By',
        align: 'left',
        field: row => `${row.user.firstname} ${row.user.lastname}`
      }
      ]
    }
  },
  computed: {
    ...mapState('branches', ['branch'])
  },
  methods: {
    ...mapActions('branches', ['setBranch']),
    restore () {

    },
    add () {
      this.setBranch({
        name: '',
        desc: ''
      })
      this.$router.push({
        path: `/dashboard/stores/create`
      })
    },
    edit (optimusId) {
      this.$axios.get(`/branches/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setBranch(res.data.branch)
          this.$router.push({
            path: `/dashboard/stores/${optimusId}`
          })
        })
    },
    del (optimusId) {
      this.$axios
        .get(`/branches/${optimusId}?id=${optimusId}`)
        .then(res => {
          this.setBranch(res.data.branch)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Delete ${this.branch.name}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$axios
                  .delete(`/branches/${this.branch.optimus_id}?id=${this.branch.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.branch.name} deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
                    this.$refs.storeTable.selected = []
                  })
                  .catch(err => {
                    console.log(`${err.response.data.message}`)
                    this.$q.notify({
                      color: 'negative',
                      icon: 'warning',
                      message: 'Failed... Integrity Constraint' // `${err.response.data.message}`
                    })
                  })
              }
            }]
          })
        })
    },
    selected (val) {
      this.selectedValue = val
    },
    request (props) {
      this.debouncedFunction(props)
    }
  },
  mounted () {
    this.debouncedFunction = debounce((props) => {
      this.loading = true
      this.$axios.get(`/branches?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.branches.data)
          this.serverPagination.rowsNumber = res.data.branches.total
          this.lastPage = res.data.branches.last_page
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
