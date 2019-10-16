<template>
  <q-layout view="lHh Lpr fFf">
    <q-header
      elevated
      color="negative"
    >
      <q-toolbar class=" bg-primary shadow-transition ">
        <q-btn
          flat
          dense
          round
          @click="clickLeftDrawer"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Patty's Bakeshop
          <!-- <img
            style="margin-top: 5px;"
            src="/statics/logo.jpg"
            width="120"
          /> -->
        </q-toolbar-title>
        <q-btn
          flat
          v-if="token != ''"
          @click="dialog = true"
        >
          <q-icon name="power_settings_new" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawer"
      bordered
      content-class="bg-grey-2"
    >
      <q-input
        dense
        debounce="500"
        class="q-pa-sm"
        label="Search Menu..."
        v-model="searchMenu"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list>
        <template v-for="(menu, i) in menus">
          <q-expansion-item
            expand-separator
            :label="menu.name"
            :key="i"
            v-if="menu.all_children.length > 0"
            :to="`${menu.path}`"
          >
            <!-- <template v-for="(subCat, a) in category.all_children">
                        <q-expansion-item :header-inset-level="1" expand-separator :label="subCat.name" :key="a" v-if="subCat.all_children.length > 0" :to="`/catalog/${category.name}/${subCat.optimus_id}/${subCat.name}`" exact>
                            <template v-for="(furtherCat, b) in subCat.all_children">
                                <q-expansion-item switch-toggle-side dense-toggle :label="furtherCat.name" :header-inset-level="1" :content-inset-level="2" :key="b" v-if="furtherCat.all_children.length > 0">
                                </q-expansion-item>
                                <q-item clickable v-ripple v-else :key="b" side :inset-level="2">
                                    <q-item-section>{{ furtherCat.name }}</q-item-section>
                                </q-item>
                            </template>
                        </q-expansion-item>
                        <q-item clickable v-ripple v-else :key="a" side :inset-level="1" :to="`/catalog/${category.optimus_id}/${category.slug_name}/${subCat.optimus_id}/${subCat.slug_name}`" exact>
                            <q-item-section>{{ subCat.name }}</q-item-section>
                        </q-item>
                    </template> -->
          </q-expansion-item>
          <template v-else>
            <q-item
              clickable
              v-ripple
              :key="i"
              :to="`/dashboard/profile/${user.optimus_id}`"
              exact
              v-if="menu.name == 'Profile'"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" />
              </q-item-section>
              <q-item-section>{{ menu.name }} </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :key="i"
              :to="`${menu.path}`"
              exact
              v-else
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" />
              </q-item-section>
              <q-item-section>{{ menu.name }}</q-item-section>
            </q-item>
          </template>

        </template>
      </q-list>
      <!-- <q-list bordered class="rounded-borders">
            <q-item-label header>Dashboard</q-item-label>
            <q-item to="/" :exact="true">
                <q-item-section avatar>
                    <q-icon name="home" />
                </q-item-section>
                <q-item-section>Home</q-item-section>
            </q-item>
            <q-item to="/dashboard" :exact="true">
                <q-item-section avatar>
                    <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-expansion-item expand-separator icon="account_circle" label="Profile" :to="`/dashboard/profile/${user.optimus_id}`" :exact="true">
                <q-item side v-ripple clickable exact>
                    <q-item-section @click="showPasswordModal" style="margin-left: 60px;">
                        Change Password
                    </q-item-section>
                </q-item>
            </q-expansion-item>
            <q-item to="/dashboard/users" :exact="true">
                <q-item-section avatar>
                    <q-icon name="supervisor_account" />
                </q-item-section>
                <q-item-section>Users</q-item-section>
            </q-item>
            <q-item to="/dashboard/roles" :exact="true">
                <q-item-section avatar>
                    <q-icon name="recent_actors" />
                </q-item-section>
                <q-item-section>Roles</q-item-section>
            </q-item>
            <q-item to="/dashboard/categories" :exact="true">
                <q-item-section avatar>
                    <q-icon name="list" />
                </q-item-section>
                <q-item-section>Categories</q-item-section>
            </q-item>
        </q-list> -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog
      v-model="dialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            icon="power_settings_new"
            color="primary"
            text-color="white"
          />
          <span class="q-ml-sm">Are you sure you want to log-out?</span>
        </q-card-section>

        <!-- Notice v-close-dialog -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            label="Logout"
            color="primary"
            v-close-popup
            @click="logout"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import {
  openURL
} from 'quasar'
import {
  unSetAuthHeader
} from 'boot/axios'
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'MyLayout',
  data () {
    return {
      searchMenu: '',
      dialog: false,
      menu: false,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapState('users', ['token', 'user']),
    ...mapState('global', ['cart', 'cartLength']),
    ...mapState('menus', ['menus']),
    leftDrawer: {
      get () {
        return this.$store.getters['global/leftDrawer']
      },
      set (val) {
        this.setLeftDrawer(val)
      }
    }
  },
  methods: {
    openURL,
    ...mapActions('global', ['setLeftDrawer']),
    ...mapActions('users', ['setToken', 'setUser', 'setDialogChangePassword']),
    ...mapActions('menus', ['setMenus']),
    showPasswordModal () {
      this.setDialogChangePassword(true)
    },
    clickLeftDrawer () {
      if (this.leftDrawer === true) {
        this.setLeftDrawer(false)
      } else {
        this.setLeftDrawer(true)
      }
    },
    getMenus () {
      this.$axios.get('menus')
        .then(res => {
          this.setMenus(res.data.menus)
        })
    },
    logout () {
      this.$axios.post('/logout').then(e => {
        unSetAuthHeader()
        this.setToken('')
        this.setUser({})
        this.$router.push('/')
      })
        .catch(e => {
          unSetAuthHeader()
          this.setToken('')
          this.setUser({})
        })
    },
    searchMenus (val) {
      this.$axios.get(`search-menus?search=${val}`)
        .then(res => {
          this.setMenus(res.data.menus)
        })
    }
  },
  created () {
    this.getMenus()
  },
  watch: {
    searchMenu (val) {
      this.searchMenus(val)
    }
  }
}
</script>

<style>
</style>
