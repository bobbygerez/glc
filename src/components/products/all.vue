<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-10">
        <q-breadcrumbs
          class="q-ma-md"
          dense
        >
          <template v-slot:separator>
            <q-icon
              size="1.5em"
              name="chevron_right"
              color="primary"
            />
          </template>
          <q-breadcrumbs-el
            icon="home"
            to="/"
          />
          <q-breadcrumbs-el
            label="Catalog"
            to="/catalog"
            v-if="$route.path !== '/'"
          />
          <template v-for="(breadCrumb, k) in breadCrumbs">
            <q-breadcrumbs-el
              exact
              :to="`/catalog/${breadCrumbs[k-1]}/${breadCrumb}`"
              :key="k"
              v-if="isNaN(parseInt(breadCrumb)) && breadCrumbs.length <= 4"
            >
              {{ breadCrumb.replace('-', ' ') | capitalize }}
            </q-breadcrumbs-el>
            <q-breadcrumbs-el
              exact
              :to="`/catalog/${breadCrumbs[0]}/${breadCrumbs[1]}/${breadCrumbs[2]}/${breadCrumbs[3]}`"
              :key="k"
              v-if="isNaN(parseInt(breadCrumb)) && breadCrumbs.length === 6"
            >
              {{ breadCrumb.replace('-', ' ') | capitalize }}
            </q-breadcrumbs-el>
          </template>
        </q-breadcrumbs>
      </div>
      <div class="col-xs-12 col-sm-2">
        <q-select
          outlined
          dense
          class="q-ma-sm"
          v-model="perPage"
          :options="['15', '20', '30', '40']"
          label="No. of products"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="col-2 col-lg-2 col-md-3 col-sm-4 col-xs-6"
        v-for="(product, k) in products.data"
        :key="k"
      >
        <div>
          <q-card
            class="my-card q-pa-sm"
            onmouseover="this.style.boxShadow='0 0 10px #888888'; this.style.cursor='pointer';"
            onmouseout="this.style.boxShadow=''; this.style.cursor='auto';"
            style="margin: 3px; height: 360px;"
            @click="productNav(product)"
          >
            <img
              :src="product.images[0].path_url"
              align="center"
            >
            <div
              class="text-subtitle1"
              align="center"
            >{{ product.name | truncate(15) }}</div>
            <div
              class="text-subtitle1 text-negative text-weight-medium"
              align="center"
            >{{ product.price | currency('₱') }}</div>
            <span class="text-grey-13">Before </span> <span
              style="text-decoration:line-through;"
              class="text-grey-13"
            > {{ product.price | currency('₱') }}</span>
            &nbsp;
            <span>-{{ product.discount}}%</span>
            <q-rating
              size="20px"
              v-model="stars"
              :max="5"
            />
          </q-card>
          <q-card
            class="my-card q-pa-sm"
            onmouseover="this.style.boxShadow='0 0 10px #888888'; this.style.cursor='pointer';"
            onmouseout="this.style.boxShadow=''; this.style.cursor='auto';"
            style="margin: 3px; height: 360px;"
            @click="productNav(product)"
          >
            <img
              :src="product.images[0].path_url"
              align="center"
            >
            <div
              class="text-subtitle1"
              align="center"
            >{{ product.name | truncate(15) }}</div>
            <div
              class="text-subtitle1 text-negative text-weight-medium"
              align="center"
            >{{ product.price | currency('₱') }}</div>
            <span class="text-grey-13">Before </span> <span
              style="text-decoration:line-through;"
              class="text-grey-13"
            > {{ product.price | currency('₱') }}</span>
            &nbsp;
            <span>-{{ product.discount}}%</span>
            <q-rating
              size="20px"
              v-model="stars"
              :max="5"
            />
          </q-card>

        </div>
      </div>
    </div>

    <q-page-scroller
      expand
      position="bottom-right"
      :scroll-offset="150"
      :offset="[10, 15]"
    >
      <q-btn
        icon="keyboard_arrow_up"
        round
        color="negative"
      ></q-btn>
    </q-page-scroller>
  </div>
</template>

<style>
</style>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'allProducts',
  data () {
    return {
      stars: 3,
      shadowCard: ''
    }
  },
  methods: {
    ...mapActions('users', ['setPerPage']),
    productNav (product) {
      this.$router.push({
        path: `/products/${product.category_slug_name}/${product.optimus_id}/${product.slug_name}`
      })
    }
  },
  computed: {
    ...mapState('products', ['products']),
    ...mapState('global', ['breadCrumbs']),
    perPage: {
      get () {
        return this.$store.getters['users/perPage']
      },
      set (val) {
        this.setPerPage(val)
      }
    }
  }
}
</script>
