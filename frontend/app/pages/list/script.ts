import { defineComponent } from 'vue'
import application from '@/composables/application'

export default defineComponent({
  name: 'HardlineListPage',
  setup() {
    return {
      application,
      loading: ref(false),
      error: ref(''),
      users: computed(() => application.state.users || []),
    }
  },

  async mounted(this: any) {
    await this.load()
  },

  methods: {
    async load(this: any) {
      this.error = ''
      this.loading = true
      try {
        const users = await application.serverRequest('/users/list')
        application.state.users = users || []
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Failed to load users'
      } finally {
        this.loading = false
      }
    },

    onLogout(this: any) {
      application.store.token = ''
      application.route('login')
    },
  },
})
