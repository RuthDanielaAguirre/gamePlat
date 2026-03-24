import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function GameList({ games }) {
    return (
        <AuthenticatedLayout header="Juegos disponibles">
            <Head title="Jugar" />

            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Elige un juego</h2>
                    <p className="text-sm text-white/40 mt-1">{games.length} juego(s) disponible(s)</p>
                </div>

                {games.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <p className="text-5xl mb-4">🎮</p>
                        <p className="text-lg">No hay juegos disponibles en este momento.</p>
                        <p className="text-sm mt-1">Vuelve más tarde.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {games.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function GameCard({ game }) {
    return (
        <div className="group bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#7c6af7]/30 transition-all duration-200">
            {/* Thumbnail / placeholder */}
            <div className="h-40 bg-gradient-to-br from-[#7c6af7]/20 to-[#4f3fbf]/10 flex items-center justify-center">
                {game.thumbnail
                    ? <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                    : <span className="text-5xl opacity-40">🎮</span>
                }
            </div>

            <div className="p-5 space-y-3">
                <h3 className="font-semibold text-white group-hover:text-[#a095f7] transition-colors">
                    {game.title}
                </h3>
                {game.description && (
                    <p className="text-sm text-white/40 line-clamp-2">{game.description}</p>
                )}
                <Link
                    href={route('player.play', game.id)}
                    className="block text-center w-full py-2 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Jugar →
                </Link>
            </div>
        </div>
    );
}