<template>
  <q-page class="docs-input row main flex flex-center">

    <div class="formContainer self-center">

      <form @submit.prevent="submit">
        <p class="text-h5 text-center">
          <q-icon name="lock" /> Account Login</p>
        <q-banner
          rounded
          inline-actions
          :class="activationBanner"
          class="q-mb-sm text-center"
          v-if="$route.params.token"
        >
          <q-icon
            style="font-size: 2em;"
            :name="activationIcon"
          /> {{ activationMessage }}
        </q-banner>
        <q-input
          dark
          v-model="$v.email.$model"
          label="Username/Email"
          @keyup.enter="login"
          :error="$v.email.$dirty &&!$v.email.required"
          error-message="Username/Email is required."
          bottom-slots
        >
        </q-input>
        <q-input
          dark
          v-model="$v.password.$model"
          :type="isPwd ? 'password' : 'text'"
          class="q-mt-sm form__input"
          label="Password"
          @keyup.enter="login"
          :error="$v.password.$dirty && !$v.password.required ||$v.password.$dirty && !$v.password.minLength "
          error-message="Password must be at least 8 and required."
          bottom-slots
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div>
          <q-btn
            @click="back"
            color="secondary"
            class="q-ma-sm"
            no-caps
          >
            Cancel
          </q-btn>
          <q-btn
            :loading="loading"
            @click="login"
            color="primary"
            class="q-ma-sm"
            no-caps
          >
            Login
          </q-btn>

        </div>
        <div class="float-right">
          <q-btn
            to="/register"
            color="white"
            class="q-ma-sm"
            flat
            no-caps
          >
            Register Account
          </q-btn>
          <q-btn
            to="/password/reset"
            color="white"
            class="q-ma-sm"
            flat
            no-caps
          >
            Forgot Password
          </q-btn>
        </div>

      </form>
    </div>
  </q-page>
</template>

<script>

import {
  setAuthHeader
} from 'boot/axios'

import {
  required,
  minLength
} from 'vuelidate/lib/validators'
import {
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      prevRoute: null,
      activationIcon: 'warning',
      activationMessage: 'We cannot find your activation code.',
      activationBanner: 'text-white bg-red',
      email: '',
      password: '',
      isPwd: true,
      loading: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  validations: {
    email: {
      required
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  methods: {
    ...mapActions('users', ['setToken', 'setUser', 'setDelivery']),
    ...mapActions('global', ['setLeftDrawer']),
    back () {
      this.setLeftDrawer(true)
      this.$router.push('/')
    },
    login () {
      this.loading = true
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          message: 'Please review your login credentials.',
          color: 'negative',
          icon: 'warning'
        })
        this.loading = false
      } else {
        this.$axios.post('/login', {
          email: this.email,
          password: this.password
        })
          .then(res => {
            this.setToken(res.data.success.token)
            this.setUser(res.data.user)
            this.setDelivery(res.data.user)

            setAuthHeader(res.data.success.token)
            this.loading = false
            this.setLeftDrawer(true)

            this.$router.push(`/dashboard/profile/${res.data.user.optimus_id}`)
          })
          .catch(error => {
            this.loading = false
            if (error.response.status === 401) {
              this.$q.notify({
                icon: 'warning',
                color: 'negative',
                message: error.response.data.error
              })
              return
            }
            this.$q.notify({
              icon: 'warning',
              color: 'negative',
              message: error.message
            })
          })
      }
    }
  },
  mounted () {
    this.setLeftDrawer(false)
    if (this.$route.params.token !== undefined) {
      this.$axios.post(`register/${this.$route.params.token}`)
        .then(res => {
          this.activationIcon = 'check'
          this.activationMessage = 'You have successfully verified your email. You may now login.'
          this.activationBanner = 'text-white bg-positive'
        })
    }
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
