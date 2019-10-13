<template>
  <div class="q-ma-md">
    <form @submit.prevent="$emit('add')">
      <div class="row">
        <div class="col-12">
          <p class="text-h5 q-ma-sm">
            <q-icon
              :name="icon"
              color="grey"
            /> {{ locRole.name }}
          </p>
        </div>
        <div class="col-12">

          <q-input
            outlined
            dense
            v-model="$v.locRole.name.$model"
            label="Role Name"
            :error="$v.locRole.name.$error"
            bottom-slots
            error-message="Role name is required."
          />
        </div>
        <div class="col-12">
          <q-select
            outlined
            dense
            v-model="locRole.parent_id"
            :options="locRoles"
            label="Supervisor"
            use-chips
            bottom-slots
          />
        </div>
        <div class="col-12">
          <q-select
            outlined
            dense
            v-model="$v.locRole.menu_id.$model"
            :options="locMenus"
            label="Menu"
            :error="$v.locRole.menu_id.$error"
            bottom-slots
            error-message="Menu is required."
            use-chips
            multiple
          />
        </div>
        <div class="col-12">
          <q-input
            type="textarea"
            dense
            outlined
            v-model="$v.locRole.description.$model"
            label="Description"
            :error="$v.locRole.description.$error"
            bottom-slots
            error-message="Description is required."
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
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  props: {
    role: {
      type: [Array, Object],
      default: null
    },
    icon: {
      type: [String],
      default: null
    }
  },
  validations: {
    locRole: {
      name: {
        required
      },
      menu_id: {
        required
      },
      description: {
        required
      }
    }
  },
  data () {
    return {
      locRole: this.role,
      locRoles: this.roles,
      locMenus: this.menus
    }
  },
  computed: {
    ...mapState('roles', ['menus', 'roles'])
  },
  methods: {
    ...mapActions('roles', ['setMenus', 'setRoles']),
    getMenus () {
      this.$axios.get('role_menus')
        .then(res => {
          this.setMenus(res.data.menus)
          this.locMenus = res.data.menus
        })
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
        this.$axios.put(`/dashboard_role/${this.locRole.optimus_id}?id=${this.locRole.optimus_id}`, this.roleData()).then(res => {
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.locRole.name} updated successfully.`
          })
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: err.response.data.message
          })
        })
      }
    },
    add () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios.post(`/dashboard_role`, this.roleData()).then(res => {
          this.locRole = {
            name: '',
            description: '',
            parent_id: null,
            menu_id: null,
            desc: ''
          }
          this.$v.$reset()
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `${this.locRole.name} created successfully.`
          })
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `${err.response.data.message}`
          })
        })
      }
    },
    roleData () {
      let role = null
      if (this.locRole.parent_id !== null) {
        role = this.locRole.parent_id.value
      }
      return {
        name: this.locRole.name,
        parent_id: role,
        description: this.locRole.description,
        menu_id: this.locRole.menu_id
      }
    },
    getRoles () {
      this.$axios.get('/dashboard_role/create')
        .then(res => {
          this.setRoles(res.data.roles)
          this.locRoles = res.data.roles
        })
    }
  },
  mounted () {
    this.getMenus()
    this.locRoles = this.roles
  }

}
</script>
