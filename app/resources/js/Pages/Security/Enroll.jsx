import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Flash from '@/Components/Flash';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Enroll({ already_enrolled }) {
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming]   = useState(false);
    const [captured, setCaptured]     = useState(null); // base64
    const [saving, setSaving]         = useState(false);

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreaming(true);
        } catch {
            alert('No se pudo acceder a la cámara.');
        }
    }

    function capture() {
        const canvas = canvasRef.current;
        const video  = videoRef.current;
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        setCaptured(canvas.toDataURL('image/jpeg'));
        // Parar cámara
        video.srcObject?.getTracks().forEach(t => t.stop());
        setStreaming(false);
    }

    function retake() {
        setCaptured(null);
        startCamera();
    }

    function save() {
        if (!captured) return;
        setSaving(true);
        router.post(route('security.enroll.store'), { image: captured }, {
            onFinish: () => setSaving(false),
        });
    }

    return (
        <AuthenticatedLayout header="Seguridad facial">
            <Head title="Enrolamiento facial" />
            <Flash />

            <div className="max-w-lg mx-auto space-y-6">
                <div className="bg-[#16161f] border border-white/5 rounded-2xl p-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar imagen facial</h2>
                        <p className="text-sm text-white/40 mt-1">
                            Tu imagen se guarda de forma privada y se usa solo para verificar tu identidad.
                            {already_enrolled && <span className="text-yellow-400 ml-1">Ya tienes una imagen registrada. Puedes actualizarla.</span>}
                        </p>
                    </div>

                    {/* Cámara / captura */}
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                        {!streaming && !captured && (
                            <button
                                onClick={startCamera}
                                className="px-6 py-3 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                📷 Activar cámara
                            </button>
                        )}
                        <video
                            ref={videoRef}
                            className={`w-full h-full object-cover ${streaming ? 'block' : 'hidden'}`}
                        />
                        {captured && (
                            <img src={captured} className="w-full h-full object-cover" alt="Captura" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        {streaming && (
                            <button
                                onClick={capture}
                                className="flex-1 py-2.5 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                📸 Capturar
                            </button>
                        )}
                        {captured && (
                            <>
                                <button
                                    onClick={retake}
                                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg transition-colors"
                                >
                                    Repetir
                                </button>
                                <button
                                    onClick={save}
                                    disabled={saving}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {saving ? 'Guardando…' : '✓ Guardar imagen'}
                                </button>
                            </>
                        )}
                    </div>

                    <p className="text-xs text-white/20 text-center">
                        Laravel guarda tu imagen de forma segura. No se procesa durante el enrolamiento.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}