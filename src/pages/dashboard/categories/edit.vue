<template>
<div class="q-ma-md">
    <generic-category :category="category"  @change="change" icon="add_circle" ref="cat">
        <div class="col-12">
            <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" no-caps/>
            <q-btn @click="update" color="primary" label="Update" class="q-ma-sm" no-caps />
        </div>
    </generic-category>
</div>
</template>

<script>
import genericCategory from 'pages/dashboard/categories/form/generic-category'
import {
  mapState,
  mapActions
} from 'vuex'
export default {

  components: {
    genericCategory
  },
  methods: {
    ...mapActions('categories', ['setCategory']),
    change (val) {
      this.setCategory(val)
    },
    cancel () {
      this.$router.go(-1)
    },
    update () {
      this.$refs.cat.update()
    }
  },
  computed: {
    ...mapState('categories', ['category'])
  }
}
</script>
