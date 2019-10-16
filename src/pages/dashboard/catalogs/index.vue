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
        ref="catalog"
        :title="'All Catalogs'"
        :loading="loading"
        :search-placeholder="'Search catalog...'"
        entity="Catalog"
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
        ref="catalog"
        :title="'All Catalogs'"
        :loading="loading"
        :search-placeholder="'Search catalog...'"
        entity="Catalog"
        @add="add"
        @edit="edit"
        @del="del"
        :grid="true"
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
    ...mapState('catalogs', ['catalog'])
  },
  methods: {
    ...mapActions('catalogs', ['setCatalog']),
    del (optimusId) {
      this.$axios
        .get(`/catalogs/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setCatalog(res.data.catalog)
          this.$q.notify({
            color: 'negative',
            icon: 'delete',
            message: `Delete ${this.catalog.name}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$axios
                  .delete(`/catalogs/${this.catalog.optimus_id}?id=${this.catalog.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.catalog.name}  deleted successfully`
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
      this.$axios.get('/catalogs/create')
        .then(res => {
          this.setCatalog({
            name: ''
          })
          this.$router.push({
            path: `/dashboard/catalogs/create`
          })
        })
    },
    edit (optimusId) {
      this.$axios.get(`/catalogs/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setCatalog(res.data.catalog)
          this.$router.push({
            path: `/dashboard/catalogs/${optimusId}`
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
      this.$axios.get(`/catalogs?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.catalogs.data)
          this.serverPagination.rowsNumber = res.data.catalogs.total
          this.lastPage = res.data.catalogs.last_page
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
