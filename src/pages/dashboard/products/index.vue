<template>
<div class="row">
    <div class="col-sm-12 gt-sm">
        <generic-table :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="product" :title="'All Products'" :loading="loading" :search-placeholder="'Search product...'" entity="Product" @add="add" @edit="edit" @restore="restore" @del="del">
        </generic-table>
    </div>
    <div class="col-sm-12 lt-md">
        <grid :data="serverData" :columns="columns" :pagination="serverPagination" @serverside-request="request" @search-change="filter = $event" :search-field="filter" @selected="selected" ref="product" :title="'All Products'" :loading="loading" :search-placeholder="'Search product...'" :grid="true" entity="Product" @add="add" @edit="edit" @restore="restore" @del="del">
        </grid>
    </div>
</div>
</template>

<script>
import genericTable from 'components/data-table/generic'
import grid from 'components/data-table/grid'
import catchError from 'components/api-errors/catch'
import {
  values
} from 'lodash'
import {
  debounce
} from 'quasar'
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
        name: 'Store',
        label: 'Store',
        align: 'left',
        field: row => row.branch.name
      },
      {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left'
      },
      {
        name: 'sku',
        label: 'SKU',
        align: 'left',
        field: row => row.sku
      },
      {
        name: 'barcode',
        label: 'Barcode',
        align: 'left',
        field: row => row.barcode
      },
      {
        name: 'price',
        label: 'Price',
        align: 'left',
        field: row => this.$options.filters.currency(row.price, '₱ ')
      },
      {
        name: 'qty',
        label: 'Qty',
        align: 'left',
        field: row => row.qty
      }
      ]
    }
  },
  computed: {
    ...mapState('branches', ['branch']),
    ...mapState('products', ['product'])
  },
  methods: {
    ...mapActions('products', ['setProduct', 'setProductBranch', 'setProductMainCategory', 'setProductSubCategory', 'setProductMoreCategory', 'setMainCategories']),
    restore () {

    },
    add () {
      this.setProduct({
        branch_id: null,
        main_category_id: null,
        sub_category_id: null,
        more_category_id: null,
        category_id: null,
        chart_account_id: null,
        tax_type_id: null,
        product_id: null,
        name: '',
        sku: '',
        barcode: '',
        discount: 0,
        price: 0,
        qty: 0,
        desc: ''
      })
      this.$router.push({
        path: `/dashboard/products/create`
      })
    },
    edit (optimusId) {
      this.$axios.get(`/dashboard_products/${optimusId}/edit?id=${optimusId}`)
        .then(res => {
          var product = res.data.product
          this.setProduct({
            optimus_id: product.optimus_id,
            branch_id: {
              label: product.branch.name,
              value: product.branch.id
            },
            main_category_id: null,
            sub_category_id: null,
            more_category_id: null,
            category_id: null,
            chart_account_id: null,
            tax_type_id: null,
            product_id: null,
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            discount: product.discount,
            price: product.price,
            qty: product.qty,
            desc: product.desc,
            images: product.images
          })
          this.setProductBranch({
            label: res.data.product.branch.name,
            value: res.data.product.branch.id
          })
          this.setProductMainCategory({
            label: res.data.categories[0].name,
            value: res.data.categories[0].id
          })
          if (res.data.categories.length > 2) {
            this.setProductSubCategory({
              label: res.data.categories[1].name,
              value: res.data.categories[1].id
            })
          }
          if (res.data.categories.length === 3) {
            this.setProductMoreCategory({
              label: res.data.categories[2].name,
              value: res.data.categories[2].id
            })
          }

          this.$router.push({
            path: `/dashboard/products/${optimusId}`
          })
        })
    },
    del (optimusId) {
      this.$axios
        .get(`/dashboard_products/${optimusId}?id=${optimusId}`)
        .then(res => {
          this.setProduct(res.data.product)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Delete ${res.data.product.name}?`,
            actions: [{
              color: 'white',
              label: 'OK',
              handler: () => {
                this.$axios
                  .delete(`/dashboard_products/${this.product.optimus_id}?id=${this.product.optimus_id}`)
                  .then(res => {
                    this.$q.notify({
                      color: 'positive',
                      icon: 'check',
                      message: `${this.product.name} deleted successfully`
                    })
                    this.request({
                      pagination: this.serverPagination,
                      filter: this.filter
                    })
                    this.$refs.product.selected = []
                  })
                  .catch(err => {
                    this.$router.go(-1)
                    this.catch(err)
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
      this.$axios.get(`/dashboard_products?page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.serverPagination = props.pagination
          this.serverData = values(res.data.products.data)
          this.serverPagination.rowsNumber = res.data.products.total
          this.lastPage = res.data.products.last_page
          this.loading = false
        })
        .catch(err => {
          this.catch(err)
        })
    }, 500)

    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
    this.$axios.get('get-main-categories').then(res => {
      this.setMainCategories(res.data.mainCategories)
    })
  }
}
</script>
