<template>
  <div class="q-ma-sm">
    <form @submit.prevent="$emit('add')">
      <div class="row">
        <div class="col-12">
          <p class="text-h5 q-ma-sm">
            <q-icon
              name="add_circle"
              color="grey"
            />
            {{ locProduct.name }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6">
          <q-input
            outlined
            v-model="$v.locProduct.name.$model"
            label="Product Name"
            :error="$v.locProduct.name.$error"
            bottom-slots
            error-message="Name is required."
            dense
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6">
          <q-input
            outlined
            v-model="$v.locProduct.item_code.$model"
            label="Item Code"
            class="q-ml-sm"
            :error="$v.locProduct.item_code.$error"
            bottom-slots
            error-message="Item Code is required."
            dense
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-select
            outlined
            v-model="$v.locProduct.group_id.$model"
            :options="locGroups"
            label="Group"
            bottom-slots
            :error="$v.locProduct.group_id.$error"
            error-message="Group is required."
            use-chips
            dense
            multiple
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-select
            outlined
            v-model="$v.locProduct.category_id.$model"
            :options="mainCategories"
            label="Category"
            class="q-ml-sm"
            bottom-slots
            :error="$v.locProduct.category_id.$error"
            error-message="Category is required."
            dense
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-select
            outlined
            v-model="$v.locProduct.catalog_id.$model"
            :options="locCatalogs"
            label="Catalog"
            class="q-ml-sm"
            bottom-slots
            :error="$v.locProduct.catalog_id.$error"
            error-message="Catalog is required."
            dense
          />
        </div>

        <div class="col-12">
          <q-editor
            v-model="locProduct.desc"
            :dense="$q.screen.lt.md"
            :toolbar="[
                              [
                                {
                                  label: $q.lang.editor.align,
                                  icon: $q.iconSet.editor.align,
                                  fixedLabel: true,
                                  list: 'only-icons',
                                  options: ['left', 'center', 'right', 'justify']
                                },
                                {
                                  label: $q.lang.editor.align,
                                  icon: $q.iconSet.editor.align,
                                  fixedLabel: true,
                                  options: ['left', 'center', 'right', 'justify']
                                }
                              ],
                              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                              ['token', 'hr', 'custom_btn'],
                              ['print', 'fullscreen'],
                              [
                                {
                                  label: $q.lang.editor.formatting,
                                  icon: $q.iconSet.editor.formatting,
                                  list: 'no-icons',
                                  options: [
                                    'p',
                                    'h1',
                                    'h2',
                                    'h3',
                                    'h4',
                                    'h5',
                                    'h6',
                                    'code'
                                  ]
                                },
                                {
                                  label: $q.lang.editor.fontSize,
                                  icon: $q.iconSet.editor.fontSize,
                                  fixedLabel: true,
                                  fixedIcon: true,
                                  list: 'no-icons',
                                  options: [
                                    'size-1',
                                    'size-2',
                                    'size-3',
                                    'size-4',
                                    'size-5',
                                    'size-6',
                                    'size-7'
                                  ]
                                },
                                {
                                  label: $q.lang.editor.defaultFont,
                                  icon: $q.iconSet.editor.font,
                                  fixedIcon: true,
                                  list: 'no-icons',
                                  options: [
                                    'default_font',
                                    'arial',
                                    'arial_black',
                                    'comic_sans',
                                    'courier_new',
                                    'impact',
                                    'lucida_grande',
                                    'times_new_roman',
                                    'verdana'
                                  ]
                                },
                                'removeFormat'
                              ],
                              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                              ['undo', 'redo']
                            ]"
            :fonts="{
                              arial: 'Arial',
                              arial_black: 'Arial Black',
                              comic_sans: 'Comic Sans MS',
                              courier_new: 'Courier New',
                              impact: 'Impact',
                              lucida_grande: 'Lucida Grande',
                              times_new_roman: 'Times New Roman',
                              verdana: 'Verdana'
                            }"
          />

        </div>
        <div class="col-12">
          <br />
          <q-uploader
            accept="image/jpeg, image/png"
            label="Upload Product Images"
            multiple
            @added="added"
            hide-upload-btn
            ref="uploader"
            @removed="removed"
            style="width: 450px;"
          >
            <template v-slot:list="scope">
              <q-list separator>
                <q-item
                  v-for="file in scope.files"
                  :key="file.name"
                >
                  <q-item-section>
                    <q-item-label class="full-width ellipsis">
                      {{ file.name }}
                    </q-item-label>

                    <q-item-label caption>
                      Status: {{ file.__status }}
                    </q-item-label>

                    <q-item-label caption>
                      {{ file.__sizeLabel }}
                      <!-- / {{ file.__progressLabel }} -->
                    </q-item-label>
                  </q-item-section>

                  <q-item-section
                    v-if="file.__img"
                    thumbnail
                  >
                    <img :src="file.__img.src">
                  </q-item-section>

                  <q-item-section
                    top
                    side
                  >
                    <q-radio
                      v-model="is_primary"
                      :val="file.name"
                      style="margin-top: 5px;"
                    />
                  </q-item-section>
                  <q-item-section
                    top
                    side
                  >
                    <q-btn
                      class="q-mt-sm"
                      color="negative"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="scope.removeFile(file)"
                    />
                  </q-item-section>
                </q-item>

              </q-list>
            </template>
          </q-uploader>
        </div>

      </div>
    </form>
    <slot></slot>
  </div>
</template>

<script>

