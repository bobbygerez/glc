<template>
  <div class="q-ma-lg">
    <div class="row">
      <div class="col-12">
        <GmapMap
          :center="markersPosition"
          :zoom="16"
          map-type-id="terrain"
          :style="this.report"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="infoWindow=true"
            @dragend="dragend($event.latLng)"
          />
          <gmap-info-window
            :options="infoOptions"
            :position="markersPosition"
            :opened="infoWindow"
            @closeclick="infoWindow=false"
          >

            <div>
              Please move the marker <br /> to the nearest street...
            </div>

          </gmap-info-window>

        </GmapMap>
        <q-resize-observer @resize="onResize" />
      </div>
      <div class="col-12">
        <br />
        <br />
        <p>
          <strong>Name: </strong> {{ payment.user.name }} <br />
          <strong>Mobile: </strong> {{ payment.user.mobile }} <br />
          <strong>Receiver's mobile: </strong> {{ payment.mobile }}
        </p>
        <q-table
          class="q-mt-md"
          title="Product information"
          :data="payment.payment_products"
          :columns="columns"
          row-key="id"
          hide-bottom
        >
          <template v-slot:top-right>
            <q-btn
              color="secondary"
              @click="setPosition(payment.lat, payment.lng)"
              flat
            >
              <q-icon name="location_on" />
            </q-btn>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- <q-tr :props="props" :class="'cursor-pointer'" @click.native="props.selected = !props.selected"> -->
              <!-- <q-checkbox dense v-model="props.selected" v-if="restoreData"/> -->

              <q-td
                :key="col.name"
                :props="props"
                v-for="col in props.cols"
              >
                {{ col.value }}

              </q-td>
              <q-td>
                <q-btn
                  color="primary"
                  flat
                  @click="setPosition(props.row.branch.address.latitude, props.row.branch.address.longitude)"
                >
                  <q-icon name="location_on" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

    </div>
  </div>
</template>

<script>

import {
  mapState,
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      paymentProducts: [],
      columns: [
        {
          name: 'store',
          label: 'Store',
          align: 'left',
          field: row => row.product.branch.name
        },
        {
          name: 'mobile',
          label: 'Mobile',
          align: 'left',
          field: row => row.product.branch.mobile
        }
        // {
        //   name: 'name',
        //   label: 'Name',
        //   align: 'left',
        //   field: row => row.name
        // },
        // {
        //   name: 'price',
        //   label: 'Price',
        //   align: 'left',
        //   field: row => row.pivot.price
        // },
        // {
        //   name: 'qty',
        //   label: 'Qty',
        //   align: 'left',
        //   field: row => row.pivot.quantity
        // },
        // {
        //   name: 'sku',
        //   label: 'SKU',
        //   align: 'left',
        //   field: row => row.sku
        // },
        // {
        //   name: 'barcode',
        //   label: 'Barcode',
        //   align: 'left',
        //   field: row => row.barcode
        // }
      ],
      report: 'width: 300px; height:400px;',
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -38
        }
      },
      infoWindow: true,
      markersPosition: {
        lat: 10.333333,
        lng: 123.933334
      },
      markers: [{
        position: {
          lat: 10.333333,
          lng: 123.933334
        }
      }],
      locProvinces: [],
      locCities: [],
      locBrgys: [],
      locDelCities: [],
      locDelBrgys: []
    }
  },

  computed: {
    ...mapState('payments', ['payment']),
    ...mapState('users', ['token', 'user', 'delivery']),
    ...mapState('global', ['cart', 'deliveryPrice'])
  },
  methods: {
    ...mapActions('global', ['setProvinces', 'setCities', 'setBrgys', 'setDelCities', 'setDelBrgys']),
    ...mapActions('users', ['setFullname', 'setMobile', 'setNotes', 'setProvinceId', 'setCityId', 'setBrgyId', 'setStreetLotBlk', 'setDelProvId', 'setDelCityId', 'setDelBrgyId', 'setDelStreetLotBlk']),
    ...mapActions('paymentOptions', ['setPaymentOptions']),

    setPosition (lat, lng) {
      this.markersPosition = {
        lat: lat,
        lng: lng
      }

      this.markers = [{
        position: {
          lat: lat,
          lng: lng
        }
      }]
    },
    cashOnDelivery () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check required fields.`
        })
      } else {
        this.$axios.post('payments', {
          mobile: this.mobile,
          lat: this.markersPosition.lat,
          lng: this.markersPosition.lng,
          payment_option_id: this.paymentOption.value,
          grand_total: this.totalCart,
          delivery_amount: this.deliveryPrice,
          products: this.cart
        })
      }
    },
    onResize (size) {
      this.report = `width:${size.width}px; height: ${size.height}px`
    },
    paymentCompleted (e) {
      console.log(e)
      this.$axios.post('payments', {
        payment_id: e.id,
        mobile: this.mobile,
        lat: this.markersPosition.lat,
        lng: this.markersPosition.lng,
        payment_option_id: this.paymentOption.value,
        grand_total: this.totalCart,
        delivery_amount: this.deliveryPrice,
        products: this.cart
      })
    },
    paymentCancelled (e) {
      console.log('cancelled')
    },
    dragend (latLng) {
      this.markersPosition = {
        lat: latLng.lat(),
        lng: latLng.lng()
      }
      console.log(this.markersPosition)
    },
    getPaymentOptions () {
      this.$axios.get('payment_options')
        .then(res => {
          this.setPaymentOptions(res.data.paymentOptions)
        })
    }
  },
  mounted () {
    this.paymentProducts = this.payment.products
    this.setPosition(this.payment.lat, this.payment.lng)
    if (this.token === '') {
      this.$router.push('/login')
    }
    this.getPaymentOptions()
  },
  watch: {

  }
}
</script>

<style>
.vue-map-container .gm-ui-hover-effect {
  display: none !important;
}
</style>
