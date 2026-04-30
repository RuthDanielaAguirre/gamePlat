import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Chat({ gameId = null }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);
    const bottomRef = useRef(null);

    const channel = gameId ? `chat.game.${gameId}` : 'chat.general';

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ')
                .find(r => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? ''
        );
    }

    // Cargar historial
    useEffect(() => {
        fetch(`/api/chat${gameId ? '/' + gameId : ''}`, {
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
        })
            .then(r => r.json())
            .then(data => setMessages(data.data ?? []));
    }, [gameId]);

    // Conectar WebSocket con Reverb
    useEffect(() => {
        if (!window.Echo) return;

        const echo = window.Echo.channel(channel)
            .listen('.message.sent', (e) => {
                setMessages(prev => [...prev, e.message]);
            });

        setConnected(true);

        return () => {
            window.Echo.leaveChannel(channel);
        };
    }, [channel]);

    // Scroll al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput('');

        // Añadir mensaje propio inmediatamente (optimistic)
        setMessages(prev => [...prev, {
            id: Date.now(),
            content,
            user: { id: auth.user.id, name: auth.user.name },
            created_at: new Date().toISOString(),
        }]);

        await fetch('/api/chat', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrf(),
            },
            body: JSON.stringify({ content, game_id: gameId }),
        });
    }

    return (
        <div className="flex flex-col h-full bg-[#16161f] border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-white/70">
                    💬 {gameId ? 'Chat del juego' : 'Chat general'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
                    {connected ? '● En vivo' : '○ Conectando...'}
                </span>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.length === 0 && (
                    <p className="text-center text-white/20 text-sm mt-8">
                        No hay mensajes aún. ¡Sé el primero!
                    </p>
                )}
                {messages.map((msg) => {
                    const isOwn = msg.user?.id === auth.user.id;
                    return (
                        <div key={msg.id} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <div className="w-7 h-7 rounded-full bg-[#7c6af7]/20 flex items-center justify-center text-xs font-bold text-[#7c6af7] shrink-0">
                                {msg.user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                <span className="text-[10px] text-white/30 mb-0.5 px-1">
                                    {isOwn ? 'Tú' : msg.user?.name}
                                </span>
                                <div className={`px-3 py-2 rounded-xl text-sm ${
                                    isOwn
                                        ? 'bg-[#7c6af7] text-white rounded-tr-none'
                                        : 'bg-white/5 text-white/80 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-white/5 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7c6af7]/50"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-4 py-2 bg-[#7c6af7] hover:bg-[#6b5ce7] disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
                >
                    →
                </button>
            </form>
        </div>
    );
}
