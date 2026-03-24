import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function GamesPreview({ game }) {
    return (
        <AuthenticatedLayout header={`Preview: ${game.title}`}>
            <Head title={`Preview — ${game.title}`} />

            <div className="max-w-5xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.games.index')}
                            className="text-white/30 hover:text-white/70 text-sm transition-colors"
                        >
                            ← Volver
                        </Link>
                        <span className="text-white/20">/</span>
                        <span className="text-sm text-white/50">Vista previa</span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${game.published
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-white/10 text-white/40'}`}>
                        {game.published ? '● Publicado' : '○ Oculto'}
                    </div>
                </div>

                {/* Iframe del juego */}
                <div className="bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500/50" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        </div>
                        <span className="text-xs text-white/30 ml-2 font-mono truncate">{game.url}</span>
                    </div>
                    <iframe
                        src={game.url}
                        title={game.title}
                        className="w-full"
                        style={{ height: '70vh', border: 'none' }}
                        allow="camera; microphone"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                </div>

                <p className="text-xs text-white/25 text-center">
                    Vista previa interna — el juego se carga desde: <span className="font-mono">{game.url}</span>
                </p>
            </div>
        </AuthenticatedLayout>
    );
}