<template>
<q-page class="docs-input row main flex flex-center">

    <div class="formContainer self-center">

        <form @submit.prevent="submit">
            <p class="text-h5 text-center">
                Password Reset </p>
            <q-input dark v-model="$v.email.$model" label="Enter Email" @keyup.enter="login" :error="$v.email.$error" bottom-slots>
                <template v-slot:error>
                    <p class="text-primary">Email must be a valid email. </p>
                </template>
            </q-input>
            <div>
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
  email
} from 'vuelidate/lib/validators'
import {
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      email: '',
      loading: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    ...mapActions('global', ['setLeftDrawer']),
    back () {
      this.setLeftDrawer(true)
      this.$router.go(-1)
    },
    reset () {
      this.loading = true
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          message: 'Please review your form credentials.',
          color: 'negative',
          icon: 'warning'
        })
        this.loading = false
      } else {
        this.$axios.post('/password/reset', {
          email: this.email
        })
          .then(res => {
            this.loading = false
            this.$q.notify({
              message: 'We have emailed your password reset link.',
              color: 'positive',
              icon: 'check'
            })
            this.email = ''
            this.$v.$reset()
          })
          .catch(res => {
            this.$q.notify({
              message: 'We cannot find your email.',
              color: 'negative',
              icon: 'warning'
            })
            this.loading = false
          })
      }
    }
  },
  mounted () {
    this.setLeftDrawer(false)
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
