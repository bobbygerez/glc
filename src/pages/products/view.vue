<template>
  <q-page class="docs-input row ">
    <div class="col-12">
      <q-btn
        flat
        icon="fas fa-angle-double-left"
        color="primary"
        class="q-ma-sm"
        @click="$router.go(-1)"
      >
        <q-tooltip
          transition-show="flip-right"
          transition-hide="flip-left"
          content-class="bg-primary"
          content-style="font-size: 16px"
          anchor="top left"
          :offset="[15, 15]"
        >
          Back
        </q-tooltip>
      </q-btn>
    </div>
    <div class="col-sm-5 col-xs-12">
      <div class="q-pa-md">
        <q-carousel
          swipeable
          animated
          v-model="slide"
          thumbnails
          infinite
        >
          <q-carousel-slide
            :name="k+1"
            :img-src="image.path_url"
            v-for="(image, k) in product.images"
            :key="k"
          />
        </q-carousel>
      </div>

    </div>
    <div class="col-sm-7 col-xs-12">
      <div class="q-pa-sm">
        <p class="text-h5 q-mt-md">{{ product.name }}</p>
        <q-rating
          size="20px"
          v-model="stars"
          :max="5"
          class="q-ma-sm"
          readonly
        /> 17 ratings
        <q-separator />
        <div class="q-ma-sm">
          <span class="text-h4 text-negative q-mt-md">{{ product.discounted_price | currency('₱') }}</span>&nbsp;
          <span class="text-grey-13">Before </span>
          <span
            style="text-decoration:line-through;"
            class="text-grey-13"
          > {{ product.price | currency('₱') }}</span>
          &nbsp;<span>-{{ product.discount}}%</span>
        </div>

        <div
          style="max-width: 120px; float: left;"
          class="q-mt-md"
        >
          <q-input
            bottom-slots
            v-model="qty"
            counter
            maxlength="2"
            dense
            outlined
          >
            <template v-slot:prepend>
              <q-btn
                round
                dense
                flat
                icon="remove"
                @click="subQty"
              />
            </template>

            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addQty"
              />
            </template>
          </q-input>
        </div>
        <br />
        <q-btn
          icon="fas fa-cart-plus"
          color="primary"
          label="Add"
          class="q-ma-sm"
          @click="addCart"
          style="float: right;"
        />
        <q-btn
          color="secondary"
          label="Cancel"
          class="q-ma-sm"
          @click="cancel"
          style="float: right;"
        />
      </div>
    </div>
    <div class="col-12">
      <q-separator />
      <br />
      <br />
      <div
        class="q-ma-sm"
        v-html="product.desc"
      >
      </div>
    </div>
  </q-page>
</template>

<script>

import {
  mapState,
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      slide: 1,
      stars: 3,
      dense: false
    }
  },
  computed: {
    ...mapState('products', ['product']),
    qty: {
      get () {
        let qty = this.$store.getters['global/qty']
        if (isNaN(qty)) {
          return 1
        } else {
          return qty
        }
      },
      set (val) {
        if (isNaN(val) || val === '') {
          this.setQty(1)
        } else {
          this.setQty(val)
        }
      }
    }
  },
  methods: {
    ...mapActions('products', ['setProduct']),
    ...mapActions('global', ['setQty', 'setCart']),
    getProduct () {
      this.$axios.get(`/products/${this.$route.params.id}`)
        .then(res => {
          this.setProduct(res.data.product)
        })
    },
    addQty () {
      if (this.qty < 0) {
        this.qty = 1
      } else {
        this.qty += 1
      }
    },
    subQty () {
      if (this.qty < 1) {
        this.qty = 1
      } else {
        this.qty -= 1
      }
    },
    addCart () {
      this.setCart({
        product: this.product,
        qty: this.qty
      })
      this.$q.notify({
        message: `${this.qty} ${this.product.name} added in your cart.`,
        color: 'positive',
        icon: 'check'
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
