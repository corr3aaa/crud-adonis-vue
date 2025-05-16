import { ref } from 'vue'
import { api } from 'boot/axios'
import type { User } from 'src/interfaces/User'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const users = ref<User[]>([])

    async function fetchUsers(
        search: string = '',
        sortBy: string = 'id',
        sortOrder: string = 'asc'
    ) {
        const response = await api.get('/users', {
            params: { search, sortBy, sortOrder }
        })
        users.value = response.data
    }

    async function createUser(user: User) {
        await api.post('/users', user)
        await fetchUsers()
    }

    async function updateUser(user: User) {
        await api.put(`/users/${user.id}`, user)
        await fetchUsers()
    }

    async function deleteUser(userId: number) {
        await api.delete(`/users/${userId}`)
        await fetchUsers()
    }

    return {
        users,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser
    }
})
  