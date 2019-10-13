<template>
    <generic-product :product="product"  @change="change" icon="add_circle" ref="product">
        <div class="col-12">
            <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" />
            <q-btn @click="add" color="primary" label="Submit" class="q-ma-sm" />
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
    ...mapActions('products', ['setProduct']),
    ...mapActions('branches', ['setBranches']),
    change (val) {
      this.setProduct(val)
    },
    add () {
      this.$refs.product.add()
    },
    cancel () {
      this.$refs.product.cancel()
    }
  }

}
</script>
