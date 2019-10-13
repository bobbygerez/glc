<template>
    <generic-product :product="product"  @change="change" icon="add_circle" ref="product">
        <div class="col-12">
            <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" />
            <q-btn @click="update" color="primary" label="Update" class="q-ma-sm" />
        </div>
    </generic-product>
</template>
<script>
import genericProduct from 'pages/dashboard/products/form/generic-product'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    genericProduct
  },
  computed: {
    ...mapState('products', ['product'])
  },
  methods: {
    ...mapActions('products', ['setProduct', 'setMainCategories',
      'setSubCategories',
      'setMoreCategories',
      'setProductSubCategory',
      'setProductMoreCategory']),
    ...mapActions('branches', ['setBranches']),
    change (val) {
      this.setProduct(val)
    },
    update () {
      this.$refs.product.update()
    },
    cancel () {
      this.$refs.product.cancel()
    }
  },
  mounted () {
    if (this.product.main_category_id !== null) {
      this.$axios.get(`get-sub-categories?id=${this.product.main_category_id.value}`).then(res => {
        this.setSubCategories(res.data.subCategories)
      })
    }

    if (this.product.sub_category_id !== null) {
      this.$axios.get(`get-more-categories?id=${this.product.sub_category_id.value}`).then(res => {
        this.setMoreCategories(res.data.moreCategories)
      })
    }
  }

}
</script>
