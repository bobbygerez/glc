export default {

  methods: {
    catch (err) {
      this.$q.loadingBar.stop()
      this.loading = false
      if (err.response.status === 403) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `${err.response.data.message}`
        })
      } else if (err.response.status === 422) {
        if (err.response.data.errors.name !== undefined) {
          let name = err.response.data.errors.name.map(function (val) {
            return val
          })
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `${name}`
          })
        } else {
          this.$q.notify({
            color: 'negative',
            icon: 'warning',
            message: `${err.response.data.message}`
          })
        }
      } else {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Integrity constraint....`
        })
      }
    }
  }
}
