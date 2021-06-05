const routes = [
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'datacenter/node/:nodeId/lxc/:vmId(\\d+)',
        component: () => import('layouts/subLayouts/lxc.vue'),
        children: [
          { path: '', component: () => import('pages/datacenter/node/[nodeId]/lxc/[lxc]/index.vue') }
        ]
      }
    ]
  },




  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
