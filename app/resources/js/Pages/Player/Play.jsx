import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Play({ game }) {
    const { auth } = usePage().props;
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | playing | ended | error
    const startedRef = useRef(false);

    // Obtener el CSRF token de la cookie para las llamadas fetch a la API
    function getCsrf() {
        return document.cookie.split('; ')
            .find(r => r.startsWith('XSRF-TOKEN='))
            ?.split('=')[1]?.replace(/%3D/g, '=') ?? '';
    }

    async function startSession() {
        if (startedRef.current) return;
        startedRef.current = true;
        setStatus('loading');

        try {
            const res = await fetch('/api/sessions/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(getCsrf()),
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ game_id: game.id }),
            });

            if (!res.ok) throw new Error('No se pudo iniciar la sesión.');
            const data = await res.json();
            setSessionId(data.session_id);
            setStatus('playing');
        } catch (err) {
            setStatus('error');
            console.error(err);
        }
    }

    async function endSession(result = null) {
        if (!sessionId) return;
        setStatus('ended');

        await fetch(`/api/sessions/${sessionId}/end`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(getCsrf()),
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ result }),
        }).catch(console.error);
    }

    // Escuchar mensajes del iframe (el juego se comunica via postMessage)
    useEffect(() => {
        function handleMessage(e) {
            if (!e.data?.type) return;
            if (e.data.type === 'GAME_READY') startSession();
            if (e.data.type === 'GAME_OVER')  endSession(e.data.result ?? null);
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [sessionId]);

    return (
        <AuthenticatedLayout header={game.title}>
            <Head title={game.title} />

            <div className="max-w-5xl mx-auto space-y-4">
                {/* Barra superior */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('player.games')}
                        className="text-white/30 hover:text-white/70 text-sm transition-colors"
                    >
                        ← Volver a juegos
                    </Link>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        {status === 'playing' && (
                            <button
                                onClick={() => endSession()}
                                className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                                Terminar partida
                            </button>
                        )}
                    </div>
                </div>

                {/* Iframe */}
                <div className="bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
                    {status === 'error' ? (
                        <div className="flex items-center justify-center h-96 text-white/30 flex-col gap-3">
                            <span className="text-4xl">⚠️</span>
                            <p>No se pudo iniciar la sesión. Intenta de nuevo.</p>
                            <button
                                onClick={() => { startedRef.current = false; startSession(); }}
                                className="mt-2 px-4 py-2 bg-[#7c6af7] text-white text-sm rounded-lg"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <iframe
                            src={game.url}
                            title={game.title}
                            className="w-full"
                            style={{ height: '75vh', border: 'none' }}
                            allow="camera; microphone"
                            onLoad={startSession}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    )}
                </div>

                {sessionId && (
                    <p className="text-xs text-white/20 text-center font-mono">
                        Sesión: {sessionId}
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function StatusBadge({ status }) {
    const map = {
        idle:    ['bg-white/10 text-white/30',         '○ Sin iniciar'],
        loading: ['bg-yellow-500/15 text-yellow-400',  '◌ Iniciando…'],
        playing: ['bg-emerald-500/15 text-emerald-400','● En juego'],
        ended:   ['bg-white/10 text-white/40',         '✓ Terminado'],
        error:   ['bg-red-500/15 text-red-400',        '✕ Error'],
    };
    const [cls, label] = map[status] ?? map.idle;
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
    );
}