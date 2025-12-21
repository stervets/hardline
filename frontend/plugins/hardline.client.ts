import {emit} from '@/composables/event-bus'

export default defineNuxtPlugin(() => {
  const win = window as any;
  const hasNative = () => typeof win.HardlineNative?.call === 'function';

  win.Hardline = {
    register: (creds: any) => hasNative() ? win.HardlineNative.register(JSON.stringify(creds)) :
        console.log('[Hardline] register', creds),

    call: (num: string) => hasNative() ? win.HardlineNative.call(num) :
        console.log('[Hardline] call', num),

    hangup: () => hasNative() ? win.HardlineNative.hangup()
      : console.log('[Hardline] hangup'),

    answer: () => hasNative() ? win.HardlineNative.answer()
      : console.log('[Hardline] answer'),

    setMute: (mute: boolean) => hasNative() ? win.HardlineNative.setMute(mute)
        : console.log('[Hardline] mute', mute),
  };

  win.onHardlineEvent = (e: any) => {
    console.log('[Hardline event]', JSON.stringify(e, null, 2));
    emit('hardline:event', e)
  }
});