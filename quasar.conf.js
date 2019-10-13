// Configuration for your app
const env = require('quasar-dotenv').config()

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ['i18n', 'axios', 'vuelidate', 'vue2-filters', 'vue-google-maps'],

    css: ['app.styl'],

    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],

    // framework: 'all', // --- includes everything; for dev only!
    framework: {
      config: {
        cordova: {
          iosStatusBarPadding: true, // add the dynamic top padding on iOS mobile devices
          backButtonExit: true // Quasar handles app exit on mobile phone back button
        },
        loadingBar: {
          ref: 'bar',
          color: 'secondary',
          size: '5px',
          position: 'bottom'
        }
      },
      components: [
        'QRadio',
        'QUploader',
        'QEditor',
        'QResizeObserver',
        'QToggle',
        'QCheckbox',
        'QFooter',
        'QTabs',
        'QTab',
        'QBar',
        'QMenu',
        'QBtnGroup',
        'QChip',
        'QTree',
        'QAjaxBar',
        'QBanner',
        'QTooltip',
        'QSpace',
        'QSelect',
        'QStepperNavigation',
        'QStep',
        'QStepper',
        'QPopupEdit',
        'QImg',
        'QTr',
        'QTd',
        'QTable',
        'QBadge',
        'QSeparator',
        'QCarouselSlide',
        'QCarousel',
        'QBreadcrumbsEl',
        'QBreadcrumbs',
        'QCardActions',
        'QPageScroller',
        'QPagination',
        'QPageSticky',
        'QRating',
        'QDialog',
        'QInput',
        'QAvatar',
        'QBtnDropdown',
        'QCardSection',
        'QCard',
        'QExpansionItem',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel'
      ],

      directives: ['Ripple', 'ClosePopup'],

      // Quasar plugins
      plugins: ['Meta', 'Notify', 'LocalStorage', 'LoadingBar']

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: true,

    build: {
      env: env,
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true
          }
        })
      }
    },

    devServer: {
      // https: true,
      port: 8090,
      open: true // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  }
};
