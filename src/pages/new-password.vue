<template>
<q-page class="docs-input row main flex flex-center">

    <div class="formContainer self-center">

        <form @submit.prevent="submit">
            <p class="text-h5 text-center">
                Password Reset </p>
            <q-banner rounded inline-actions :class="activationBanner" class="q-mb-sm text-center">
                <q-icon style="font-size: 2em;" :name="activationIcon" /> {{ activationMessage }}
            </q-banner>
            <div class="col-xs-12" v-if="valid === true">
                <q-input dark v-model="$v.password.$model" :type="isPwd ? 'password' : 'text'" label="New Password" @keyup.enter="register" :error="$v.password.$error" error-message="Password must be at least 8 characters." bottom-slots>
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                    </template>
                </q-input>
            </div>
            <div class="col-xs-12" v-if="valid === true">
                <q-input dark v-model="$v.confirm_password.$model" type="password" label="Confirm Password" :error="$v.confirm_password.$error" error-message="Must be the same as password."></q-input>
            </div>
            <div v-if="valid === true">
                <q-btn @click="back" color="secondary" class="q-ma-sm" no-caps>
                    Cancel
                </q-btn>
                <q-btn :loading="loading" @click="reset" color="primary" class="q-ma-sm" no-caps>
                    Submit
                </q-btn>

            </div>
        </form>
    </div>
</q-page>
</template>

<script>
import {
  required,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'
import {
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      prevRoute: null,
      valid: false,
      activationIcon: 'warning',
      activationMessage: 'Password reset code is invalid.',
      activationBanner: 'text-white bg-red',
      password: '',
      confirm_password: '',
      loading: false,
      isPwd: true
    }
  },

  validations: {
    password: {
      required,
      minLength: minLength(8)
    },
    confirm_password: {
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    ...mapActions('global', ['setLeftDrawer']),
    back () {
      this.setLeftDrawer(true)

      this.$router.go(-1)
    },
    getDetails () {
      this.loading = true
      this.$axios.get(`/password/reset/${this.$route.params.token}`)
        .then(res => {
          let user = res.data.user
          this.loading = false
          this.activationIcon = 'check'
          this.activationMessage = user.firstname + ' ' + user.lastname + ' please reset your password.'
          this.activationBanner = 'text-white bg-positive'
          this.valid = true
        })
        .catch(res => {
          this.$q.notify({
            message: 'We cannot find your passport reset code.',
            color: 'negative',
            icon: 'warning'
          })
          this.loading = false
        })
    },
    reset () {
      this.loading = false
      this.$axios.post(`/password/reset/${this.$route.params.token}`, {
        password: this.password,
        confirm_password: this.confirm_password
      })
        .then(res => {
          this.loading = false
          this.activationIcon = 'check'
          this.activationMessage = 'You have successfully changed your password. You may now login.'
          this.activationBanner = 'text-white bg-positive'
          this.valid = true
          this.password = ''
          this.confirm_password = ''
          this.$v.$reset()
        })
        .catch(res => {
          console.log(res)
          this.$q.notify({
            message: 'An error occurred in changing your password.',
            color: 'negative',
            icon: 'warning'
          })
        })
    }
  },
  mounted () {
    this.setLeftDrawer(false)
    this.getDetails()
    console.log(this.prevRoute)
  }
}
</script>

<style>
.main {
    background: url(../assets/bg-min.jpg);
    background-repeat: no-repeat;
    background-size: cover;
}

.form-wrapper {
    background: rgba(0, 0, 0, 0.5);
    overflow: auto;
}

.form-wrapper,
.form-wrapper input,
.form-wrapper label {
    color: #fff;
}

.header-login {
    text-align: center;
}

.formContainer,
.formContainer input,
.formContainer label {
    color: #fff;
}

.formContainer {
    width: 600px;
    max-width: 90vw;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    overflow: hidden;
}
</style>
