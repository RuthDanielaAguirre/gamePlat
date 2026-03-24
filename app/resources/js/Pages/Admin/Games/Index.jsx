import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Flash from '@/Components/Flash';
import { Link, router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function GamesIndex({ games }) {
    const { auth } = usePage().props;
    const canManage = ['administrador', 'gestor'].includes(auth.user?.role?.name);

    function togglePublish(game) {
        router.patch(route('admin.games.toggle', game.id), {}, {
            preserveScroll: true,
        });
    }

    function destroy(game) {
        if (!confirm(`¿Eliminar "${game.title}"?`)) return;
        router.delete(route('admin.games.destroy', game.id));
    }

    return (
        <AuthenticatedLayout header="Gestión de Juegos">
            <Head title="Juegos" />
            <Flash />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Juegos</h2>
                        <p className="text-sm text-white/40 mt-0.5">{games.total} juego(s) en el sistema</p>
                    </div>
                    {canManage && (
                        <Link
                            href={route('admin.games.create')}
                            className="px-4 py-2 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            + Nuevo juego
                        </Link>
                    )}
                </div>

                {/* Table */}
                <div className="bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
                    {games.data.length === 0 ? (
                        <div className="text-center py-16 text-white/30">
                            <p className="text-4xl mb-3">🎮</p>
                            <p>No hay juegos todavía.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-4">Título</th>
                                    <th className="text-left px-6 py-4 hidden md:table-cell">Creador</th>
                                    <th className="text-left px-6 py-4">Estado</th>
                                    <th className="text-right px-6 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {games.data.map((game) => (
                                    <tr key={game.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{game.title}</p>
                                            <p className="text-white/30 text-xs mt-0.5 truncate max-w-xs">{game.url}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-white/50">
                                            {game.creator?.name ?? '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePublish(game)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors
                                                    ${game.published
                                                        ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                                        : 'bg-white/10 text-white/40 hover:bg-white/15'
                                                    }`}
                                            >
                                                {game.published ? '● Publicado' : '○ Oculto'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.games.preview', game.id)}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                >
                                                    Vista previa
                                                </Link>
                                                <Link
                                                    href={route('admin.games.edit', game.id)}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-[#7c6af7]/15 hover:bg-[#7c6af7]/25 text-[#7c6af7] transition-colors"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => destroy(game)}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {games.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {games.links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors
                                        ${link.active
                                            ? 'bg-[#7c6af7] text-white'
                                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                                        }`}
                                />
                            ) : (
                                <span
                                    key={i}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-3 py-1.5 text-xs text-white/20"
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}