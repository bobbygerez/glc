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
        ref="product"
        :title="'All Products'"
        :loading="loading"
        :search-placeholder="'Search product...'"
        entity="Product"
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
        ref="product"
        :title="'All Products'"
        :loading="loading"
        :search-placeholder="'Search product...'"
        :grid="true"
        entity="Product"
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
      columns: [
        {
          name: 'name',
          label: 'Name',
          field: 'name',
          align: 'left'
        },
        {
          name: 'category',
          label: 'Category',
          field: row => row.category.name,
          align: 'left'
        },
        {
          name: 'catalog',
          label: 'Catalog',
          field: row => row.catalog.name,
          align: 'left'
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
        catalog_id: null,
        group_id: [],
        category_id: null,
        product_id: null,
        name: '',
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

          var groups = []

          for (let i = 0; i < product.groups.length; i++) {
            groups.push({
              label: product.groups[i].name,
              id: product.groups[i].id
            })
          }

          this.setProduct({
            optimus_id: product.optimus_id,
            item_code: product.item_code,
            category_id: {
              label: product.category.name,
              value: product.category.optimus_id
            },
            catalog_id: {
              label: product.catalog.name,
              value: product.catalog.optimus_id
            },
            group_id: groups,
            product_id: null,
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            discount: product.discount,
            desc: product.desc,
            images: product.images
          })

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
          this.$router.go(-1)
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
