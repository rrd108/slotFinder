<script setup lang="ts">
  const props = defineProps<{
    sidebarOpen: boolean
  }>()

  const emit = defineEmits<{
    'update:sidebarOpen': [value: boolean]
  }>()

  const toggleSidebar = () => {
    emit('update:sidebarOpen', !props.sidebarOpen)
  }
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <UButton icon="i-lucide-menu" variant="ghost" class="lg:hidden" @click="toggleSidebar" />
      <h1 class="text-xl font-bold">slotFinder</h1>
    </div>
    <div class="flex items-center gap-2">
      <NuxtLink to="/settings">
        <UButton icon="i-lucide-settings" variant="ghost">Beállítások</UButton>
      </NuxtLink>
      <NUsersLogoutLink>
        <UButton icon="i-lucide-log-out" variant="ghost">Kijelentkezés</UButton>
      </NUsersLogoutLink>
    </div>
  </header>
</template>

<style scoped>
  /* Remove default link styling so it doesn’t affect UButton */
  :deep(.n-users-logout-link) {
    text-decoration: none;
    display: inline-block;
    background: transparent;
    border: none;
  }

  /* If the container adds unwanted styles */
  :deep(.n-users-logout-container) {
    display: inline-block;
  }
</style>
