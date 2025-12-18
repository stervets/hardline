export default {
  setup() {
    return {
      serverPassword: '',
      displayName: '',
      sipPassword: '',
      result: null as any,

      toCall: '99001',
    };
  },

  methods: {
    async register(this: any) {
      const r = await fetch('http://10.0.2.2:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverPassword: this.serverPassword,
          displayName: this.displayName,
          sipPassword: this.sipPassword,
        }),
      });

      this.result = await r.json();
      (window as any).Hardline?.register?.(this.result);
    },

    call(this: any) {
      (window as any).Hardline?.call?.(this.toCall);
    },

    hangup(this: any) {
      (window as any).Hardline?.hangup?.();
    },
  },
};
