<template>
  <div class="q-pa-md">
    <q-btn label="New User" color="primary" @click="openCreateDialog" class="q-mb-md" />

    <q-table
      title="Usuários"
      :rows="users"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template #body-cell-actions="props">
        <q-td align="right">
          <q-btn flat icon="edit" color="primary" @click="openEditDialog(props.row)" />
        </q-td>
      </template>
    </q-table>

    <user-form-dialog
      v-model="isDialogOpen"
      :user="selectedUser"
      @refresh="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import type { User } from 'src/interfaces/User'
import UserFormDialog from 'src/components/UserFormDialog.vue'

const isDialogOpen = ref(false)
const selectedUser = ref<User | null>(null)

const store = useUserStore()
const users = ref<User[]>([])

const columns = [
  { name: 'fullName', label: 'Nome', field: 'fullName', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'role', label: 'Perfil', field: 'role', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' as const }
]

function openCreateDialog() {
  selectedUser.value = null
  isDialogOpen.value = true
}

function openEditDialog(user: User) {
  selectedUser.value = user
  isDialogOpen.value = true
}

async function fetchUsers() {
  await store.fetchUsers()
  users.value = store.users
}

onMounted(() => {
  void fetchUsers()
})
</script>
