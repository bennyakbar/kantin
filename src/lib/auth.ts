import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/types'

export async function getUser(): Promise<UserProfile | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return profile
}

export async function requireAuth(): Promise<UserProfile> {
    const user = await getUser()
    if (!user) redirect('/login')
    return user
}

export async function requireRole(allowedRoles: string[]): Promise<UserProfile> {
    const user = await requireAuth()
    if (!allowedRoles.includes(user.role)) {
        redirect('/dashboard')
    }
    return user
}

export function isKeeper(role: string): boolean {
    return role === 'canteen_keeper'
}

export function isAdmin(role: string): boolean {
    return role === 'foundation_admin'
}
