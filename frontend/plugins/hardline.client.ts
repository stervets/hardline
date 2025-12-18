export default defineNuxtPlugin(() => {
  const hasNative = () =>
    typeof (window as any).HardlineNative?.call === 'function';

  (window as any).Hardline = {
    register: (creds: any) => {
      if (hasNative())
        (window as any).HardlineNative.register(JSON.stringify(creds));
      else console.log('[Hardline] register', creds);
    },
    call: (num: string) => {
      if (hasNative())
        (window as any).HardlineNative.call(num);
      else console.log('[Hardline] call', num);
    },
    hangup: () =>
      hasNative()
        ? (window as any).HardlineNative.hangup()
        : console.log('[Hardline] hangup'),
    answer: () =>
      hasNative()
        ? (window as any).HardlineNative.answer()
        : console.log('[Hardline] answer'),
    setMute: (mute: boolean) =>
      hasNative()
        ? (window as any).HardlineNative.setMute(mute)
        : console.log('[Hardline] mute', mute),
  };

  (window as any).onHardlineEvent = (e: any) =>
    console.log('[Hardline event]', e);
});
