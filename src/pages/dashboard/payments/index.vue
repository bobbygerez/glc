<template>
<div class="row">
    <div class="col-sm-12 gt-sm">
      <generic-table :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="storeTable" :title="'All Payments'" :loading="loading" :search-placeholder="'Search Payment...'" entity="Payment" @info="info" @print="print" @restore="restore" @del="del" :payments="true" :viewPayment="true">
      </generic-table>
    </div>
    <div class="col-sm-12 lt-md">
      <grid :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="storeTable" :title="'All Payments'" :loading="loading" :search-placeholder="'Search Payment...'" :grid="true" entity="Store" @restore="restore" @del="del">
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
      columns: [
        {
          name: 'user',
          label: 'Name',
          field: row => row.user.name,
          align: 'left'
        },
        {
          name: 'payment_option',
          label: 'Payment Option',
          field: row => row.payment_option.name,
          align: 'left'
        },
        {
          name: 'payment_id',
          label: 'Payment ID',
          field: 'payment_id',
          align: 'left'
        },
        {
          name: 'delivery_amount',
          label: 'Delivery Amount',
          field: 'delivery_amount',
          align: 'left'
        },
        {
          name: 'grand_total',
          label: 'Grand Total',
          field: 'grand_total',
          align: 'left'
        },
        {
          name: 'created_at',
          label: 'Created At',
          field: 'created_at',
          align: 'left'
        }
      ]
    }
  },
  computed: {
    ...mapState('branches', ['branch'])
  },
  methods: {
    ...mapActions('payments', ['setPayment', 'setPaypalInfo']),
    ...mapActions('branches', ['setBranch']),
    restore () {

    },
    info (optimus) {
      this.$axios.get(`payments/${optimus}?id=${optimus}`)
        .then(res => {
          this.setPayment(res.data.payment)
          this.setPaypalInfo(res.data.paypalInfo)
          this.$router.push({
            path: `/dashboard/payments/${optimus}`
          })
        })
    },
    print (optimusId) {
      this.$axios.get(`payments/${optimusId}?id=${optimusId}`)
        .then(res => {
          this.setPayment(res.data.payment)
          this.setPaypalInfo(res.data.paypalInfo)
          this.$router.push({
            path: `/dashboard/payments/${optimusId}/print`
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
      this.$axios.get(`/payments?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.payments.data)
          this.serverPagination.rowsNumber = res.data.payments.total
          this.lastPage = res.data.payments.last_page
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
