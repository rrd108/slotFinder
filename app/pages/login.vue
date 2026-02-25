<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">slotFinder</h1>
      </template>

      <NUsersLoginForm @success="handleLogin" />

      <p class="text-center text-sm text-gray-500 mt-4">
        Nincs fiókod?
        <NuxtLink to="/register" class="text-primary hover:underline">
          Regisztráció
        </NuxtLink>
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuthentication()

function handleLogin(user: any) {
  login(user)
  navigateTo('/')
}
</script>
