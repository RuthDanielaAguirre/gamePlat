import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Flash from '@/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';

export default function UsersIndex({ users }) {

    function destroy(user) {
        if (!confirm(`¿Eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`)) return;
        router.delete(route('admin.users.destroy', user.id));
    }

    const roleBadge = {
        administrador: 'bg-[#7c6af7]/15 text-[#7c6af7]',
        gestor:        'bg-sky-500/15 text-sky-400',
        jugador:       'bg-emerald-500/15 text-emerald-400',
    };

    return (
        <AuthenticatedLayout header="Usuarios">
            <Head title="Usuarios" />
            <Flash />

            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Usuarios del sistema</h2>
                    <p className="text-sm text-white/40 mt-0.5">{users.total} usuario(s) registrado(s)</p>
                </div>

                <div className="bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Nombre</th>
                                <th className="text-left px-6 py-4 hidden sm:table-cell">Email</th>
                                <th className="text-left px-6 py-4">Rol</th>
                                <th className="text-right px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.data.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#7c6af7]/20 flex items-center justify-center text-sm font-bold text-[#7c6af7]">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <span className="font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-white/50">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                                            ${roleBadge[user.role?.name] ?? 'bg-white/10 text-white/30'}`}>
                                            {user.role?.label ?? 'Sin rol'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="px-3 py-1.5 text-xs rounded-lg bg-[#7c6af7]/15 hover:bg-[#7c6af7]/25 text-[#7c6af7] transition-colors"
                                            >
                                                Cambiar rol
                                            </Link>
                                            <button
                                                onClick={() => destroy(user)}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}