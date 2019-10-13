<template>
<div class="q-ma-md">

    <div class="row">
        <div class="col-12">
            <p class="text-h5 q-ma-sm">
                <q-icon name="edit" color="grey" />
                {{ locUser.firstname }} {{ locUser.middlename }} {{ locUser.lastname }}
            </p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.username.$model" bottom-slots error-message="Username is required." :error="$v.locUser.username.$error" label="Username" dense />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.email.$model" bottom-slots error-message="Email must be valid and required." label="Email" :error="$v.locUser.email.$error" dense class="q-ml-sm"/>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.mobile.$model" bottom-slots error-message="Mobile must be 11 digits and required." label="Mobile" :error="$v.locUser.mobile.$error" dense class="q-ml-sm"/>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.firstname.$model" bottom-slots error-message="Firstname is required." label="Firstname"  :error="$v.locUser.firstname.$error" dense />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.middlename.$model" bottom-slots error-message="Middlename is required." label="Middlename"  :error="$v.locUser.middlename.$error" dense class="q-ml-sm"/>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input outlined v-model="$v.locUser.lastname.$model" bottom-slots error-message="Lastname is required." label="Lastname"  :error="$v.locUser.lastname.$error" dense class="q-ml-sm"/>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select outlined v-model="$v.locUser.address.province_id.$model" :options="provinces" label="Province"   :error="$v.locUser.address.province_id.$error" bottom-slots error-message="Province is required." dense />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select outlined v-model="$v.locUser.address.city_id.$model" :options="cities" label="City" :error="$v.locUser.address.city_id.$error" bottom-slots error-message="City is required." dense class="q-ml-sm"/>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select outlined v-model="$v.locUser.address.brgy_id.$model" :options="brgys" label="Brgys" :error="$v.locUser.address.brgy_id.$error" bottom-slots error-message="Barangay is required." dense class="q-ml-sm"/>
        </div>
        <div class="col-12">
            <q-input type="textarea" outlined v-model="$v.locUser.address.street_lot_blk.$model" label="Blk, Lot and Street No."  :error="$v.locUser.address.street_lot_blk.$error" bottom-slots error-message="Street, lot and block is required." dense />
        </div>
        <div class="col-12">
            <q-btn @click="cancel" color="grey-8" label="Cancel" class="q-ma-sm" no-caps />
            <q-btn @click="update" color="secondary" label="Update" class="q-ma-sm" no-caps />
            <q-btn :to="`/dashboard/user/${$route.params.id}/change-password`" label="Change Password" color="primary" class="q-ma-sm" no-caps />
        </div>
    </div>

</div>
</template>

<script>
import genericPlaces from 'components/mixins/generic-places'
// import _ from 'lodash'
import {
  integer,
  email,
  required,
  minLength
} from 'vuelidate/lib/validators'
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  mixins: [genericPlaces],
  data () {
    return {
      locUser: {
        firstname: null,
        lastname: null,
        middlename: null
      },
      dialogChangePassword: false,
      loading: false,
      password: '',
      confirmPassword: ''
    }
  },
  validations: {
    locUser: {
      username: {
        required
      },
      email: {
        required,
        email
      },
      firstname: {
        required
      },
      middlename: {
        required
      },
      lastname: {
        required
      },
      mobile: {
        required,
        integer,
        minLength: minLength(11)
      },
      address: {
        province_id: {
          required
        },
        city_id: {
          required
        },
        brgy_id: {
          required
        },
        street_lot_blk: {
          required
        }
      },
      roles: {
        required
      }

    }

  },
  methods: {
    ...mapActions('users', [
      'setRoles',
      'setEditCities'
    ]),
    ...mapActions('provinces', ['setProvinces']),
    ...mapActions('cities', ['setCities']),
    ...mapActions('brgys', ['setBrgys']),
    getRoles () {
      this.$axios.get('/roles').then(res => {
        this.setRoles(res.data.roles)
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    data () {
      let u = this.editUser
      let roles = u.roles.map(function (v) {
        return v.value
      })
      return {
        firstname: u.firstname,
        middlename: u.middlename,
        lastname: u.lastname,
        email: u.email,
        mobile: u.mobile,
        notes: u.notes,
        roles: roles,
        address: {
          province_id: u.address.province_id.value,
          city_id: u.address.city_id.value,
          brgy_id: u.address.brgy_id.value,
          street_lot_blk: u.address.street_lot_blk
        }
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
        this.$axios
          .put(
            `/users/${this.$route.params.id}?id=${this.$route.params.id}`,
            this.data()
          )
          .then(res => {
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `User updated successfully.`
            })
          })
      }
    }
  },
  computed: {
    ...mapState('users', ['editUser', 'user']),
    ...mapState('provinces', ['provinces']),
    ...mapState('cities', ['cities']),
    ...mapState('brgys', ['brgys']),
    roles () {
      return this.$store.getters['users/roles'].map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    },
    provinces () {
      return this.$store.getters['provinces/provinces'].map(e => {
        return {
          label: e.description,
          value: e.id
        }
      })
    },
    cities () {
      return this.$store.getters['cities/cities'].map(e => {
        return {
          label: e.description,
          value: e.id
        }
      })
    },
    brgys () {
      return this.$store.getters['brgys/brgys'].map(e => {
        return {
          label: e.description,
          value: e.id
        }
      })
    }
  },
  mounted () {
    this.getRoles()
    this.getProvinces()
    this.locUser = this.editUser
  },
  watch: {
    'locUser.address.province_id' (val) {
      if (this.locUser.address.province_id !== null) {
        this.getCities(val.value)
      }
    },
    'locUser.address.city_id' (val) {
      if (this.locUser.address.city_id !== null) {
        this.getBrgys(val.value)
      }
    }
  }
}
</script>
