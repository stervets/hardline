<template>
  <div
      class="min-h-[100vh] w-full flex items-center justify-center p-4
           bg-gradient-to-br from-slate-950 via-slate-400 to-slate-950 text-slate-200"
  >
    <div class="w-full max-w-2xl">
      <el-card class="card rounded-2xl shadow-2xl border border-slate-800">
        <div class="flex items-start gap-4">
          <div class="logo flex items-center justify-center">
            i - i
          </div>

          <div class="flex-1">
            <div class="text-3xl font-semibold tracking-tight leading-tight">Hardline</div>
            <div class="mt-1 text-sm text-slate-300">
              MVP нативного Android SIP-клиента (UDP, без WebRTC)
            </div>
          </div>
        </div>

        <el-divider />

        <div class="text-slate-200">
          <p class="text-base leading-relaxed">
            <b>Hardline</b> — прозрачный и максимально прямолинейный SIP-клиент для Android:
            <b>WebView (Nuxt UI)</b> + <b>native SIP (PJSIP)</b> + <b>FreeSWITCH</b> +
            <b>NestJS backend</b> для auth и выдачи SIP-bundle.
          </p>

          <ul class="mt-4 space-y-2 text-sm text-slate-300 list-disc pl-5">
            <li><b>Android</b>: PJSIP (pjsua2 / pjdroid), REGISTER стабилен, INVITE есть, аудио/RTP — следующий шаг.</li>
            <li><b>FreeSWITCH</b>: SIP/UDP, один context, directory/dialplan через mod_xml_curl.</li>
            <li><b>Backend</b>: JWT auth (rolling renewal), эндпоинты под контроль регистрации.</li>
            <li><b>Frontend</b>: UI-only, без SIP-логики, только управление и статус.</li>
          </ul>

          <div class="mt-5">
            <div class="text-sm font-semibold text-slate-200 mb-2">Принципы</div>
            <div class="flex flex-wrap gap-2">
              <el-tag type="info" effect="light">SIP ≠ WebRTC</el-tag>
              <el-tag type="info" effect="light">Явно, без магии</el-tag>
              <el-tag type="info" effect="light">MVP сначала</el-tag>
              <el-tag type="info" effect="light">Клиент — не сервер</el-tag>
            </div>
          </div>

          <el-divider />

          <div class="flex flex-col gap-1">
            <a class="gh text-sm font-medium" href="https://github.com/stervets/hardline" target="_blank" rel="noreferrer">
              https://github.com/stervets/hardline
            </a>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="less" src="./style.less"></style>
