export default {

  methods: {
    getProvinces () {
      this.$axios.get('/provinces').then(res => {
        this.setProvinces(res.data.provinces)
      })
    },
    getCities (provId) {
      this.$axios.get(`/cities/${provId}`).then(res => {
        this.setCities(res.data.cities)
      })
    },
    getBrgys (cityId) {
      this.$axios.get(`/brgys/${cityId}`).then(res => {
        this.setBrgys(res.data.brgys)
      })
    }
  }
}
