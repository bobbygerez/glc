<template>
  <div class="q-ma-md">
    <form @submit.prevent="$emit('add')">
      <div class="row">
        <div class="col-12">
          <p class="text-h5 q-ma-sm">
            <q-icon
              :name="icon"
              color="grey"
            /> {{ locCatalog.name }}
          </p>
        </div>
        <div class="col-12">

          <q-input
            outlined
            dense
            v-model="$v.locCatalog.name.$model"
            label="Catalog Name"
            :error="$v.locCatalog.name.$error"
            bottom-slots
            error-message="Catalog name is required."
          />
        </div>
        <slot></slot>
      </div>
    </form>
  </div>
</template>

<script>
import {
  required
} from 'vuelidate/lib/validators'

export default {
  props: ['catalog', 'icon'],
  validations: {
    locCatalog: {
      name: {
        required
      }
    }
  },
  data () {
    return {
      locCatalog: this.catalog
    }
  },

  methods: {
    update () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios.put(`/catalogs/${this.locCatalog.optimus_id}?id=${this.locCatalog.optimus_id}`, this.locCatalog).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'fas fa-check-circle',
            message: `${this.locCatalog.name} updated successfully.`
          })
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Duplicate entry on ${this.locCatalog.name}`
          })
        })
      }
    },
    add () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios.post(`/catalogs`, this.locCatalog).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'fas fa-check-circle',
            message: `Catalog successfully created.`
          })
          this.locCatalog = {
            name: ''
          }
          this.$v.$reset()
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Duplicate entry on ${this.loccatalog.name}`
          })
        })
      }
    }
  },
  mounted () {
    this.loccatalog = this.catalog
  }

}
</script>
