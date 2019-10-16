<template>
  <div class="q-ma-md">
    <generic
      :catalog="catalog"
      icon="add_circle"
      ref="catalog"
    >
      <div class="col-12">
        <q-btn
          @click="cancel"
          color="secondary"
          label="Back"
          class="q-ma-sm"
        />
        <q-btn
          @click="add"
          color="primary"
          label="Submit"
          class="q-ma-sm"
        />
      </div>
    </generic>
  </div>
</template>

<script>
import generic from 'pages/dashboard/catalogs/form/generic'
import { mapState } from 'vuex'
export default {
  components: {
    generic
  },
  computed: {
    ...mapState('catalogs', ['catalog'])
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    add () {
      this.$refs.catalog.add()
    }
  }

}
</script>
