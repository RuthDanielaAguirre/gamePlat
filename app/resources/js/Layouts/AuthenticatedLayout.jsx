import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user?.role?.name;
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin  = role === 'administrador';
    const isGestor = role === 'gestor';
    const canManage = isAdmin || isGestor;

    return (
        <div className="min-h-screen bg-[#0f0f14] text-white font-[family-name:var(--font-body)]">

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#16161f] border-r border-white/5 flex flex-col transform transition-transform duration-200
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-[#7c6af7]">Game</span>Plat
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

                    {canManage && (
                        <NavSection label="Gestión">
                            <NavLink href={route('admin.games.index')} icon="🎮">Juegos</NavLink>
                            {isAdmin && (
                                <NavLink href={route('admin.users.index')} icon="👥">Usuarios</NavLink>
                            )}
                        </NavSection>
                    )}

                    {role === 'jugador' && (
                        <NavSection label="Jugar">
                            <NavLink href={route('player.games')} icon="🕹️">Juegos disponibles</NavLink>
                            <NavLink href={route('player.results')} icon="📊">Mis resultados</NavLink>
                        </NavSection>
                    )}

                    <NavSection label="Mi cuenta">
                        <NavLink href={route('security.enroll')} icon="🔒">Seguridad facial</NavLink>
                    </NavSection>

                </nav>

                <div className="border-t border-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#7c6af7]/30 flex items-center justify-center text-sm font-bold text-[#7c6af7]">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-white/40 capitalize">{user?.role?.label}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-white/30 hover:text-white/70 transition-colors text-xs"
                        >
                            ↩
                        </Link>
                    </div>
                </div>
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)} />
            )}

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <header className="h-16 bg-[#0f0f14]/80 backdrop-blur border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden text-white/50 hover:text-white"
                    >☰</button>
                    {header && (
                        <h1 className="text-lg font-semibold text-white/90">{header}</h1>
                    )}
                </header>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavSection({ label, children }) {
    return (
        <div className="mb-4">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">{label}</p>
            {children}
        </div>
    );
}

function NavLink({ href, icon, children }) {
    const { url } = usePage();
    const active = url.startsWith(href.replace(window.location.origin, ''));

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${active
                    ? 'bg-[#7c6af7]/15 text-[#7c6af7]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
        >
            <span>{icon}</span>
            {children}
        </Link>
    );
}