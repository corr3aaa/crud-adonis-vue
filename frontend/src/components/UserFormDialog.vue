<template>
  <q-dialog v-model="dialogProxy">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ isEditMode ? 'Edit User' : 'New User' }}</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="userData.fullName"
          label="Name"
          :rules="[val => !!val || 'Name is required']"
        />
        <q-input
          v-model="userData.email"
          label="Email"
          type="email"
          :rules="[val => !!val || 'Email is required', val => emailRegex.test(val) || 'Invalid email']"
        />
        <q-select
          v-model="userData.role"
          label="Role"
          :options="['user', 'admin']"
          :rules="[val => !!val || 'Role is required']"
        />
        <q-input v-model="userData.street" label="Street" />
        <q-input v-model="userData.city" label="City" />
        <q-input v-model="userData.state" label="State" />
        <q-input
          v-model="zipCodeMasked"
          label="ZIP Code"
          :rules="zipCodeRules"
          maxlength="9"
          @update:model-value="onZipCodeInput"
        />
        <q-input v-model="userData.country" label="Country" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="deep-orange" @click="closeDialog" />
        <q-btn flat label="Save" color="secondary" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import type { User } from 'src/interfaces/User'

interface Props {
  modelValue: boolean
  user?: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; 'refresh': [] }>()

const dialogProxy = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const userData = ref<User>({
  id: 0,
  fullName: '',
  email: '',
  role: 'user',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
})

const zipCodeMasked = ref('')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Watch para sincronizar zipCode original com o mascarado
watch(
  () => userData.value.zipCode,
  (val) => {
    zipCodeMasked.value = formatZipCode(val || '')
  },
  { immediate: true }
)

function onZipCodeInput(val: string | number | null) {
  const stringVal = String(val ?? '')
  zipCodeMasked.value = formatZipCode(stringVal)
  userData.value.zipCode = unmaskZipCode(stringVal)
}

function formatZipCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function unmaskZipCode(value: string): string {
  return value.replace(/\D/g, '')
}

const zipCodeRules = [
  (val: string) =>
    !val || /^\d{5}-\d{3}$/.test(val) || 'Invalid ZIP Code (format: 00000-000)'
]

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      userData.value = { ...newUser }
    } else {
      userData.value = {
        id: 0,
        fullName: '',
        email: '',
        role: 'user',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  },
  { immediate: true }
)

const isEditMode = computed(() => !!props.user?.id)

function closeDialog() {
  emit('update:modelValue', false)
}

async function submit() {
  const store = useUserStore()
  if (isEditMode.value) {
    await store.updateUser(userData.value)
  } else {
    await store.createUser(userData.value)
  }
  emit('refresh')
  closeDialog()
}
</script>
