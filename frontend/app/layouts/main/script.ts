import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    //const route = useRoute()
    //const { store } = useApplication()
    //const { logout } = useAuth()

    //const isLogin = computed(() => route.path === '/login')
    //const serverLabel = computed(() => store.server || 'not set')

    const onChangeServer = () => {
      // const native = (window as any).HardlineNative
      // if (native?.openServerDialog) native.openServerDialog()
      // else console.log('[Hardline] native server dialog not available')
    }

    return {
      // isLogin,
      // serverLabel,
      // onChangeServer,
      // logout,
    };
  },
})
