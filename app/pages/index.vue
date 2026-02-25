<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton icon="i-lucide-menu" variant="ghost" class="lg:hidden" @click="sidebarOpen = !sidebarOpen" />
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

    <div class="flex">
      <aside 
        class="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0"
        :class="{ 'hidden lg:block': !sidebarOpen }"
      >
        <h2 class="font-semibold mb-3">Felhasználók</h2>
        <div class="space-y-2">
          <label 
            v-for="user in users" 
            :key="user.id" 
            class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100"
          >
            <UCheckbox 
              :model-value="selectedUsers.includes(user.id)"
              @update:model-value="toggleUser(user.id)"
            />
            <span>{{ user.name || user.email }}</span>
          </label>
        </div>
      </aside>

      <main class="flex-1 p-4 overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-chevron-left" variant="ghost" @click="prevWeek" />
            <span class="font-medium min-w-[200px] text-center">
              {{ weekLabel }}
            </span>
            <UButton icon="i-lucide-chevron-right" variant="ghost" @click="nextWeek" />
          </div>
          <UButton icon="i-lucide-calendar" @click="goToToday">Ma</UButton>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="min-w-[140px]"
          >
            <div 
              class="text-center p-2 rounded-t"
              :class="isToday(day.date) ? 'bg-primary text-white' : 'bg-gray-100'"
            >
              <div class="text-xs">{{ day.hunName }}</div>
              <div class="font-bold">{{ day.day }}</div>
            </div>
            <div class="bg-white border rounded-b p-2 space-y-1">
              <div 
                v-for="hour in hours" 
                :key="hour"
                class="h-8 text-xs flex items-center"
                :class="getSlotClass(day.date, hour)"
                @click="handleSlotClick(day.date, hour)"
              >
                {{ hour }}:00
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <UModal v-model="showInvitationModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-bold">Meghívó küldése</h3>
          </template>
          
          <p class="mb-4">
            Biztosan szeretnél meghívót küldeni 
            <strong>{{ selectedUsers.length }}</strong> felhasználónak?
          </p>
          
          <p class="text-sm text-gray-500 mb-4">
            {{ formatDateTime(selectedDate, selectedHour) }}
          </p>

            <UFormField label="Esemény neve" required>
            <UInput v-model="invitationTitle" placeholder="pl. Megbeszélés" />
            </UFormField>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" @click="showInvitationModal = false">Mégsem</UButton>
              <UButton :loading="sending" @click="sendInvitation">Küldés</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, fetchUser } = useAuthentication()
const sidebarOpen = ref(false)

await fetchUser(true)

if (!isAuthenticated.value) {
  navigateTo('/login')
}

const users = ref<any[]>([])
const selectedUsers = ref<number[]>([])
const currentDate = ref(new Date())
const showInvitationModal = ref(false)
const selectedDate = ref('')
const selectedHour = ref(0)
const invitationTitle = ref('')
const sending = ref(false)

const weekDays = computed(() => {
  const days = []
  const start = getStartOfWeek(currentDate.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    days.push({
      date: formatDate(date),
      day: date.getDate(),
      hunName: hungarianDays[date.getDay()]
    })
  }
  return days
})

const weekLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[6]
  return `${start.day}. - ${end.day}. ${hungarianMonths[currentDate.value.getMonth()]}`
})

const hours = Array.from({ length: 14 }, (_, i) => i + 8)

const busySlots = ref<any[]>([])

onMounted(async () => {
  await loadUsers()
  await loadBusySlots()
})

async function loadUsers() {
  try {
    users.value = await $fetch('/api/users')
  } catch (e) {
    console.error('Error loading users:', e)
  }
}

async function loadBusySlots() {
  const userIds = selectedUsers.value.length > 0 
    ? selectedUsers.value.join(',') 
    : ''
  
  const dates = weekDays.value.map(d => d.date).join(',')
  
  try {
    const results: any[] = []
    for (const date of weekDays.value.map(d => d.date)) {
      const slots = await $fetch('/api/busy-slots', {
        query: { date, userIds: userIds || undefined }
      })
      results.push(...slots)
    }
    busySlots.value = results
  } catch (e) {
    console.error('Error loading busy slots:', e)
  }
}

function toggleUser(userId: number) {
  const idx = selectedUsers.value.indexOf(userId)
  if (idx > -1) {
    selectedUsers.value.splice(idx, 1)
  } else {
    selectedUsers.value.push(userId)
  }
  loadBusySlots()
}

function prevWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 7)
  currentDate.value = d
  loadBusySlots()
}

function nextWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 7)
  currentDate.value = d
  loadBusySlots()
}

function goToToday() {
  currentDate.value = new Date()
  loadBusySlots()
}

function isToday(date: string) {
  return date === formatDate(new Date())
}

function isSlotBusy(date: string, hour: number) {
  const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`)
  const slotEnd = new Date(slotStart)
  slotEnd.setHours(slotEnd.getHours() + 1)
  
  return busySlots.value.some(slot => {
    const slotStartTime = new Date(slot.start)
    const slotEndTime = new Date(slot.end)
    return slotStart < slotEndTime && slotEnd > slotStartTime
  })
}

function getSlotClass(date: string, hour: number) {
  if (isSlotBusy(date, hour)) {
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }
  return 'bg-green-100 hover:bg-green-200 cursor-pointer'
}

function handleSlotClick(date: string, hour: number) {
  if (isSlotBusy(date, hour)) return
  
  selectedDate.value = date
  selectedHour.value = hour
  invitationTitle.value = ''
  showInvitationModal.value = true
}

async function sendInvitation() {
  if (!invitationTitle.value) return
  
  sending.value = true
  
  try {
    const startTime = `${selectedDate.value}T${selectedHour.value.toString().padStart(2, '0')}:00:00`
    const endTime = `${selectedDate.value}T${(selectedHour.value + 1).toString().padStart(2, '0')}:00:00`
    
    await $fetch('/api/invitations', {
      method: 'POST',
      body: {
        title: invitationTitle.value,
        start_time: startTime,
        end_time: endTime,
        attendee_ids: selectedUsers.value,
        calendar_id: 'primary'
      }
    })
    
    showInvitationModal.value = false
    await loadBusySlots()
  } catch (e) {
    console.error('Error sending invitation:', e)
  } finally {
    sending.value = false
  }
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function formatDateTime(date: string, hour: number) {
  const d = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`)
  return `${d.getDate()}. ${hungarianMonths[d.getMonth()]} ${hour}:00 - ${hour + 1}:00`
}

const hungarianDays = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
const hungarianMonths = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december']

function getStartOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
</script>
