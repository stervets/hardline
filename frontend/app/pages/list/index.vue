<template>
  <div class="page page-list min-h-screen w-full flex items-center justify-center px-4">
    <div class="hl-bg absolute inset-0"></div>

    <div class="relative w-full max-w-md">
      <div class="hl-card rounded-2xl shadow-2xl p-4 md:p-8">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-grow">
            <div class="text-xl font-semibold tracking-tight">Hardline</div>
          </div>

          <el-button @click="onLogout" size="small"
          >Выход</el-button>
        </div>

        <div class="text-xs opacity-60 mb-3">
          {{ application.state.user.name }}: <span class="opacity-90">#{{ application.state.user.phone }}</span>
          <span v-if="application.state.user.isAdmin" class="ml-2 opacity-70">(admin)</span>
        </div>

        <el-table
            v-loading="loading"
            :data="users"
            size="small"
            class="w-full"
            empty-text="No users"
            @row-click="onRowClick"
            :row-class-name="rowClassName"
        >
          <el-table-column label="#" prop="phone" width="120" />
          <el-table-column label="Name" prop="name" />
          <el-table-column width="80">
            <template #default="{ row }">
              <span v-if="row.phone === application.state.user.phone" class="hl-badge text-xs px-2 py-0.5 rounded-full">Вы</span>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="selectedUser" class="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
          <div class="text-sm opacity-80">
            Выбран: <span class="font-mono opacity-90">#{{ selectedUser.phone }}</span>
            <span v-if="selectedUser.name" class="opacity-70">— {{ selectedUser.name }}</span>
          </div>

          <el-button type="primary" size="small" @click="onCallSelected">
            Позвонить
          </el-button>
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
