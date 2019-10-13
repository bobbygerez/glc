<template>
<div>
    <generic-table :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="accessRightTable" :title="'All Access Rights'" :loading="loading" :search-placeholder="'Search Access Rights...'" />
    <q-page-sticky position="bottom" :offset="$q.theme === 'mat' ? [16, 16] : [16, 16]" v-bind="$attrs">
        <transition appear enter-active-class="animated fadeInUpBig" leave-active-class="animated fadeOutDownBig">
            <q-btn-group>
                <q-btn icon="add" color="secondary" @click="add">
                    <q-tooltip :delay="1000" :offset="[0, 10]">New Access Right</q-tooltip>
                </q-btn>
                <q-btn icon="edit" color="secondary" @click="edit">
                    <q-tooltip :delay="1000" :offset="[0, 10]">Edit User</q-tooltip>
                </q-btn>
                <q-btn icon="delete" color="secondary" @click="del">
                    <q-tooltip :delay="1000" :offset="[0, 10]">Delete User</q-tooltip>
                </q-btn>
            </q-btn-group>
        </transition>
    </q-page-sticky>
</div>
</template>

<script>
import genericTable from 'components/data-table/generic'
import {
  debounce
} from 'quasar'
import {
  values,
  head
} from 'lodash'
import {
  mapActions, mapState
} from 'vuex'
export default {
  data () {
    return {
      debouncedFunction: '',
      selectedValue: [],
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
        field: 'description',
        align: 'left'
      }
      ],
      filter: ''
    }
  },
  components: {
    genericTable
  },
  computed: {
    ...mapState('accessRights', ['accessRight'])
  },
  methods: {
    ...mapActions('accessRights', ['setAccessRight']),
    selected (val) {
      this.selectedValue = val
    },
    del () {
      if (this.selectedValue.length > 0) {
        let optimusId = head(this.selectedValue).optimus_id
        this.$axios
          .get(`/access_rights/${optimusId}?id=${optimusId}`)
          .then(res => {
            this.setAccessRight(res.data.accessRight)
            this.$q.notify({
              color: 'negative',
              icon: 'delete',
              message: `Delete ${res.data.accessRight.name}?`,
              actions: [{
                label: 'OK',
                textColor: 'white',
                handler: () => {
                  this.$axios
                    .delete(`/access_rights/${this.accessRight.optimus_id}?id=${this.accessRight.optimus_id}`)
                    .then(res => {
                      this.$q.notify({
                        color: 'positive',
                        icon: 'check',
                        message: `${this.accessRight.name}  deleted successfully`
                      })
                      this.request({
                        pagination: this.serverPagination,
                        filter: this.filter
                      })
                      this.$refs.accessRightTable.selected = []
                    })
                    .catch(err => {
                      console.log(`${err.response.data.message}`)
                      this.$q.notify({
                        color: 'negative',
                        icon: 'warning',
                        message: 'Delete Failed... Integrity Constraint' // `${err.response.data.message}`
                      })
                    })
                }
              }]
            })
          })
      } else {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: 'Please select Access Right to delete.'
        })
      }
    },
    add () {
      this.$router.push({
        path: `/dashboard/access-rights/create`
      })
    },
    edit () {
      if (this.selectedValue.length > 0) {
        let optimusId = head(this.selectedValue).optimus_id
        this.$axios.get(`/access_rights/${optimusId}/edit?id=${optimusId}`)
          .then(res => {
            this.setAccessRight(res.data.accessRight)
            this.$router.push({
              path: `/dashboard/access-rights/${optimusId}`
            })
          })
      } else {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: 'Please select Access Right to edit.'
        })
      }
    },
    request (props) {
      this.debouncedFunction(props)
    }
  },
  mounted () {
    this.debouncedFunction = debounce((props) => {
      this.loading = true
      this.$axios.get(`/access_rights?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.accessRights.data)
          this.serverPagination.rowsNumber = res.data.accessRights.total
          this.lastPage = res.data.accessRights.last_page
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING
          console.log(error)
          // we tell QTable to exit the "loading" state
          this.loading = false
        })
    }, 500)

    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>
