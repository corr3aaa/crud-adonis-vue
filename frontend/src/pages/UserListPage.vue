<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Users</div>
        <q-btn color="primary" label="New User" @click="openCreateDialog" />
      </q-card-section>

      <!-- Campo de busca -->
      <q-card-section>
        <q-input
          filled
          v-model="search"
          debounce="300"
          placeholder="Search by name..."
          prepend-inner-icon="search"
        />
      </q-card-section>

      <!-- Tabela de usuários -->
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :sort-method="customSort"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        @request="onRequest"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn dense flat icon="edit" color="secondary" @click="openEditDialog(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="deleteUser(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <UserFormDialog
      v-model="dialogOpen"
      :user="selectedUser"
      @refresh="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import type { User } from 'src/interfaces/User'
import UserFormDialog from 'src/components/UserFormDialog.vue'
import type { QTableColumn } from 'quasar'

const userStore = useUserStore()

const users = computed(() => userStore.users)
const search = ref('')
const dialogOpen = ref(false)
const selectedUser = ref<User | null>(null)

const sortBy = ref<string>('id')
const sortDesc = ref<boolean>(false)

const columns: QTableColumn<User>[] = [
  { name: 'fullName', label: 'Name', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  {
    name: 'role',
    label: 'Role',
    field: (row: User) => (row.role === 'admin' ? 'Administrador' : 'Usuário'),
    align: 'left',
    sortable: true
  },
  {
    name: 'address',
    label: 'Address',
    field: (row: User) => {
      const city = row.city ?? '—'
      const state = row.state ?? ''
      return `${city}${state ? ', ' + state : ''}`
    },
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: () => '',
    align: 'right'
  }
]

onMounted(fetchUsers)
watch([search, sortBy, sortDesc], fetchUsers)

async function fetchUsers() {
  const order = sortDesc.value ? 'desc' : 'asc'
  await userStore.fetchUsers(search.value, sortBy.value, order)
}

function openCreateDialog() {
  selectedUser.value = null
  dialogOpen.value = true
}

function openEditDialog(user: User) {
  selectedUser.value = user
  dialogOpen.value = true
}

async function deleteUser(userId: number) {
  if (confirm('Tem certeza que deseja deletar este usuário?')) {
    await userStore.deleteUser(userId)
    await fetchUsers()
  }
}

// Helper para acesso dinâmico tipado
function getFieldValue(row: User, key: keyof User): string | number {
  const value = row[key]

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return ''
}

// Ordenação customizada com lint fix
function customSort(rows: readonly User[], sortByKey: string, descending: boolean): readonly User[] {
  const sorted = [...rows]

  sorted.sort((a, b) => {
    let valA: string | number = ''
    let valB: string | number = ''

    switch (sortByKey) {
      case 'role': {
        valA = a.role === 'admin' ? 'Administrador' : 'Usuário'
        valB = b.role === 'admin' ? 'Administrador' : 'Usuário'
        break
      }
      case 'address': {
        const cityA = a.city ?? '—'
        const stateA = a.state ?? ''
        valA = `${cityA}${stateA ? ', ' + stateA : ''}`

        const cityB = b.city ?? '—'
        const stateB = b.state ?? ''
        valB = `${cityB}${stateB ? ', ' + stateB : ''}`
        break
      }
      default: {
        if (sortByKey in a && sortByKey in b) {
          valA = getFieldValue(a, sortByKey as keyof User)
          valB = getFieldValue(b, sortByKey as keyof User)
        } else {
          valA = ''
          valB = ''
        }
      }
    }

    if (valA == null) valA = ''
    if (valB == null) valB = ''

    if (typeof valA === 'number' && typeof valB === 'number') {
      return descending ? valB - valA : valA - valB
    }

    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()

    if (strA < strB) return descending ? 1 : -1
    if (strA > strB) return descending ? -1 : 1
    return 0
  })

  return sorted
}

function onRequest({ pagination }: { pagination: { sortBy: string; descending: boolean } }) {
  sortBy.value = pagination.sortBy || 'id'
  sortDesc.value = pagination.descending || false
}
</script>
