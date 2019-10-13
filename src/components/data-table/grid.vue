<template>
<div>
    <q-table :grid="grid" :data="data" :columns="columns" selection="single" :selected.sync="selected" row-key="id" :pagination.sync="paginationControl" :filter="filterOpts" @request="$emit('serverside-request', $event)" :title="title" :loading="loading" >
        <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterOpts" :placeholder="searchPlaceholder" outlined class="q-ma-sm">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>

        </template>
        <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''">
                <q-card :class="props.selected ? 'bg-grey-2' : ''" @click.native="props.selected = !props.selected">
                    <q-card-section>
                      <div>
                        <span class="text-body1 text-italic ">{{ props.row.name }}</span>
                        <!-- <q-checkbox dense v-model="props.selected" :label="`${props.row.name}`" /> -->
                        <q-btn @click="$emit('del', props.row.optimus_id)" color="primary" flat class="float-right" style="margin-top: -9px;">
                            <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-primary" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                                Delete {{ entity }}
                            </q-tooltip>
                            <q-icon name="delete" />
                        </q-btn>
                        <q-btn @click="$emit('edit', props.row.optimus_id)" color="secondary" flat class="float-right" style="margin-top: -9px;">
                            <q-icon name="edit" />
                            <q-tooltip transition-show="flip-right" transition-hide="flip-left" content-class="bg-purple" content-style="font-size: 16px" anchor="top left" :offset="[30, 30]">
                                Edit {{ entity }}
                            </q-tooltip>
                        </q-btn>

                      </div>
                      <div  style="clear: both" />
                    </q-card-section>
                    <q-separator />
                    <q-list dense>
                        <q-item v-for="(col, k) in props.cols" :key="k">
                            <q-item-section>
                                <q-item-label overline>{{ col.name }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label caption>{{ col.value }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card>
            </div>
        </template>
    </q-table>

</div>
</template>

<script>
function truncate (text, max) {
  return text.substr(0, max - 1) + (text.length > max ? '...' : '')
}
export default {
  props: {
    entity: {
      type: [String],
      default: null
    },
    // the table data
    searchPlaceholder: {
      type: [String],
      default: null
    },
    grid: {
      Boolean,
      default: false
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
  methods: {
    allchildren (row) {
      var res = []
      const cb = (e) => {
        res.push(e.name)
        e.all_children && e.all_children.forEach(cb)
      }
      row.all_children.forEach(cb)
      return truncate(res.toString(), 30)
    }
  },
  watch: {
    'selected' (val) {
      this.$emit('selected', val)
    }
  }

}
</script>
