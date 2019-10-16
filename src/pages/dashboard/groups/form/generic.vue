<template>
  <div class="q-ma-md">
    <form @submit.prevent="$emit('add')">
      <div class="row">
        <div class="col-12">
          <p class="text-h5 q-ma-sm">
            <q-icon
              :name="icon"
              color="grey"
            /> {{ locGroup.name }}
          </p>
        </div>
        <div class="col-12">

          <q-input
            outlined
            dense
            v-model="$v.locGroup.name.$model"
            label="Group Name"
            :error="$v.locGroup.name.$error"
            bottom-slots
            error-message="Group name is required."
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
  props: ['group', 'icon'],
  validations: {
    locGroup: {
      name: {
        required
      }
    }
  },
  data () {
    return {
      locGroup: this.group
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
        this.$axios.put(`/groups/${this.locGroup.optimus_id}?id=${this.locGroup.optimus_id}`, this.locGroup).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'fas fa-check-circle',
            message: `${this.locGroup.name} updated successfully.`
          })
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Duplicate entry on ${this.locGroup.name}`
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
        this.$axios.post(`/groups`, this.locGroup).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'fas fa-check-circle',
            message: `Group successfully created.`
          })
          this.locGroup = {
            name: ''
          }
          this.$v.$reset()
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `Duplicate entry on ${this.locGroup.name}`
          })
        })
      }
    }
  },
  mounted () {
    this.locGroup = this.group
  }

}
</script>
