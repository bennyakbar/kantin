import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { KasbonList } from '@/components/kasbon/KasbonList'
import Link from 'next/link'

export default async function KasbonPage() {
    await requireAuth()
    const supabase = await createClient()

    const { data: kasbon } = await supabase
        .from('kasbon')
        .select('*')
        .eq('status', 'belum_lunas')
        .order('created_at', { ascending: false })

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Buku Kasbon</h1>
                <Link href="/dashboard" className="text-blue-600 hover:underline">← Dashboard</Link>
            </div>

            <KasbonList initialData={kasbon || []} />
        </div>
    )
}
