<template>
<div class="row">
    <div class="col-12">
        <p class="text-h5 q-ma-sm">
            <q-icon :name="icon" color="grey" /> {{ title }}</p>
    </div>
    <div class="col-4">
        <q-input outlined v-model="$v.locAccessRight.name.$model" label="Name" class="q-ma-sm" :error="$v.locAccessRight.name.$dirty && !$v.locAccessRight.name.required" bottom-slots error-message="Name is required." />
    </div>
    <div class="col-12">
        <q-input type="textarea" outlined v-model="$v.locAccessRight.description.$model" label="Description" class="q-ma-sm" :error="$v.locAccessRight.description.$dirty && !$v.locAccessRight.description.required" bottom-slots error-message="Description is required." />
    </div>
    <slot></slot>
</div>
</template>

<script>
import {
  required
} from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  props: ['accessRight', 'title', 'icon'],
  validations: {
    locAccessRight: {
      name: {
        required
      },
      description: {
        required
      }
    }
  },
  data () {
    return {
      locAccessRight: this.accessRight
    }
  },
  methods: {
    ...mapActions('accessRights', ['setAccessRight']),
    add () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios.post(`/access_rights`, this.accessRight).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.accessRight.name} created successfully.`
          })
          this.setAccessRight({
            name: '',
            description: ''
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
        this.$axios.put(`/access_rights/${this.accessRight.optimus_id}?id=${this.accessRight.optimus_id}`, this.accessRight).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.accessRight.name} updated successfully.`
          })
        })
      }
    }
  }
}
</script>
