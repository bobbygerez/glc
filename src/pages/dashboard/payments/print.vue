<template>
<q-page>
    <div class="q-pa-sm">
        <div class="row col-12">
            <div class="col-12">
                <q-card inline class="full-width">
                    <q-card-section>
                        <div id="myelement">
                            <center>
                                <p><span style="font-size: 14px;">{{ title }} </span><br />
                                    <span style="font-size: 10px;display:block "> {{ address1 }} </span>
                                    <span style="font-size: 10px;display:block "> {{ address2 }} </span>
                                    <span style="font-size: 10px;display:block "> {{ address3 }} </span>
                                </p>

                            </center>
                                <p style="font-size: 14px;">Name:<span style="font-size: 12px;"> {{ payment.user.name }}</span><br />Address:<span style="font-size: 12px;">{{payment.user.address.city.description }} , {{payment.user.address.brgy.description }} </span><br />Mobile:<span style="font-size: 12px;"> {{payment.user.mobile }} </span>
                                </p>
                                <p style="font-size: 14px;">Payment Method: <span style="font-size: 12px;">{{ payment.payment_option.name }} </span></p>
                            <br />
                            <table style="border-collapse: collapse;" id="products">
                                <tr align="left">
                                    <th style="padding: 5px;">Name</th>
                                    <th style="padding: 5px;">Price</th>
                                    <th style="padding: 5px;">Qty</th>
                                    <th style="padding: 5px;">Total</th>
                                </tr>
                                <tr v-for="(p,i) in payment.products" :key="i">
                                    <td style="padding: 5px;">{{ p.name }}</td>
                                    <td style="padding: 5px;">{{ p.pivot.price }}</td>
                                    <td style="padding: 5px;">{{ p.pivot.quantity }}</td>
                                    <td style="padding: 5px;">{{ parseFloat(p.pivot.quantity) * parseFloat(p.pivot.price) | currency('₱')}} </td>
                                </tr>
                                 <tr align="left">
                                    <td colspan="3" style="padding: 5px;">Delivery
                                    </td>
                                    <td align="left" style="padding: 5px;">
                                        {{ payment.delivery_amount | currency('₱') }}
                                    </td>
                                </tr>
                                <tr align="right">
                                    <td colspan="3" style="padding: 5px;">
                                        <strong>GrandTotal:</strong>
                                    </td>
                                    <td align="left" style="padding: 5px;">
                                        {{ payment.grand_total | currency('₱') }}
                                    </td>
                                </tr>

                            </table>

                        </div>
                    </q-card-section>

                </q-card>
            </div>
            <q-btn color="primary" @click="print" icon="print" label="Print" class="q-mt-sm" />
        </div>
    </div>
</q-page>
</template>

<script>
import {
  mapState
} from 'vuex'
import {
  Printd
} from 'printd'
const cssText = `
  table {
    font-size: 12px;
  },
  td{
    padding: 5px;
  }
`
export default {
  data () {
    return {
      title: process.env.APP_TITLE,
      address1: process.env.APP_ADDRESS1,
      address2: process.env.APP_ADDRESS2,
      address3: process.env.APP_ADDRESS3
    }
  },
  computed: {
    ...mapState('payments', ['payment'])
  },
  methods: {
    print () {
      const d = new Printd()
      d.print(document.getElementById('myelement'), [cssText])
    }

  },
  mounted () {
    console.log(this.payment)
  }
}
</script>

<style>
table {
    width: 100%;
}
</style>
