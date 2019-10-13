<template>
<div class="q-ma-md">
    <div class="row">
        <div class="col-12">
            <p class="text-h5 q-ma-sm">
                <q-icon name="lock" color="grey" />
               {{ editUser.name }}
            </p>
        </div>
        <div class="col-12">
            <q-input dense v-model="$v.password.$model" outlined :type="isPwd ? 'password' : 'text'" label="New Password"  :error="$v.password.$error" bottom-slots error-message="Must be at least 8 characters.">
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
            </q-input>
        </div>
        <div class="col-12">
            <q-input dense type="password" outlined v-model="$v.confirmPassword.$model" label="Confirm Password"  :error="$v.confirmPassword.$error" bottom-slots error-message="Mismatched Password" />
        </div>
        <div class="col-12">
            <q-btn label="Back" color="primary" v-close-popup @click="cancel" class="q-ma-sm" />
            <q-btn label="Update" color="secondary" v-close-popup @click="updatePassword" :loading="loading" class="q-ma-sm" />
        </div>
    </div>

</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import {
  required,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      password: '',
      confirmPassword: '',
      isPwd: true,
      loading: false
    }
  },

  methods: {
    cancel () {
      this.$router.go(-1)
    },
    updatePassword () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.loading = true
        this.$axios.post(`/users/change-password?id=${this.editUser.optimus_id}`, {
          password: this.password,
          confirm_password: this.confirmPassword
        }).then(res => {
          this.loading = false
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `Password updated successfully.`
          })
        })
      }
    }
  },
  validations: {
    password: {
      required,
      minLength: minLength(8)
    },
    confirmPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  computed: {
    ...mapState('users', ['editUser'])
  }
}
</script>
