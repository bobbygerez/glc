<template>
  <div>
    <transition
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
      appear
    >
      <q-alert
        v-if="hasErrors"
        type="negative"
      >
        <div
          v-for="(error, index) in errors"
          :key="index"
        >
          {{ error }}
        </div>
      </q-alert>
    </transition>
  </div>
</template>
<script>
import BaseValidationMixin from 'components/form-validations/BaseValidationMixin'
const removeDupe = (names) => names.filter((v, i) => names.indexOf(v) === i)
export default {
  name: 'FormValidationSummary',
  mixins: [BaseValidationMixin],
  props: {
    validations: Object
  },
  data () {
    return {
      errors: []
    }
  },
  computed: {
    hasErrors () {
      return this.testForErrors().length > 0
    }
  },
  methods: {
    testForErrors () {
      let arr = []
      arr = removeDupe(this.getAllErrors(this.validations, arr))
      this.errors = arr
      return arr
    },
    getAllErrors (obj, arr) {
      if (typeof obj !== 'object' && obj !== null) {
        return arr
      }
      let keys = Object.keys(obj.$params)
      if (obj.$params[keys[0]] !== null) {
        if (obj.$error) {
          arr.push(this.getErrMessage(obj))
        }
        return
      }
      keys.forEach(v => {
        this.getAllErrors(obj[v], arr)
      })
      return arr
    }
  }
}
</script>
