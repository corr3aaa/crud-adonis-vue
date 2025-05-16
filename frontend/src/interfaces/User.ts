export interface User {
    id?: number
    fullName: string | null
    email: string
    role: 'admin' | 'user'
    street?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    country?: string | null
    created_at?: string
    updated_at?: string
}
  