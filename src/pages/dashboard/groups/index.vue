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
        ref="group"
        :title="'All Groups'"
        :loading="loading"
        :search-placeholder="'Search group...'"
        entity="Group"
        @add="add"
        @edit="edit"
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
        ref="group"
        :title="'All Roles'"
        :loading="loading"
        :search-placeholder="'Search role...'"
        :grid="true"
        entity="Group"
        @add="add"
        @edit="edit"
        @del="del"
      >
      </grid>
    </div>
  </div>
</template>

<script>
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
        name: 'created_at',
        label: 'Created At',
        field: 'created_at'
      }
      ],
      filter: ''
    }
  },
  computed: {
    ...mapState('groups', ['group'])
  },
  methods: {
    ...mapActions('groups', ['setGroup']),
    del (optimusId) {
      this.$axios
        .get(`/groups/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setGroup(res.data.group)
          this.$q.notify({
            color: 'negative',
            icon: 'delete',
            message: `Delete ${this.group.name}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$axios
                  .delete(`/groups/${this.group.optimus_id}?id=${this.group.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.group.name}  deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
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
      this.$axios.get('/groups/create')
        .then(res => {
          this.setRole({
            name: '',
            description: '',
            parent_id: null,
            menu_id: null,
            desc: ''
          })
          this.$router.push({
            path: `/dashboard/groups/create`
          })
        })
    },
    edit (optimusId) {
      this.$axios.get(`/groups/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setGroup(res.data.group)
          this.$router.push({
            path: `/dashboard/groups/${optimusId}`
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
      this.$axios.get(`/groups?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.groups.data)
          this.serverPagination.rowsNumber = res.data.groups.total
          this.lastPage = res.data.groups.last_page
          this.loading = false
        })
      // .catch(err => {
      //   this.$router.go(-1)
      //   this.catch(err)
      // })
    }, 500)

    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>
