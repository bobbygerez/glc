<template>
<div class="q-ma-md">
    <generic-category :category="category"  @change="change" icon="add_circle" ref="cat">
        <div class="col-12">
            <q-btn @click="cancel" color="secondary" label="Back" class="q-ma-sm" />
            <q-btn @click="add" color="primary" label="Submit" class="q-ma-sm" />
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
    add () {
      this.$refs.cat.add()
    }
  },
  computed: {
    ...mapState('categories', ['category'])
  }
}
</script>
