<template>
    <div class="q-ma-sm">
    <form @submit.prevent="$emit('add')">
        <div class="row">
            <div class="col-12">
                <p class="text-h5 q-ma-sm">
                    <q-icon name="add_circle" color="grey" /> {{ locBranch.name }}
                </p>
            </div>
            <div class="col-12">
                <q-input dense outlined v-model="$v.locBranch.name.$model" label="Store Name"  :error="$v.locBranch.name.$error" bottom-slots error-message="Store name is required." />
            </div>
            <div class="col-12">
                <q-input dense outlined v-model="locBranch.desc" label="Description" type="textarea" />
            </div>
        </div>
    </form>
     <slot></slot>
    </div>
</template>
<script>
import {
  required
} from 'vuelidate/lib/validators'
export default {
  props: ['branch'],
  validations: {
    locBranch: {
      name: {
        required
      }
    }
  },
  data () {
    return {
      locBranch: this.branch
    }
  },
  methods: {
    add () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios.post('branches', this.locBranch)
          .then(res => {
            this.locBranch = {
              name: '',
              desc: ''
            }
            this.$v.$reset()
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `${this.branch.name} created successfully.`
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
        this.$axios.put(`branches/${this.locBranch.optimus_id}`, this.locBranch)
          .then(res => {
            this.$v.$reset()
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `${this.branch.name} created successfully.`
            })
          })
      }
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  watch: {
    locBranch: {
      handler (oldVal) {
        this.$emit('change', oldVal)
      },
      deep: true
    }
  }

}
</script>
