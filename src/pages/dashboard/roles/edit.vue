<template>
  <div class="q-ma-md">
    <generic-role
      :role="role"
      @change="change"
      icon="add_circle"
      ref="role"
    >
      <div class="col-12">
        <q-btn
          @click="cancel"
          color="secondary"
          label="Back"
          class="q-ma-sm"
        />
        <q-btn
          @click="update"
          color="primary"
          label="Update"
          class="q-ma-sm"
        />
      </div>
    </generic-role>
  </div>
</template>

<script>
import genericRole from 'pages/dashboard/roles/form/generic-role'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    genericRole
  },
  methods: {
    ...mapActions('roles', ['setRoles', 'setRoleParentId']),
    change (val) {
      this.setRole(val)
    },
    cancel () {
      this.$router.go(-1)
    },
    update () {
      this.$refs.role.update()
    }
  },
  computed: {
    ...mapState('roles', ['role'])
  }
}
</script>