import {
  required
} from 'vuelidate/lib/validators'
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  props: ['product'],
  validations: {
    locProduct: {
      group_id: {
        required
      },
      category_id: {
        required
      },
      catalog_id: {
        required
      },
      name: {
        required
      },
      item_code: {
        required
      }
    }
  },
  data () {
    return {
      is_primary: null,
      selectedFile: [],
      locCatalogs: [],
      locGroups: [],
      check_if_document_upload: false,
      qeditor: 'Here we can customize your <b>description</b>...',
      locProduct: this.product,
      selectedStore: null,
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        autoProcessQueue: false,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        maxFilesize: 5,
        headers: {
          'My-Awesome-Header': 'header value'
        },
        dictDefaultMessage: 'Upload product images',
        uploadMultiple: true
      }
    }
  },
  computed: {
    ...mapState('products', ['groups', 'catalogs']),
    mainCategories () {
      return this.$store.getters['products/mainCategories'].map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    },
    subCategories () {
      return this.$store.getters['products/subCategories'].map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    },
    moreCategories () {
      return this.$store.getters['products/moreCategories'].map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    }
  },
  methods: {
    ...mapActions('products', [
      'setMainCategories',
      'setSubCategories',
      'setMoreCategories',
      'setProductSubCategory',
      'setProductMoreCategory',
      'setGroups',
      'setCatalogs'
    ]),
    ...mapActions('branches', ['setBranches']),

    added (files) {
      for (var i = 0; i <= files.length; i++) {
        this.selectedFile.push(files[i])
      }
    },
    removed (files) {
      let x = this.selectedFile.filter(function (v) {
        if (v !== undefined) {
          return v.name !== files[0].name
        }
      })
      this.selectedFile = x
    },
    uploadFile () {
      const fd = new FormData()
      for (var i = 0; i < this.selectedFile.length; i++) {
        fd.append('files[]', this.selectedFile[i])
      }
      this.$axios.post('/dashboard_products', fd)
    },
    isNumber: function (evt) {
      evt = (evt) || window.event
      var charCode = (evt.which) ? evt.which : evt.keyCode
      // In order to not allow the period change charCode !== 46 to charCode === 46
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode === 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    add () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios
          .post('dashboard_products', this.data())
          .then(res => {
            this.$v.$reset()
            this.locProduct = {
              item_code: '',
              category_id: null,
              catalog_id: null,
              group_id: [],
              product_id: null,
              name: '',
              desc: ''
            }
            this.$refs.uploader.files = []
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `${this.product.name} created successfully.`
            })
          })
      }
    },
    update () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          message: `Please check the fields.`
        })
      } else {
        this.$axios
          .post(`dashboard-products-update/${this.locProduct.optimus_id}?id=${this.locProduct.optimus_id}`, this.data())
          .then(res => {
            this.$v.$reset()
            this.$q.notify({
              color: 'positive',
              icon: 'check',
              message: `${this.locProduct.name} created successfully.`
            })
          })
      }
    },
    cancel () {
      this.$router.go(-1)
    },
    data () {
      const fd = new FormData()
      for (var i = 0; i <= this.selectedFile.length; i++) {
        if (this.selectedFile[i] !== undefined) {
          if (this.selectedFile[i].__img.complete) {
            fd.append('files[]', this.selectedFile[i])
          } else {
            fd.append('ids[]', this.selectedFile[i].id)
          }
        }
      }
      var groupIds = this.locProduct.group_id.map(function (v) {
        return v.id
      })
      console.log(groupIds)
      fd.append('is_primary', this.is_primary)
      fd.append('optimus_id', this.locProduct.optimus_id)
      fd.append('group_ids', groupIds)
      fd.append('category_id', this.locProduct.category_id.value)
      fd.append('catalog_id', this.locProduct.catalog_id.value)
      fd.append('name', this.locProduct.name)
      fd.append('item_code', this.locProduct.item_code)
      fd.append('desc', this.locProduct.desc)

      return fd
    },
    getGroups () {
      this.$axios.get('product_groups')
        .then(res => {
          this.locGroups = res.data.groups
          this.setGroups(res.data.groups)
        })
    },
    getCatalogs () {
      this.$axios.get('product_catalogs')
        .then(res => {
          this.locCatalogs = res.data.catalogs
          this.setCatalogs(res.data.catalogs)
        })
    }
  },
  mounted () {
    this.getGroups()
    this.getCatalogs()
    if (this.locProduct.images != null) {
      for (var i = 0; i < this.locProduct.images.length; i++) {
        let fileName = this.locProduct.images[i].name
        let url = this.locProduct.images[i].path_url

        if (this.locProduct.images[i].is_primary === 1) {
          this.is_primary = fileName
        }
        let file = {
          id: this.locProduct.images[i].id,
          size: 123,
          type: fileName.split('.').pop(),
          name: fileName,
          __img: {
            src: url
          }
        }
        this.$refs.uploader.files.push(file)
        this.selectedFile.push(file)
      }
    }
  },
  watch: {
    locProduct: {
      handler (oldVal) {
        this.$emit('change', oldVal)
      },
      deep: true
    },
    'locProduct.main_category_id' (val) {
      if (val === null) {
        return
      }
      this.$axios.get(`get-sub-categories?id=${val.value}`).then(res => {
        this.setProductSubCategory(null)
        this.setProductMoreCategory(null)
        this.setSubCategories(res.data.subCategories)
        this.setMoreCategories([])
      })
    },
    'locProduct.sub_category_id' (val) {
      if (val === null) {
        return
      }
      this.$axios.get(`get-more-categories?id=${val.value}`).then(res => {
        this.setProductMoreCategory(null)
        this.setMoreCategories(res.data.moreCategories)
      })
    },
    'is_primary' (val) {
      console.log(val)
    }
  }
}
</script>

<style>
.dropzone .dz-preview .dz-progress {
  opacity: 0;
}
</style>
