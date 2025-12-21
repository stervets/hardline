<template>
  <div class="page page-call min-h-screen w-full flex items-center justify-center px-4">
    <div class="hl-bg absolute inset-0"></div>

    <div class="relative w-full max-w-md">
      <div class="hl-card rounded-2xl shadow-2xl p-4 md:p-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <div class="text-xl font-semibold tracking-tight">Hardline</div>
            <div class="text-sm opacity-70 mt-1">Call</div>
          </div>

          <el-button size="small" @click="onHangup">Сброс</el-button>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
          <div class="text-xs opacity-60">Звоним</div>
          <div class="mt-1 text-2xl font-mono font-semibold">
            #{{ phone }}
          </div>

          <div class="mt-3 text-sm opacity-70">
            Время: <span class="font-mono opacity-90">{{ timer }}</span>
          </div>

          <div class="mt-4 flex gap-2">
            <el-button type="primary" size="small" @click="onHangup">Завершить</el-button>
            <!--el-button size="small" @click="goBack">Назад</el-button-->
          </div>
        </div>

        <div v-if="error" class="mt-4">
          <el-alert :title="error" type="error" show-icon :closable="false" />
        </div>
      </div>

      <div class="mt-4 text-center text-xs opacity-50">
        MIT License Copyright &copy; 2026 Mike Lisov
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="less" src="./style.less"></style>
