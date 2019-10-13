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
          @click="add"
          color="primary"
          label="Submit"
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
  computed: {
    ...mapState('roles', ['role'])
  },
  methods: {
    ...mapActions('roles', ['setRole']),
    change (val) {
      this.setRole(val)
    },
    cancel () {
      this.$router.go(-1)
    },
    add () {
      this.$refs.role.add()
    }
  },
  mounted () {
    this.$refs.role.getRoles()
  }

}
</script>
