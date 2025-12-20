<template>
  <div class="application"

  >
    <!--v-loading.fullscreen.lock="!application.state.isManagerReady"-->
    <NuxtLayout
        :name="layout"
        class="layout"
    >
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script src="./app.script.ts" lang="ts"></script>
<style src="./app.style.less" lang="less"/>