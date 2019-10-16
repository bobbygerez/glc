<template>
  <div class="q-ma-md">
    <generic
      :group="group"
      icon="add_circle"
      ref="group"
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
import generic from 'pages/dashboard/groups/form/generic'
import { mapState } from 'vuex'
export default {
  components: {
    generic
  },
  computed: {
    ...mapState('groups', ['group'])
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    add () {
      this.$refs.group.add()
    }
  }

}
</script>
