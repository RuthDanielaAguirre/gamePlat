import { useForm } from '@inertiajs/react';

export default function GameForm({ game = null, submitRoute, method = 'post' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title:       game?.title       ?? '',
        description: game?.description ?? '',
        url:         game?.url         ?? '',
        published:   game?.published   ?? false,
    });

    function submit(e) {
        e.preventDefault();
        if (method === 'put') {
            put(submitRoute, { preserveScroll: true });
        } else {
            post(submitRoute);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6 max-w-2xl">

            <Field label="Título" error={errors.title}>
                <input
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    placeholder="Nombre del juego"
                    className={inputCls(errors.title)}
                />
            </Field>

            <Field label="Descripción" error={errors.description}>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={4}
                    placeholder="Descripción breve del juego..."
                    className={inputCls(errors.description)}
                />
            </Field>

            <Field label="URL / Ruta del juego" error={errors.url}>
                <input
                    type="text"
                    value={data.url}
                    onChange={e => setData('url', e.target.value)}
                    placeholder="https://... o /games/mi-juego"
                    className={inputCls(errors.url)}
                />
                <p className="mt-1 text-xs text-white/30">
                    URL externa o ruta interna donde está alojado el juego.
                </p>
            </Field>

            {/* Toggle publicado */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setData('published', !data.published)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${data.published ? 'bg-[#7c6af7]' : 'bg-white/10'}`}
                >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform
                        ${data.published ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-white/70">
                    {data.published ? 'Publicado (visible para jugadores)' : 'Oculto (borrador)'}
                </span>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 bg-[#7c6af7] hover:bg-[#6b5ce7] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {processing ? 'Guardando…' : game ? 'Guardar cambios' : 'Crear juego'}
                </button>
            </div>
        </form>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">{label}</label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

function inputCls(error) {
    return `w-full px-4 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder-white/20
        focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/50 transition-all
        ${error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`;
}