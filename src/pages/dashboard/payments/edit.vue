<template>
    <generic-store :branch="branch"  @change="change" icon="add_circle" ref="store">
        <div class="col-12">
            <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" />
            <q-btn @click="update" color="primary" label="Update" class="q-ma-sm" />
        </div>
    </generic-store>
</template>
<script>
import genericStore from 'pages/dashboard/branches/form/generic-store'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    genericStore
  },
  computed: {
    ...mapState('branches', ['branch'])
  },
  methods: {
    ...mapActions('branches', ['setBranch']),
    change (val) {
      this.setBranch(val)
    },
    update () {
      this.$refs.store.update()
    },
    cancel () {
      this.$refs.store.cancel()
    }
  }

}
</script>
