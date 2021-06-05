import { boot } from 'quasar/wrappers'

export default boot(({ store, router }) => {
  router.beforeEach((to, from) => {
    if (to.path !== '/login' && !store.state.credentials.ticket)
      return "/login"
  })
})
