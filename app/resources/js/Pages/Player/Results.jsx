import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Results({ sessions }) {

    function formatDuration(secs) {
        if (!secs) return '—';
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    }

    function formatDate(str) {
        if (!str) return '—';
        return new Date(str).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    const statusBadge = {
        completed:  'bg-emerald-500/15 text-emerald-400',
        active:     'bg-yellow-500/15 text-yellow-400',
        abandoned:  'bg-white/10 text-white/30',
    };

    return (
        <AuthenticatedLayout header="Mis resultados">
            <Head title="Mis resultados" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Mis partidas</h2>
                    <p className="text-sm text-white/40 mt-1">{sessions.total} partida(s) registrada(s)</p>
                </div>

                {sessions.data.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <p className="text-5xl mb-4">📊</p>
                        <p>Todavía no has jugado ninguna partida.</p>
                        <Link
                            href={route('player.games')}
                            className="mt-4 inline-block px-4 py-2 bg-[#7c6af7] text-white text-sm rounded-lg"
                        >
                            Ir a jugar →
                        </Link>
                    </div>
                ) : (
                    <div className="bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-4">Juego</th>
                                    <th className="text-left px-6 py-4 hidden sm:table-cell">Inicio</th>
                                    <th className="text-left px-6 py-4 hidden md:table-cell">Duración</th>
                                    <th className="text-left px-6 py-4">Estado</th>
                                    <th className="text-left px-6 py-4 hidden lg:table-cell">Resultado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sessions.data.map(session => (
                                    <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {session.game?.title ?? '—'}
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell text-white/40 text-xs">
                                            {formatDate(session.started_at)}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-white/50">
                                            {formatDuration(session.duration_seconds)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                                                ${statusBadge[session.status] ?? 'bg-white/10 text-white/30'}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-white/40 text-xs font-mono">
                                            {session.result
                                                ? JSON.stringify(session.result)
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}