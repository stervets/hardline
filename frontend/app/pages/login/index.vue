<template>
  <div class="hl-login min-h-screen w-full flex items-center justify-center px-4">
    <div class="hl-bg absolute inset-0"></div>

    <div class="relative w-full max-w-md">
      <div class="hl-card rounded-2xl shadow-2xl p-6 md:p-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <div class="text-2xl font-semibold tracking-tight">Hardline</div>
            <div class="text-sm opacity-70 mt-1">SIP Login</div>
          </div>

          <div class="hl-badge text-xs px-3 py-1 rounded-full">
            v0.0.1 ALPHA
          </div>
        </div>

        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            @submit.prevent
        >
          <el-form-item label="Внутренний номер" prop="phone">
            <el-input
                v-model="form.phone"
                size="large"
                placeholder="99000–99999"
                inputmode="numeric"
                autocomplete="username"
                @keyup.enter="onSubmit"
                clearable
            >
              <template #prefix>
                <span class="opacity-60">#</span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="Пароль" prop="password">
            <el-input
                v-model="form.password"
                size="large"
                placeholder="Пароль"
                type="password"
                show-password
                autocomplete="current-password"
                @keyup.enter="onSubmit"
            />
          </el-form-item>

          <el-button
              type="primary"
              size="large"
              class="w-full mt-8"
              :loading="loading"
              @click="onSubmit"
          >
            Войти
          </el-button>

          <div v-if="error" class="mt-4">
            <el-alert :title="error" type="error" show-icon :closable="false" />
          </div>
        </el-form>
      </div>

      <div class="mt-4 text-center text-xs opacity-50">
        MIT License Copyright &copy; 2026 Mike Lisov
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="less" src="./style.less"></style>
