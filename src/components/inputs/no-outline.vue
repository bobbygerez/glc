<template>
  <q-input
    type="text"
    :float-label="label"
    prefix="₱"
    v-model="displayValue"
    @blur="isInputActive = false"
    @focus="isInputActive = true"
    :disable="disabled"
    dense
    class="q-ma-sm"
    :label="label"
  />

</template>

<script>
export default {
  inheritAttrs: true,
  props: ['value', 'label', 'disabled'],
  data: () => ({
    isInputActive: false
  }),
  computed: {
    displayValue: {
      get: function () {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.value.toString()
        } else {
          // User is not modifying now. Format display value for user interface
          return this.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }
      },
      set: function (modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ''))
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0
        }
        // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
