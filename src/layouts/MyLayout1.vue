<template>
<q-layout view="lHh Lpr lFf">
    <q-header elevated >
        <!-- <q-bar class="bg-white text-grey-7 gt-xs">
            <q-btn dense flat label="Free shipping" no-caps />
            |
            <q-btn dense flat label="Free returns" no-caps />
            |
            <q-btn dense flat label="Cash on delivery" no-caps />
            <q-space />
            <q-btn dense flat label="Customer service" no-caps />
            |
            <q-btn dense flat label="Sell with us" no-caps />
            |
            <q-btn dense flat label="Track orders" no-caps />
        </q-bar>
        <q-bar class="bg-white text-grey-7 lt-sm" >
            <q-btn dense outline label="Free shipping" no-caps />
            <q-btn dense outline label="Free returns" no-caps />
            <q-btn dense outline label="Cash on delivery" no-caps />
            <q-btn dense outline label="Customer service" no-caps />
            <q-btn dense outline label="Sell with us" no-caps />
            <q-btn dense outline label="Track orders" no-caps />
        </q-bar>
        <q-separator /> -->
        <q-toolbar class="bg-primary shadow-transition glossy">
            <q-btn flat dense round @click="clickLeftDrawer" aria-label="Menu">
                <q-icon name="menu" />
            </q-btn>
            <q-toolbar-title class="gt-xs">
             Pattys Bakeshop
            </q-toolbar-title>
            <q-space />
            <q-input outlined dense bg-color="white" v-model="searchStringProduct" input-class="text-left" label="Search Product..."  debounce="500">
                <template v-slot:append>
                    <q-icon v-if="searchStringProduct === ''" name="search" />
                    <q-icon v-else name="clear" class="cursor-pointer" @click="changeSearchStringProduct" />
                </template>
            </q-input>
            <q-btn-group flat>
                <q-btn dense flat icon="shopping_cart" class="q-ml-md" to="/cart">
                    <q-badge color="secondary" floating v-if="cartLength != ''">{{ cartLength }}</q-badge>
                </q-btn>
                <q-btn dense flat icon="dashboard" class="q-ml-md" to="/dashboard" v-if="token !== ''" />

                <q-btn dense flat icon="lock" class="q-ml-md" to="/login" v-else/>
                <q-btn flat v-if="token != ''" @click="dialog = true">
                    <q-icon name="power_settings_new" />
                </q-btn>
            </q-btn-group>
        </q-toolbar>
    </q-header>
    <!-- <q-footer >
        <q-toolbar class="bg-white text-grey-7" elevated>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer> -->
    <q-drawer v-model="leftDrawer" bordered content-class="bg-grey-2" dark>
        <q-input dense debounce="500" class="q-pa-sm" label="Search Category..." v-model="searchCategory">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
        </q-input>
        <q-list>
            <template v-for="(category, i) in categories">
                <q-expansion-item expand-separator :label="category.name" :key="i" v-if="category.all_children.length > 0" :to="`/catalog/${category.optimus_id}/${category.slug_name}`">
                    <template v-for="(subCat, a) in category.all_children">
                        <q-expansion-item :header-inset-level="1" expand-separator :label="subCat.name" :key="a" v-if="subCat.all_children.length > 0" :to="`/catalog/${category.optimus_id}/${category.slug_name}/${subCat.optimus_id}/${subCat.slug_name}`" exact>
                            <template v-for="(furtherCat, b) in subCat.all_children">
                                <q-expansion-item switch-toggle-side dense-toggle :label="furtherCat.name" :header-inset-level="1" :content-inset-level="2" :key="b" v-if="furtherCat.all_children.length > 0"
                                :to="`/catalog/${category.name}/${subCat.optimus_id}/${subCat.name}/${furtherCat.name}/${futherCat.optimus_id}`">
                                </q-expansion-item>
                                <q-item clickable v-ripple v-else :key="b" side :inset-level="2" :to="`/catalog/${category.optimus_id}/${category.slug_name}/${subCat.optimus_id}/${subCat.slug_name}/${furtherCat.optimus_id}/${furtherCat.slug_name}`" exact>
                                    <q-item-section>{{ furtherCat.name }}</q-item-section>
                                </q-item>
                            </template>
                        </q-expansion-item>
                        <q-item clickable v-ripple v-else :key="a" side :inset-level="1" :to="`/catalog/${category.optimus_id}/${category.slug_name}/${subCat.optimus_id}/${subCat.slug_name}`" exact>
                            <q-item-section>{{ subCat.name }}</q-item-section>
                        </q-item>
                    </template>

                </q-expansion-item>
                <q-item clickable v-ripple v-else :key="i" :to="`/catalog/${category.optimus_id}/${category.slug_name}`">
                    <q-item-section>{{ category.name }}</q-item-section>
                </q-item>
            </template>
        </q-list>
    </q-drawer>

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
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Logout" color="primary" v-close-popup @click="logout" />
            </q-card-actions>
        </q-card>
    </q-dialog>

</q-layout>
</template>

<script>
import _ from 'lodash'
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

    searchStringProduct: {
      get () {
        return this.$store.getters['global/searchStringProduct']
      },
      set (val) {
        this.setSearchStringProduct(val)
      }
    },
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
    openURL,
    ...mapActions('categories', ['setCategories', 'setSearchCategory']),
    ...mapActions('global', ['setLeftDrawer', 'setSearchStringProduct']),
    ...mapActions('users', ['setToken', 'setUser']),
    ...mapActions('products', ['setProducts']),
    changeSearchStringProduct () {
      this.setSearchStringProduct('')
    },
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
    searchCategory (val) {
      this.getCategories()
    }
  }
}
</script>
