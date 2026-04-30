import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#0f0f14] flex flex-col items-center justify-center text-white">
            {/* Logo */}
            <div className="mb-8 text-center">
                <h1 className="text-6xl font-bold tracking-tight">
                    <span className="text-[#7c6af7]">Game</span>Plat
                </h1>
                <p className="mt-3 text-white/40 text-lg">Tu plataforma de juegos</p>
            </div>

            {/* Cards de juegos decorativas */}
            <div className="flex gap-4 mb-12 opacity-30">
                {['🎮', '🕹️', '👾'].map((emoji, i) => (
                    <div key={i} className="w-24 h-32 bg-[#16161f] border border-white/10 rounded-2xl flex items-center justify-center text-4xl"
                        style={{ transform: `rotate(${(i - 1) * 5}deg)` }}>
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
                <Link
                    href="/login"
                    className="px-8 py-3 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white font-medium rounded-xl transition-colors"
                >
                    Iniciar sesión
                </Link>
                <Link
                    href="/register"
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl border border-white/10 transition-colors"
                >
                    Registrarse
                </Link>
            </div>

            <p className="mt-12 text-white/20 text-sm">
                Módulo 0613 · Desarrollo Web en Entorno Servidor
            </p>
        </div>
    );
}
