<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-6">
        <q-select
          outlined
          v-model="selCategory"
          :options="locCategories"
          label="Category"
          bottom-slots
          dense
        />
      </div>
      <div class="col-xs-6">
        <q-select
          outlined
          v-model="selCatalog"
          :options="locCatalogs"
          label="Catalogs"
          bottom-slots
          dense
          class="q-ml-sm"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="col-sm-4 col-md-3 col-xs-6"
        v-for="(product, k) in products"
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
            <template v-for="(img, k) in product.images">
              <img
                :key="k"
                :src="img.path_url"
                align="center"
                v-if="img.is_primary === 1"
              >
            </template>

            <div
              class="text-subtitle1"
              align="center"
            >{{ product.name | truncate(15) }}</div>
          </q-card>
          <!-- <q-card
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
        </q-card> -->

        </div>
      </div>

    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      selCatalog: '',
      locCatalogs: [],
      selCategory: '',
      locCategories: [],
      products: [],
      serverPagination: {
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10 // specifying this determines pagination is server-side
      },
      filter: ''
    }
  },
  methods: {
    getCategories () {
      this.$axios.get('group_categories')
        .then(res => {
          this.locCategories = res.data.categories
        })
    },
    getCatalogs () {
      this.$axios.get('group_catalogs')
        .then(res => {
          this.locCatalogs = res.data.catalogs
        })
    },
    request (props) {
      let categoryId = ''
      let catalogId = ''
      if (this.selCategory !== '') {
        categoryId = this.selCategory.value
      }
      if (this.selCatalog !== '') {
        catalogId = this.selCatalog.value
      }
      this.$axios.get(`group_products/${this.$route.params.id}?catalogId=${catalogId}&categoryId=${categoryId}&groupId=${this.$route.params.id}&page=${props.pagination.page}&perPage=${props.pagination.rowsPerPage}&filter=${this.filter}`)
        .then(res => {
          this.products = res.data.products.data
        })
    }
  },
  mounted () {
    this.getCategories()
    this.getCatalogs()
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  },
  watch: {
    '$route': function (val) {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    },
    selCatalog (val) {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    },
    selCategory (val) {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    }
  }
}
</script>
