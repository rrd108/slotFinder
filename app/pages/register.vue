<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Regisztráció</h1>
      </template>

      <NUsersGoogleLoginButton 
        button-text="Regisztráció Google-lel"
        class="mb-4 w-full"
      />

      <USeparator label="vagy" class="my-4" />

      <NUsersRegisterForm @success="handleSuccess" />

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
