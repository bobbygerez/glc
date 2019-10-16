<template>
<div class="window-height window-width row justify-center items-center q-pa-sm main">
    <q-card class="q-pa-sm gt-sm formContainer" style="margin-top:-50px; ">
        <q-card-section dark>
           <div class="bg-white text-center">
          <img
            src="/statics/logo.jpg"
            width="200"
          />
        </div>
        </q-card-section>
        <q-card-section>
            <div class="row">
                <div class="col-xs-4">
                    <q-input dark   v-model="$v.firstname.$model" label="Firstname" :error="$v.firstname.$error" error-message="Firstname is required." bottom-slots></q-input>
                </div>
                <div class="col-xs-4">
                    <q-input dark  v-model="$v.middlename.$model" label="Middlename" class="q-ml-sm" :error="$v.middlename.$error" error-message="Middlename is required." bottom-slots></q-input>
                </div>
                <div class="col-xs-4">
                    <q-input dark   v-model="$v.lastname.$model" label="Lastname" class="q-ml-sm" :error="$v.lastname.$error" error-message="Lastname is required." bottom-slots></q-input>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-4">
                    <q-input debounce="500" dark  v-model="$v.email.$model" label="Email" :error="$v.email.$error" :error-message="emailError" bottom-slots></q-input>

                </div>
                <div class="col-xs-4">
                    <q-input debounce="500" dark v-model="$v.username.$model" label="Username" class="q-ml-sm" :error="$v.username.$error" :error-message="usernameError" bottom-slots></q-input>
                </div>
                <div class="col-xs-4">
                    <q-input debounce="500" dark v-model="$v.mobile.$model" label="Mobile" class="q-ml-sm" :error="$v.mobile.$error" :error-message="mobileError" bottom-slots></q-input>
                </div>

                 <div class="col-xs-6">
                    <q-input dark  v-model="$v.password.$model" :type="isPwd ? 'password' : 'text'" label="Password" @keyup.enter="register" :error="$v.password.$error" error-message="Password must be at least 8 characters." bottom-slots>
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </div>
                 <div class="col-xs-6">
                    <q-input dark  class="q-ml-sm"  v-model="$v.confirm_password.$model" type="password" label="Confirm Password" :error="$v.confirm_password.$error" error-message="Must be the same as password."></q-input>
                </div>
            </div>
        </q-card-section>

          <q-btn @click="back" type="submit" color="secondary" class="q-ml-md" no-caps> Cancel </q-btn>
            <q-btn @click="register" type="submit" color="primary" class="q-ml-md" no-caps>Register</q-btn>
    </q-card>

    <q-card class="q-pa-sm lt-md formContainer" style="margin-top:-50px; ">
        <q-card-section>
            <div class="text-h5 text-center"> <q-icon name="account_circle" />  New Account</div>
        </q-card-section>
        <q-card-section>
            <div class="row">
                <div class="col-xs-6">
                    <q-input dark v-model="$v.firstname.$model" label="Firstname" :error="$v.firstname.$error" error-message="Firstname is required." bottom-slots></q-input>
                </div>
                <div class="col-xs-6">
                    <q-input dark v-model="$v.middlename.$model" label="Middlename" class="q-ml-sm" :error="$v.middlename.$error" error-message="Middlename is required." bottom-slots></q-input>
                </div>
                <div class="col-xs-6">
                    <q-input dark v-model="$v.lastname.$model" label="Lastname"  :error="$v.lastname.$error" error-message="Lastname is required." bottom-slots></q-input>
                </div>
                <div class="col-xs-6">
                    <q-input  debounce="500" dark v-model="$v.mobile.$model" label="Mobile" class="q-ml-sm" :error="$v.mobile.$error" :error-message="mobileError" bottom-slots></q-input>
                </div>
                <div class="col-xs-6">
                    <q-input debounce="500" dark v-model="$v.username.$model" label="Username"  :error="$v.username.$error" :error-message="usernameError" bottom-slots></q-input>
                </div>
                <div class="col-xs-6">
                     <q-input debounce="500" dark v-model="$v.email.$model" label="Email" class="q-ml-sm" :error="$v.email.$error" :error-message="emailError" bottom-slots></q-input>

                </div>
                <div class="col-xs-6">
                   <q-input dark v-model="$v.password.$model" :type="isPwd ? 'password' : 'text'" label="Password" @keyup.enter="register" :error="$v.password.$error" error-message="Password must be at least 8 characters." bottom-slots >
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </div>
                <div class="col-xs-6">
                     <q-input dark v-model="$v.confirm_password.$model" type="password" label="Confirm Password"  :error="$v.confirm_password.$error" error-message="Must be the same as password." class="q-ml-sm"></q-input>
                </div>
            </div>
            <div class="row">

            </div>
        </q-card-section>

           <q-btn @click="back" color="secondary" class="q-ma-sm" no-caps>
                    Cancel
                </q-btn>
            <q-btn @click="register" type="submit" color="primary" class="q-ml-md" no-caps>Register</q-btn>
    </q-card>
</div>
</template>

<script>
import {
  required,
  email,
  integer,
  sameAs,
  minLength
} from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      mobileError: 'Mobile # must be integer and required.',
      emailError: 'Valid email is required.',
      usernameError: 'Username is required.',
      isPwd: true,
      firstname: '',
      middlename: '',
      lastname: '',
      mobile: '',
      username: '',
      email: '',
      password: '',
      confirm_password: ''
    }
  },
  validations: {
    firstname: {
      required
    },
    middlename: {
      required
    },
    lastname: {
      required
    },
    email: {
      isUnique (value) {
        this.emailError = 'Valid email is required.'
        return this.$axios.get(`/user/validator/email?email=${value}&id=${this.$route.params.id}`)
          .then(res => {
            console.log(res)
            return true
          })
          .catch(err => {
            console.log(err)
            this.emailError = 'Email has already been taken.'
            return false
          })
      },
      required,
      email
    },
    mobile: {
      isUnique (value) {
        this.mobileError = 'Mobile # must be integer and required.'
        return this.$axios.get(`/user/validator/mobile?mobile=${value}&id=${this.$route.params.id}`)
          .then(res => {
            console.log(res)
            return true
          })
          .catch(err => {
            console.log(err)
            this.mobileError = 'Mobile has already been taken.'
            return false
          })
      },
      required,
      integer
    },
    username: {
      isUnique (value) {
        this.usernameError = 'Username is required.'
        return this.$axios.get(`/user/validator/username?username=${value}&id=${this.$route.params.id}`)
          .then(res => {
            console.log(res)
            return true
          })
          .catch(err => {
            console.log(err)
            this.usernameError = 'Username has already been taken.'
            return false
          })
      },
      required
    },
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
      this.$router.push('/')
    },
    register () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check error fields.`
        })
      } else {
        this.$axios.post('user_register', {
          firstname: this.firstname,
          middlename: this.middlename,
          lastname: this.lastname,
          mobile: this.mobile,
          email: this.email,
          username: this.username,
          password: this.password
        })
          .then(res => {
            this.firstname = ''
            this.middlename = ''
            this.lastname = ''
            this.mobile = ''
            this.username = ''
            this.email = ''
            this.password = ''
            this.confirm_password = ''
            this.$v.$reset()
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `New Account successfully created. Please check your email.`
            })
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
