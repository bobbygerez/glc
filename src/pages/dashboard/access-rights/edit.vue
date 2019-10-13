<template>
<div class="q-ma-md">
    <access-rights  :access-right="accessRight" :title="` Edit ${accessRight.name}`" :icon="'edit'" ref="accessRight"></access-rights>
    <div class="col-12">
        <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" />
        <q-btn @click="update" color="primary" label="Update" class="q-ma-sm" />
    </div>
</div>
</template>

<script>
import accessRights from 'pages/dashboard/access-rights/form/generic-access-right'
import {
  mapActions,
  mapState
} from 'vuex'
export default {
  components: {
    accessRights
  },
  methods: {
    ...mapActions('accessRights', ['setAccessRight']),
    cancel () {
      this.$router.go(-1)
    },
    update () {
      this.$refs.accessRight.update()
    }
  },
  computed: {
    ...mapState('accessRights', ['accessRight'])
  },
  watch: {
    accessRight: {
      handler (val) {
        this.setAccessRight(val)
      },
      deep: true
    }
  }
}
</script>
