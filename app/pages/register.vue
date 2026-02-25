<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Regisztráció</h1>
      </template>

      <NUsersUserForm @success="handleSuccess" />

      <p class="text-center text-sm text-gray-500 mt-4">
        Van már fiókod?
        <NuxtLink to="/login" class="text-primary hover:underline">
          Bejelentkezés
        </NuxtLink>
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
function handleSuccess() {
  navigateTo('/login')
}
</script>
