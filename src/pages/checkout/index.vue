<template>
<div class="q-ma-lg">
  <div class="row">
    <div class="col-12">
        <GmapMap :center="markersPosition" :zoom="14" map-type-id="terrain" :style="this.report">
            <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="infoWindow=true" @dragend="dragend($event.latLng)" />
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
    <div class="col-6">
        <q-input outlined dense label="Receiver's Mobile #" v-model="$v.mobile.$model" error-message="Mobile must be 11 digits." :error="$v.mobile.$error" class="q-ma-sm"> </q-input>
    </div>
    <div class="col-6">
      <div>
        <q-select outlined dense label="Payment Options" v-model="paymentOption" :options="paymentOptions" class="q-ma-sm"> </q-select>
      </div>
    </div>
    <div class="col-12 " v-if="paymentOption.label === 'Cash On Delivery'">
        <q-btn color="secondary" @click="cashOnDelivery()"> Pay Cash On Delivery {{ totalCart | currency('₱') }} </q-btn>
    </div>

    <div class="col-12" v-if="paymentOption.label === 'Credit Card/Paypal'">
        <paypal :amount="totalCart" currency="PHP" :client="credentials" :button-style="buttonStyle" env="sandbox" @payment-completed="paymentCompleted($event)" @payment-cancelled="paymentCancelled($event)">
        </paypal>
    </div>
    <div class="col-12 " v-if="paymentOption.label === 'Pera Padala'">
        <q-btn color="secondary" @click="cashOnDelivery()"> Pay Pera Padala {{totalCart | currency('₱') }} </q-btn>
    </div>
  </div>
</div>
</template>

<script>
import paypal from 'vue-paypal-checkout'
import {
  integer,
  required,
  minLength
} from 'vuelidate/lib/validators'
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  validations: {
    mobile: {
      required,
      integer,
      minLength: minLength(11)
    }
  },
  data () {
    return {
      delivery_amount: 0,
      mobile: '',
      paymentOption: {
        value: null
      },
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
      step: 1,
      buttonStyle: {
        label: 'checkout',
        locale: 'fr_FR',
        size: 'large',
        shape: 'rect',
        color: 'gold',
        fundingicons: 'true'
      },
      credentials: {
        sandbox: process.env.API_PAYPAL_SANDBOX,
        production: process.env.API_PAYPAL_PRODUCTION
      },
      locProvinces: [],
      locCities: [],
      locBrgys: [],
      locDelCities: [],
      locDelBrgys: []
    }
  },
  components: {
    paypal
  },
  computed: {
    ...mapState('users', ['token', 'user', 'delivery']),
    ...mapState('global', ['cart', 'deliveryPrice']),
    totalCart () {
      return String(this.$store.getters['global/totalCart'])
    },
    paymentOptions () {
      return this.$store.getters['paymentOptions/paymentOptions'].map(e => {
        return {
          label: e.name,
          value: e.optimus_id
        }
      })
    }
  },
  methods: {
    ...mapActions('global', ['setProvinces', 'setCities', 'setBrgys', 'setDelCities', 'setDelBrgys', 'setCart', 'setDefaultCart']),
    ...mapActions('users', ['setFullname', 'setMobile', 'setNotes', 'setProvinceId', 'setCityId', 'setBrgyId', 'setStreetLotBlk', 'setDelProvId', 'setDelCityId', 'setDelBrgyId', 'setDelStreetLotBlk']),
    ...mapActions('paymentOptions', ['setPaymentOptions']),
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },
    showPosition (position) {
      this.markersPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      this.markers = [{
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
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
        }).then(res => {
          this.donePayment()
          this.$q.notify({
            color: 'positive',
            icon: 'check',
            message: `Payment partially completed. We will contact you for further processing.`
          })
        })
      }
    },
    onResize (size) {
      this.report = `width:${size.width}px; height: ${size.height}px`
    },
    paymentCompleted (e) {
      this.$axios.post('payments', {
        payment_id: e.id,
        mobile: this.mobile,
        lat: this.markersPosition.lat,
        lng: this.markersPosition.lng,
        payment_option_id: this.paymentOption.value,
        grand_total: this.totalCart,
        delivery_amount: this.deliveryPrice,
        products: this.cart
      }).then(res => {
        this.donePayment()
        this.$q.notify({
          color: 'positive',
          icon: 'check',
          message: `Payment successfully completed.`
        })
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
    },
    donePayment () {
      this.setDefaultCart([])
      this.mobile = ''
      this.paymentOption = {
        label: '',
        value: null
      }
      this.$v.$reset()
    }
  },
  mounted () {
    console.log(process.env)
    this.getLocation()
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
