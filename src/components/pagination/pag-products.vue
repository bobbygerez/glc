<template>
<q-page-sticky position="bottom" :offset="$q.theme === 'mat' ? [16, 16] : [16, 16]" v-bind="$attrs">
    <transition appear enter-active-class="animated fadeInUpBig" leave-active-class="animated fadeOutDownBig" size="lg">
        <q-pagination class="bg-red-1" size="md" v-model="page" color="primary" :min="1" :max="products.last_page" :max-pages="5" boundary-links />
    </transition>
</q-page-sticky>
</template>

<script>
import {
  mapState, mapActions
} from 'vuex'
export default {
  computed: {
    ...mapState('products', ['products']),
    page: {
      get () {
        return this.$store.getters['users/page']
      },
      set (val) {
        this.setPage(val)
      }
    },
    perPage: {
      get () {
        return this.$store.getters['users/perPage']
      },
      set (val) {
        this.setPerPage(val)
      }
    }
  },
  methods: {
    ...mapActions('users', ['setPage'])
  }
}
</script>
