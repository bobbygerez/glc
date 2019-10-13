<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-12">
        <p class="q-ma-md">Products will be sent to your email address within 24 hours</p>
        <q-table
          :data="cart"
          :columns="columns"
          row-key="id"
          class="no-shadow"
          :pagination.sync="pagination"
          hide-bottom
        >
          <template slot="body" slot-scope="props">
            <q-tr :props="props">
              <q-td key="image">
                <q-img
                  :src="props.row.product.images[0].path_url"
                  style="width: 100px; height: 100px;"
                />
              </q-td>
              <q-td key="name">{{props.row.product.name }}</q-td>
              <q-td key="price">{{props.row.product.price | currency('₱') }}</q-td>
              <q-td key="qty" align="center">{{props.row.qty }}</q-td>
              <q-td
                key="total"
                align="right"
              >{{props.row.qty * props.row.product.price | currency('₱') }}</q-td>
              <q-td key="action" align="right">
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="deleteRow(props.row.__index)"
                />
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom-row>
            <q-tr>
              <q-td colspan="4">
                <div class="float-right">
                  Delivery Charge:
                </div>
              </q-td>
              <q-td align="right">
                {{ deliveryPrice| currency('₱') }}
              </q-td>
              <q-td></q-td>
            </q-tr>
            <q-tr>
              <q-td colspan="4">
                <div class="text-subtitle2 float-right">
                  <q-btn
                    color="secondary"
                    label="Proceed to checkout"
                    class="q-mr-xl"
                    to="/checkout"
                  />GrandTotal:
                </div>
              </q-td>
              <q-td align="right">
                <div class="text-subtitle2">{{ totalCart | currency('₱') }}</div>
              </q-td>
              <q-td></q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      actions: ['edit', 'delete'],
      pagination: {
        rowsPerPage: 100,
        page: 1
      },
      selected: [],
      columns: [
        {
          name: 'image',
          required: true,
          label: 'Image',
          align: 'left'
        },
        {
          name: 'name',
          required: true,
          label: 'Produt Name',
          align: 'left'
        },
        {
          name: 'price',
          align: 'left',
          label: 'Price'
        },
        {
          name: 'qty',
          align: 'center',
          label: 'Qty'
        },
        {
          name: 'total',
          align: 'right',
          label: 'Subtotal'
        },
        {
          name: 'action',
          align: 'right',
          label: 'Action'
        }
      ]
    }
  },
  computed: {
    ...mapState('global', ['cart', 'totalCart', 'deliveryPrice']),
    ...mapState('users', ['token'])
  },
  methods: {
    ...mapActions('global', ['setTotalCart', 'deleteCartRow', 'setDeliveryPrice']),
    deleteRow (index) {
      this.deleteCartRow(index)
      this.setTotalCart()
    },
    getDeliveryPrice () {
      this.$axios.get('delivery_price').then(res => {
        this.setDeliveryPrice(res.data.deliveryPrice.amount)
        this.setTotalCart()
      })
    }
  },
  mounted () {
    this.getDeliveryPrice()
  }
}
</script>
