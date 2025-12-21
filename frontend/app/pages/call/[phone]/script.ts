import application from '@/composables/application'

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmt = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

const isCallEndedEvent = (e: any) => {
  const str = JSON.stringify(e || {}).toLowerCase()
  return (
    str.includes('disconnected') ||
    str.includes('call_end') ||
    str.includes('callended') ||
    str.includes('hangup') ||
    str.includes('terminated')
  )
}

export default {
  props: [],
  emits: [],
  setup() {
    const route = useRoute()
    const phone = String(route.params.phone || '')

    return {
      application,
      phone,
      error: ref(''),
      seconds: ref(0),
      secondsTimer: null as any,
    }
  },

  computed: {
    timer(this: any) {
      return fmt(this.seconds)
    }
  },

  async mounted(this: any) {
    this.on('hardline:event', e => isCallEndedEvent(e) && this.goBack())

    try {
      (window as any).Hardline?.call?.(this.phone);
    } catch (e: any) {
      this.error = e?.message || 'Call failed'
    }

    this.incrementSeconds();
  },

  beforeUnmount(this: any) {
    clearTimeout(this.secondsTimer);
  },

  methods: {
    incrementSeconds(this: any) {
      this.secondsTimer = setTimeout(this.incrementSeconds, 1000);
      this.seconds++;
    },

    onHangup(this: any) {
      try {
        ;(window as any).Hardline?.hangup?.()
      } catch (e: any) {
      }
      this.goBack()
    },

    goBack(this: any) {
      clearTimeout(this.secondsTimer); //TODO: check we really need this
      application.route('list');
    },
  },
}
