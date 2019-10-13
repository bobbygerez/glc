<template>
  <div class="q-ma-md">
    <form @submit.prevent="$emit('add')">
      <div class="row">
        <div class="col-12">
          <p class="text-h5 q-ma-sm">
            <q-icon
              :name="icon"
              color="grey"
            /> {{ category.name }}
          </p>
        </div>
        <div class="col-12">
          <q-input
            dense
            outlined
            v-model="$v.locCategory.name.$model"
            label="Category Name"
            class="q-ma-sm"
            :error="$v.locCategory.name.$error"
            bottom-slots
            error-message="Category name is required."
          />
        </div>
        <div class="col-12">
          <q-input
            dense
            outlined
            v-model="locCategory.desc"
            label="Description"
            class="q-ma-sm"
            type="textarea"
          />
        </div>
        <slot></slot>
      </div>
    </form>
  </div>
</template>

<script>
// const valCategory = (value) => value !== undefined
import {
  required
} from 'vuelidate/lib/validators'
import {
  mapState,
  mapActions
} from 'vuex'
import { find } from 'lodash'
export default {
  props: ['category', 'icon'],
  data () {
    return {
      localCategories: [{
        value: '',
        label: ''
      }],
      locCategory: this.category
    }
  },
  validations: {
    locCategory: {
      name: {
        required
      }
    }
  },
  computed: {
    ...mapState('categories', ['dashboardCategories']),
    parentId: {
      get () {
        return find(this.dashboardCategories, { value: this.category.parent_id })
      },
      set (val) {
        let p = ''
        if (val !== null) {
          p = val.value
        } else {
          p = val
        }
        this.$emit('change', {
          desc: this.category.desc,
          name: this.category.name,
          parent_id: p,
          url: this.category.url
        })
      }
    }
  },
  methods: {
    ...mapActions('categories', ['setDashboardCategories', 'setCategoryParentId']),
    heirarchyCat (categories) {
      const result = []
      for (var i = 0; i <= categories.length - 1; i++) {
        result.push({
          value: categories[i].id,
          label: 'I.' + categories[i].name,
          parent_id: categories[i].parent_id
        })
        for (var ii = 0; ii <= categories[i].all_children.length - 1; ii++) {
          result.push({
            value: categories[i].all_children[ii].id,
            label: ' &emsp; II. ' + categories[i].all_children[ii].name,
            parent_id: categories[i].all_children[ii].parent_id
          })
          for (var iii = 0; iii <= categories[i].all_children[ii].all_children.length - 1; iii++) {
            result.push({
              value: categories[i].all_children[ii].all_children[iii].id,
              label: ' &emsp; &emsp; III. ' + categories[i].all_children[ii].all_children[iii].name,
              parent_id: categories[i].all_children[ii].all_children[iii].parent_id
            })
          }
        }
      }
      return result
    },
    create () {
      this.$axios.get('/categories-all')
        .then(res => {
          this.setDashboardCategories(this.heirarchyCat(res.data.categories))
          this.localCategories = this.heirarchyCat(res.data.categories)
          this.setCategoryParentId(
            find(this.heirarchyCat(res.data.categories), { value: this.category.parent_id })
          )
        })
    },

    filterFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase()
          this.localCategories = this.dashboardCategories.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }, 500)
    },
    add () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        let parentId = 0
        if (this.locCategory.parent_id != null) {
          parentId = this.locCategory.parent_id.value
        }
        this.$axios.post(`/dashboard_categories`, {
          desc: this.locCategory.desc,
          name: this.locCategory.name,
          icon: '',
          parent_id: parentId,
          url: this.locCategory.name
        }).then(res => {
          this.locCategory = {
            parent_id: null,
            name: '',
            icon: '',
            url: ''
          }
          this.$v.$reset()
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.locCategory.name} created successfully.`
          })
          this.create()
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `${err.response.data.message}`
          })
        })
      }
    },
    update () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        let parentId = null
        if (this.locCategory.parent_id != null) {
          parentId = this.locCategory.parent_id.value
        }
        this.$axios.put(`/dashboard_categories/${this.locCategory.optimus_id}?id=${this.locCategory.optimus_id}`, {
          desc: this.locCategory.desc,
          name: this.locCategory.name,
          icon: '',
          parent_id: parentId,
          url: this.locCategory.name
        }).then(res => {
          this.$v.$reset()
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.locCategory.name} update successfully.`
          })
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `${err.response.data.message}`
          })
        })
      }
    }
  },
  mounted () {
    this.create()
  },
  watch: {
    locCategory: {
      handler (val) {
        this.$emit('change', val)
      },
      deep: true
    }
  }
}
</script>
