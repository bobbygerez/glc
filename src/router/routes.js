const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }]
  },
  {
    path: '/register',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/register.vue') }]
  },
  {
    path: '/register/activation_code/:token',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/login.vue') }]
  },
  {
    path: '/password/reset/:token',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/new-password.vue') }]
  },
  {
    path: '/catalog',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/catalog/index.vue') }]
  },
  {
    path: '/catalog/:catId/:category',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/category/products.vue') }
    ]
  },
  {
    path: '/catalog/:catId/:category/:subCatId/:subCatName',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/category/subcategory/products.vue')
      }
    ]
  },
  {
    path:
      '/catalog/:catId/:category/:subCatId/:subCatName/:furtherCatId/:furtherCat',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('pages/category/subcategory/furthercategory/products.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/login.vue') }]
  },
  {
    path: '/password/reset',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/password-reset.vue') }
    ]
  },
  {
    path: '/products/:category/:id/:product',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/products/view.vue') }]
  },
  {
    path: '/cart',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/cart/view.vue') }]
  },
  {
    path: '/checkout',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/checkout/index.vue') }
    ]
  },
  {
    path: '/dashboard',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/index.vue') }
    ]
  },
  {
    path: '/dashboard/profile/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/profile.vue') }
    ]
  },
  {
    path: '/dashboard/users',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/users/index.vue') }
    ]
  },
  {
    path: '/dashboard/user/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/users/edit.vue') }
    ]
  },
  {
    path: '/dashboard/user/:id/change-password',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/users/password.vue')
      }
    ]
  },
  {
    path: '/dashboard/roles',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/roles/index.vue') }
    ]
  },
  {
    path: '/dashboard/role/create',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/roles/add.vue') }
    ]
  },
  {
    path: '/dashboard/roles/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/roles/edit.vue') }
    ]
  },
  {
    path: '/dashboard/categories',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/categories/index.vue')
      }
    ]
  },
  {
    path: '/dashboard/categories/create',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/categories/add.vue')
      }
    ]
  },
  {
    path: '/dashboard/categories/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/categories/edit.vue')
      }
    ]
  },
  {
    path: '/dashboard/stores',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/branches/index.vue')
      }
    ]
  },
  {
    path: '/dashboard/products',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/products/index.vue')
      }
    ]
  },
  {
    path: '/dashboard/products/create',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/products/add.vue') }
    ]
  },
  {
    path: '/dashboard/products/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/products/edit.vue') }
    ]
  },
  {
    path: '/dashboard/groups',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/groups/index.vue')
      }
    ]
  },
  {
    path: '/dashboard/groups/create',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/groups/add.vue')
      }
    ]
  },
  {
    path: '/dashboard/groups/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/groups/edit.vue')
      }
    ]
  },
  {
    path: '/dashboard/catalogs',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/catalogs/index.vue')
      }
    ]
  },
  {
    path: '/dashboard/catalogs/create',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/catalogs/add.vue')
      }
    ]
  },
  {
    path: '/dashboard/catalogs/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/catalogs/edit.vue')
      }
    ]
  },
  {
    path: '/dashboard/group-products/:id',
    meta: {
      needAuth: true
    },
    component: () => import('layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/group-products/index.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
