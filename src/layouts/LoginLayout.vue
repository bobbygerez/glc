<template>
<q-layout view="lHh Lpr fFf">
    <q-page-container>
        <router-view />
    </q-page-container>
    <q-dialog v-model="dialog" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="power_settings_new" color="primary" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to log-out?</span>
            </q-card-section>

            <!-- Notice v-close-dialog -->
            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary"  />
                <q-btn flat label="Logout" color="primary" @click="logout" />
            </q-card-actions>
        </q-card>
    </q-dialog>

</q-layout>
</template>

<script>
import _ from 'lodash'

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
      tab: '',
      text: '',
      dialog: false,
      menu: false,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapState('categories', ['categories']),
    ...mapState('users', ['token', 'user']),
    ...mapState('global', ['cart', 'cartLength']),
    searchCategory: {
      get () {
        return this.$store.getters['categories/searchCategory']
      },
      set (val) {
        this.setSearchCategory(val)
      }
    },
    page: {
      get () {
        return this.$store.getters['users/page']
      },
      set (val) {
        this.setPage(val)
      }
    },
    leftDrawer: {
      get () {
        return this.$store.getters['global/leftDrawer']
      },
      set (val) {
        this.setLeftDrawer(val)
      }
    },
    cartLength () {
      let cartLength = _.sumBy(this.cart, (i) => {
        return i.qty
      })
      if (cartLength === 0) {
        return ''
      } else {
        return cartLength
      }
    }
  },
  methods: {
    ...mapActions('categories', ['setCategories', 'setSearchCategory']),
    ...mapActions('global', ['setLeftDrawer']),
    ...mapActions('users', ['setToken', 'setUser']),
    ...mapActions('products', ['setProducts', 'searchProduct']),
    clickLeftDrawer () {
      if (this.leftDrawer === true) {
        this.setLeftDrawer(false)
      } else {
        this.setLeftDrawer(true)
      }
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
    getCategories () {
      this.$axios.get(`search-category?search=${this.searchCategory}`)
        .then(res => {
          this.setCategories(res.data.categories)
        })
    }
  },
  mounted () {
    this.getCategories()
  },
  watch: {
    '$route' (to, from) {
      this.getCategories()
    },
    text (val) {
      this.searchProduct({
        string: val,
        page: this.page,
        perPage: 30,
        id: this.$route.params.catId
      })
    },
    searchCategory (val) {
      this.getCategories()
    }
  }
}
</script>

<style lang="stylus" scoped>
.shadow-box
  width 90px
  height 90px
  margin 25px
  border-radius 50%
  font-size 12px
.doc-inset-shadow
  border 1px solid $grey-3
</style>
