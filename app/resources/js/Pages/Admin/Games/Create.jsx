import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GameForm from '@/Components/GameForm';
import { Head, Link } from '@inertiajs/react';

export default function GamesCreate() {
    return (
        <AuthenticatedLayout header="Nuevo juego">
            <Head title="Nuevo juego" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.games.index')}
                        className="text-white/30 hover:text-white/70 text-sm transition-colors"
                    >
                        ← Volver
                    </Link>
                    <span className="text-white/20">/</span>
                    <span className="text-sm text-white/50">Nuevo juego</span>
                </div>

                <div className="bg-[#16161f] border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Crear juego</h2>
                    <GameForm submitRoute={route('admin.games.store')} method="post" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}