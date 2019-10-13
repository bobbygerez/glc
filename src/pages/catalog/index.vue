<template>
<span>
  <all-products></all-products>
   <q-page-sticky position="bottom" :offset="$q.theme === 'mat' ? [16, 16] : [16, 16]" v-bind="$attrs">
        <transition appear enter-active-class="animated fadeInUpBig" leave-active-class="animated fadeOutDownBig" size="lg">
            <q-pagination class="bg-red-1" size="md" v-model="page" color="negative" :min="1" :max="products.last_page" :max-pages="6" boundary-links />
        </transition>
    </q-page-sticky>
     <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
</span>
</template>

<script>
import allProducts from 'components/products/all'
import {
  mapState, mapActions
} from 'vuex'
export default {
  name: 'PageIndex',
  components: {
    allProducts
  },
  computed: {
    ...mapState('products', ['products']),
    page: {
      get () {
        return this.$store.getters['users/page']
      },
      set (val) {
        this.setPage(val)
      }
    }
  },
  methods: {
    ...mapActions('products', ['setProducts']),
    ...mapActions('users', ['setPage', 'setPerPage']),
    ...mapActions('global', ['setBreadCrumbs']),
    getProducts () {
      this.$refs.bar.start()
      this.$axios.get(`/products?page=${this.page}&perPage=30`)
        .then(res => {
          this.setProducts(res.data.products)
          this.$refs.bar.stop()
        })
    }
  },
  mounted () {
    this.getProducts()
    this.setBreadCrumbs([])
  },
  watch: {
    'page' (val) {
      this.getProducts()
    }
  }
}
</script>
