import {
  QField
} from 'quasar'
/**
 * Javascript Implementation of the FVFieldValidator component
 * It is specificaly for quasar
 * @author Aldrin Marquez
 * @note if used as a plugin then you need to export this as Vue.extend()
 */
import BaseValidationMixin from 'components/form-validations/BaseValidationMixin'
export default {
  name: 'FormFieldValidator',
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
  },
  render (h) {
    return h(QField, {
      props: {
        error: this.hasErrors,
        errorLabel: this.errMessage
      },
      attrs: this.$attrs
    },
    this.$slots.default)
  }
}
