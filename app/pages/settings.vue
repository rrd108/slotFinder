<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <header class="flex items-center gap-4 mb-6">
      <NuxtLink to="/">
        <UButton icon="i-lucide-arrow-left" variant="ghost">Vissza</UButton>
      </NuxtLink>
      <h1 class="text-xl font-bold">Beállítások</h1>
    </header>

    <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h2 class="font-bold">Naptárak kezelése</h2>
        </template>

        <div class="space-y-3 mb-4">
          <div v-for="cal in calendars" :key="cal.id" class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div class="font-medium">{{ cal.calendar_name || cal.calendar_id }}</div>
              <div class="text-xs text-gray-500">{{ cal.calendar_id }}</div>
            </div>
            <UButton icon="i-lucide-trash-2" variant="ghost" color="red" @click="removeCalendar(cal.id)" />
          </div>
        </div>

        <div class="space-y-3">
          <UInput v-model="newCalendar.calendar_id" placeholder="Naptár ID (pl. rrd@1108.cc)" />
          <UInput v-model="newCalendar.calendar_name" placeholder="Név (opcionális)" />
          <UButton @click="addCalendar" :loading="adding"> Naptár hozzáadása </UButton>
        </div>

        <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
          <p class="font-medium mb-1">Hogyan add meg a naptárat?</p>
          <ol class="list-decimal list-inside space-y-1 text-gray-600">
            <li>Google Calendar → Beállítások</li>
            <li>Válaszd ki a naptárat</li>
            <li>Másold ki a "Naptár azonosító" értéket</li>
            <li>
              Oszd meg a naptárat a <code class="bg-white px-1">slotfinder@webmania-383615.iam.gserviceaccount.com</code> címmel. <em>
                Csak az elfoglaltsági adatok
                megtekintése jogosultságot kell választani
              </em>, így nem látjuk mit csinálsz, csak azt, hogy foglalt vagy.
            </li>
          </ol>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="font-bold">Egyedi nem elérhető időpontok</h2>
        </template>

        <div class="space-y-3 mb-4">
          <div v-for="av in availability" :key="av.id" class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span v-if="av.is_recurring">{{ dayNames[av.day_of_week] }}</span>
              <span v-else>{{ av.specific_date }}</span>
              <span class="mx-2">{{ av.start_time }} - {{ av.end_time }}</span>
            </div>
            <UButton icon="i-lucide-trash-2" variant="ghost" color="red" @click="removeAvailability(av.id)" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex flex-wrap gap-2 items-start">
            <USelect 
              v-model="newAvailability.days" 
              :items="dayOptions" 
              placeholder="Nap"
              multiple
              class="w-full sm:w-48"
            />
            <USelect 
              v-model="newAvailability.start_time" 
              :items="timeOptions" 
              placeholder="Kezdés" 
              class="w-28"
            />
            <USelect 
              v-model="newAvailability.end_time" 
              :items="timeOptions" 
              placeholder="Vég" 
              class="w-28"
            />
          </div>
          <UButton @click="addAvailability" :loading="addingAv"> Hozzáadás </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { user, isAuthenticated, fetchUser } = useAuthentication()

  await fetchUser(true)

  if (!isAuthenticated.value) {
    navigateTo('/login')
  }

  const calendars = ref<any[]>([])
  const availability = ref<any[]>([])
  const newCalendar = ref({ calendar_id: '', calendar_name: '' })
  const newAvailability = ref({
    days: [],
    start_time: '',
    end_time: '',
  })
  const adding = ref(false)
  const addingAv = ref(false)

  const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']

  const dayOptions = [
    { value: 0, label: 'Vasárnap' },
    { value: 1, label: 'Hétfő' },
    { value: 2, label: 'Kedd' },
    { value: 3, label: 'Szerda' },
    { value: 4, label: 'Csütörtök' },
    { value: 5, label: 'Péntek' },
    { value: 6, label: 'Szombat' },
  ]

  const timeOptions = [
    '00:00', '00:15', '00:30', '00:45',
    '01:00', '01:15', '01:30', '01:45',
    '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45',
    '04:00', '04:15', '04:30', '04:45',
    '05:00', '05:15', '05:30', '05:45',
    '06:00', '06:15', '06:30', '06:45',
    '07:00', '07:15', '07:30', '07:45',
    '08:00', '08:15', '08:30', '08:45',
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45',
    '22:00', '22:15', '22:30', '22:45',
    '23:00', '23:15', '23:30', '23:45',
  ]

  onMounted(async () => {
    await loadCalendars()
    await loadAvailability()
  })

  async function loadCalendars() {
    calendars.value = await $fetch('/api/calendars')
  }

  async function loadAvailability() {
    availability.value = await $fetch('/api/availability')
  }

  async function addCalendar() {
    if (!newCalendar.value.calendar_id) return

    adding.value = true
    try {
      await $fetch('/api/calendars', {
        method: 'POST',
        body: newCalendar.value,
      })
      newCalendar.value = { calendar_id: '', calendar_name: '' }
      await loadCalendars()
    } catch (e) {
      console.error('Error adding calendar:', e)
    } finally {
      adding.value = false
    }
  }

  async function removeCalendar(id: number) {
    await $fetch(`/api/calendars/${id}`, { method: 'DELETE' })
    await loadCalendars()
  }

  async function addAvailability() {
    if (!newAvailability.value.start_time || !newAvailability.value.end_time || !newAvailability.value.days?.length) return

    addingAv.value = true
    try {
      for (const day of newAvailability.value.days) {
        const dayOfWeek = typeof day === 'object' ? day.value : Number(day)
        if (isNaN(dayOfWeek)) continue
        
        await $fetch('/api/availability', {
          method: 'POST',
          body: {
            day_of_week: dayOfWeek,
            start_time: newAvailability.value.start_time,
            end_time: newAvailability.value.end_time,
            is_recurring: 1
          },
        })
      }
      newAvailability.value = {
        days: [],
        start_time: '',
        end_time: '',
        is_recurring: true,
      }
      await loadAvailability()
    } catch (e) {
      console.error('Error adding availability:', e)
    } finally {
      addingAv.value = false
    }
  }

  async function removeAvailability(id: number) {
    await $fetch(`/api/availability/${id}`, { method: 'DELETE' })
    await loadAvailability()
  }
</script>
