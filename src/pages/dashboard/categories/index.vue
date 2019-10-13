<template>
<div class="row">
    <div class="col-sm-12 gt-sm">
      <generic-table :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="cat" :title="'All Categories'" :loading="loading" :search-placeholder="'Search category...'" entity="Category" @add="add" @edit="edit" @restore="restore" @del="del">
      </generic-table>
    </div>
    <div class="col-sm-12 lt-md">
      <grid :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="cat" :title="'All Categories'" :loading="loading" :search-placeholder="'Search category...'" :grid="true" entity="Category" @add="add" @edit="edit" @restore="restore" @del="del">
      </grid>
    </div>
  </div>
</template>

<script>
import catchError from 'components/api-errors/catch'
import {
  values
} from 'lodash'
import genericTable from 'components/data-table/generic'
import grid from 'components/data-table/grid'
import {
  mapActions, mapState
} from 'vuex'

function truncate (text, max) {
  return text.substr(0, max - 1) + (text.length > max ? '...' : '')
}
export default {
  mixins: [catchError],
  data () {
    return {
      serverData: [],
      selectedValue: [],
      columns: [{
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left'
      }, {
        name: 'subcategories',
        label: 'Subcategories',
        align: 'left',
        style: 'word-wrap: break-word;',
        field: (row) => this.allchildren(row)
      }],
      loading: false,
      options: [5, 10, 15, 20],
      serverPagination: {
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10 // specifying this determines pagination is server-side
      },
      filter: ''
    }
  },
  components: {
    genericTable, grid
  },
  computed: {
    ...mapState('categories', ['category'])
  },
  methods: {
    ...mapActions('categories', ['setCategory']),
    restore () {

    },
    allchildren (row) {
      var res = []
      const cb = (e) => {
        res.push(e.name)
        e.all_children && e.all_children.forEach(cb)
      }
      row.all_children.forEach(cb)
      return truncate(res.toString(), 40)
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    selected (val) {
      this.selectedValue = val
    },
    request (props) {
      this.loading = true
      this.$axios.get(`/dashboard_categories?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.categories.data)
          this.serverPagination.rowsNumber = res.data.categories.total
          this.lastPage = res.data.categories.last_page
          this.loading = false
        })
        .catch(err => {
          this.$router.go(-1)
          this.catch(err)
        })
    },
    edit (optimusId) {
      this.$axios.get(`/dashboard_categories/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          this.setCategory(res.data.category)
          this.$router.push(`/dashboard/categories/${optimusId}`)
        })
    },
    add () {
      this.setCategory({
        parent_id: null,
        name: '',
        icon: ''
      })
      this.$router.push(`/dashboard/categories/create`)
    },
    del (optimusId) {
      this.$axios
        .get(`/dashboard_categories/${optimusId}?id=${optimusId}`)
        .then(res => {
          this.setCategory(res.data.category)
          this.$q.notify({
            color: 'negative',
            icon: 'delete',
            message: `Delete ${this.category.name}?`,
            actions: [{
              label: 'OK',
              color: 'white',
              handler: () => {
                this.$axios
                  .delete(`/dashboard_categories/${this.category.optimus_id}?id=${this.category.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.category.name}  deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
                    this.$refs.cat.selected = []
                  })
                  .catch(err => {
                    this.catch(err)
                  })
              }
            }]
          })
        })
    }
  },
  mounted () {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>
