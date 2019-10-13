<template>
 <span>
  <all-products></all-products>
  <pag-products></pag-products>
 </span>
</template>
<script>
import allProducts from 'components/products/all'
import pagProducts from 'components/pagination/pag-products'
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  name: 'categoryProducts',
  meta () {
    return {
      title: this.category ? this.category.name : ''
    }
  },
  components: {
    allProducts,
    pagProducts
  },
  computed: {
    ...mapState('categories', ['category']),
    ...mapState('products', ['products']),
    ...mapState('users', ['page', 'perPage']),
    ...mapState('global', ['searchStringProduct'])
  },
  methods: {
    ...mapActions('categories', ['setCategory']),
    ...mapActions('products', ['setProducts', 'searchProduct']),
    ...mapActions('users', ['setPage']),
    ...mapActions('global', ['setBreadCrumbs']),
    getProducts () {
      this.searchProduct({
        string: '',
        page: this.page,
        perPage: this.perPage,
        id: this.$route.params.furtherCatId,
        vm: this.$q.loadingBar
      })
      let breadCrumbs = this.$router.currentRoute.path.split('/')
      breadCrumbs.splice(0, 2)
      this.setBreadCrumbs(breadCrumbs)
    }
  },
  mounted () {
    this.getProducts()
  },
  watch: {
    '$route' (to, from) {
      this.getProducts()
    },
    'page' (val) {
      this.getProducts()
    },
    'perPage' (val) {
      this.getProducts()
    },
    searchStringProduct (val) {
      this.searchProduct({
        vm: this.$q.loadingBar,
        string: val,
        page: this.page,
        perPage: 30,
        id: this.$route.params.furtherCatId
      })
    }
  }
}
</script>
