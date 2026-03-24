import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Flash from '@/Components/Flash';
import { Head, Link, useForm } from '@inertiajs/react';

export default function UsersEdit({ user, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        role_id: user.role_id ?? '',
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.users.updateRole', user.id));
    }

    return (
        <AuthenticatedLayout header={`Rol de ${user.name}`}>
            <Head title={`Editar rol — ${user.name}`} />
            <Flash />

            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.users.index')}
                        className="text-white/30 hover:text-white/70 text-sm transition-colors"
                    >
                        ← Volver
                    </Link>
                </div>

                <div className="bg-[#16161f] border border-white/5 rounded-2xl p-8 space-y-6">
                    {/* User info */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#7c6af7]/20 flex items-center justify-center text-xl font-bold text-[#7c6af7]">
                            {user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-sm text-white/40">{user.email}</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/70">Rol asignado</label>
                            <div className="space-y-2">
                                {roles.map(role => (
                                    <label key={role.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                                        ${data.role_id == role.id
                                            ? 'border-[#7c6af7]/50 bg-[#7c6af7]/10'
                                            : 'border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role_id"
                                            value={role.id}
                                            checked={data.role_id == role.id}
                                            onChange={() => setData('role_id', role.id)}
                                            className="accent-[#7c6af7]"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">{role.label}</p>
                                            <p className="text-xs text-white/30 capitalize">{role.name}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.role_id && <p className="text-xs text-red-400">{errors.role_id}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-[#7c6af7] hover:bg-[#6b5ce7] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Guardando…' : 'Guardar rol'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}