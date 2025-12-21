import {defineComponent} from 'vue'
import application from "@/composables/application";

export default defineComponent({
  name: 'HardlineLoginPage',
  setup() {
    return {
      formRef: ref(null),
      form: ref({
        phone: '',
        password: ''
      }),

      loading: ref(false),
      error: ref(''),

      rules: {
        phone: [
          {required: true, message: 'Введи номер', trigger: 'blur'},
          {
            validator: (_: any, v: string, cb: any) => {
              const n = Number(v)
              if (!Number.isInteger(n) || n < 99000 || n > 99999) cb(new Error('Номер должен быть 99000–99999'))
              else cb()
            },
            trigger: 'blur',
          },
        ],
        password: [{required: true, message: 'Введи пароль', trigger: 'blur'}],
      } as any,
    }
  },

  created(): any {
    application.store.token = '';
    application.state.user = {} as User;
    application.state.isAuthorized = false;
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

      if (!(await this.$refs.formRef?.validate?.().catch(() => false))) return;

      this.loading = true
      try {
        const phone = Number(this.form.phone)
        const password = this.form.password
        const token = await application.serverRequest('/auth/login', phone, password);
        if (!token) throw new Error('Сервер не вернул токен')
        application.store.token = token;
        application.route('list');
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Ошибка логина'
      } finally {
        this.loading = false
      }
    },
  },
})
