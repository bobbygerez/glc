<template>
<div>
    <q-table :data="data" :columns="columns" selection="single" :selected.sync="selected" row-key="optimus_id" :pagination.sync="paginationControl" :filter="filterOpts" @request="$emit('serverside-request', $event)" :title="title" :loading="loading">
        <template v-slot:top-right>
            <slot></slot>
            <q-input borderless dense debounce="300" v-model="filterOpts" :placeholder="searchPlaceholder" outlined class="q-ma-sm">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <!-- <q-tr :props="props" :class="'cursor-pointer'" @click.native="props.selected = !props.selected"> -->
                <q-td auto-width>
                    <!-- <q-checkbox dense v-model="props.selected" v-if="restoreData"/> -->
                </q-td>

                <q-td :key="col.name" :props="props" v-for="col in props.cols">
                  {{ col.value }}

                </q-td>
                <q-td v-if="restoreData === false">
                  <span v-if="payments === false">
                    <q-btn @click="$emit('view-products', props.row.token)" color="positive" flat v-if="products">
                        <q-icon name="shopping_basket" />
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-positive" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            View Products
                        </q-tooltip>
                    </q-btn>
                    <q-btn @click="$emit('edit', props.row.optimus_id)" color="secondary" flat>
                        <q-icon name="edit" />
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-purple" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            Edit {{ entity }}
                        </q-tooltip>
                    </q-btn>
                    <q-btn @click="$emit('del', props.row.optimus_id)" color="primary" flat>
                       <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-primary" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            Delete {{ entity }}
                        </q-tooltip>
                        <q-icon name="delete" />
                    </q-btn>
                  </span>
                  <span v-if="viewPayment">
                    <q-btn @click="$emit('print', props.row.optimus_id)" color="secondary" flat>
                        <q-icon name="receipt" />
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-purple" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            Receipt {{ entity }}
                        </q-tooltip>
                    </q-btn>
                    <q-btn @click="$emit('info', props.row.optimus_id)" color="primary" flat>
                        <q-icon name="info" />
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-primary" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            Info {{ entity }}
                        </q-tooltip>
                    </q-btn>
                  </span>
                </q-td>
                <q-td v-if="restoreData">
                    <q-btn @click="$emit('restore', props.row.optimus_id)" color="primary" flat>
                        <q-icon name="restore" />
                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-primary" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                            Restore {{ entity }}
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </q-tr>
        </template>

    </q-table>

</div>
</template>

<script>
export default {
  props: {
    viewPayment: {
      type: [Boolean],
      default: false
    },
    payments: {
      type: [Boolean],
      default: false
    },
    products: {
      type: [Boolean],
      default: false
    },
    restoreData: {
      type: [Boolean],
      default: false
    },
    entity: {
      type: [String],
      default: null
    },
    // the table data
    searchPlaceholder: {
      type: [String],
      default: null
    },
    data: {
      type: [Array, Object],
      default: null
    },
    // column definition
    columns: {
      type: [Array, Object],
      default: null
    },
    search: {
      Boolean,
      default: true
    },
    grid: {
      Boolean,
      default: false
    },
    // current pagination settings of the table
    pagination: {
      type: Object,
      default: () => {
        return {
          rowsPerPage: 7,
          page: 1
        }
      }
    },
    rowOptions: {
      type: Array,
      default: () => [3, 5, 7, 10, 15, 25, 50, 0]
    },

    // the filter model of your table
    searchField: {
      type: String,
      default: () => ''
    },

    title: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    paginationControl: {
      set () {

      },
      get () {
        return this.pagination
      }
    },
    filterOpts: {
      set (val) {
        this.$emit('search-change', val)
      },
      get () {
        return this.searchField
      }
    }
  },
  watch: {
    'selected' (val) {
      this.$emit('selected', val)
    }
  }

}
</script>
