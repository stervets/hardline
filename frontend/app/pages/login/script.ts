import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HardlineLoginPage',
  setup() {
    return {
      formRef: null as any,
      form: ref({
        phone: '',
        password: ''
      }),

      loading: ref(false),
      error: ref(''),

      rules: {
        phone: [
          { required: true, message: 'Введи номер', trigger: 'blur' },
          {
            validator: (_: any, v: string, cb: any) => {
              const n = Number(v)
              if (!Number.isInteger(n) || n < 99000 || n > 99999) cb(new Error('Номер должен быть 99000–99999'))
              else cb()
            },
            trigger: 'blur',
          },
        ],
        password: [{ required: true, message: 'Введи пароль', trigger: 'blur' }],
      } as any,
    }
  },

  async mounted(this: any) {

  },

  methods: {
    async onChangeServer(this: any) {
      try {
        const native = (window as any).HardlineNative
        if (native?.openServerDialog) native.openServerDialog()
        else this.error = 'Нативный диалог сервера недоступен'
      } catch (e: any) {
        this.error = e?.message || 'Ошибка'
      }
    },

    async onSubmit(this: any) {
      this.error = ''
      const ok = await this.formRef?.validate?.().catch(() => false)
      if (!ok) return

      this.loading = true
      try {
        const phone = Number(this.form.phone)
        const password = this.form.password

        // TODO: подключишь свой api client / $fetch
        const res = await $fetch('/auth/login', {
          method: 'POST',
          body: { phone, password },
        }) as any

        const token = res?.accessToken
        if (!token) throw new Error('Сервер не вернул токен')

        localStorage.setItem('hardline.jwt', token)

        // TODO: редирект туда, где UI звонков
        window.location.href = '/'
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Ошибка логина'
      } finally {
        this.loading = false
      }
    },
  },
})
