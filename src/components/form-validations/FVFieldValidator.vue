<template>
  <q-field
    :error="hasErrors"
    :error-label="errMessage"
    v-bind="$attrs"
  >
    <slot />
  </q-field>
</template>
<script>
import BaseValidationMixin from 'components/form-validations/BaseValidationMixin'
export default {
  name: 'FVFieldValidator',
  props: {
    validate: Object
  },
  mixins: [BaseValidationMixin],
  inheritAttrs: false,
  computed: {
    hasErrors () {
      return this.validate.$error
    },
    errMessage () {
      return this.getErrMessage(this.validate)
    }
  }
}
</script>
