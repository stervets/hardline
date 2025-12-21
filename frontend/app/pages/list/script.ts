import { defineComponent } from 'vue'
import application from '@/composables/application'

type UserRow = { phone: string; name?: string }

export default defineComponent({
  name: 'HardlineListPage',
  setup() {
    return {
      application,
      loading: ref(false),
      error: ref(''),
      users: computed(() => application.state.users || []),
      selectedUser: ref<UserRow | null>(null),
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
      application.route('login');
    },

    onRowClick(this: any, row: UserRow) {
      // клик по той же строке — снять выбор
      if (this.selectedUser?.phone === row.phone) this.selectedUser = null
      else this.selectedUser = row
    },

    rowClassName(this: any, { row }: any) {
      return this.selectedUser?.phone === row.phone ? 'hl-row-selected' : ''
    },

    onCallSelected(this: any) {
      if (!this.selectedUser?.phone) return
      application.route(`call/${this.selectedUser.phone}`)
    },
  },
});