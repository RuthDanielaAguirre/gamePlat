import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Flash from '@/Components/Flash';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Verify() {
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [captured, setCaptured]  = useState(null);
    const [verifying, setVerifying] = useState(false);

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
        video.srcObject?.getTracks().forEach(t => t.stop());
        setStreaming(false);
    }

    function retake() {
        setCaptured(null);
        startCamera();
    }

    function verify() {
        if (!captured) return;
        setVerifying(true);
        // Laravel recibe la imagen y llama al microservicio internamente
        // El navegador NUNCA habla directamente con el microservicio
        router.post(route('security.verify.store'), { image: captured }, {
            onFinish: () => setVerifying(false),
        });
    }

    return (
        <AuthenticatedLayout header="Verificación facial">
            <Head title="Verificar identidad" />
            <Flash />

            <div className="max-w-lg mx-auto space-y-6">
                <div className="bg-[#16161f] border border-white/5 rounded-2xl p-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Verificar identidad</h2>
                        <p className="text-sm text-white/40 mt-1">
                            Captura tu imagen y Laravel verificará tu identidad comparándola con tu foto registrada.
                        </p>
                    </div>

                    {/* Flujo explicado */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/30">
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-2xl mb-1">📷</div>
                            Webcam captura imagen
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-2xl mb-1">⚙️</div>
                            Laravel + DeepFace comparan
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-2xl mb-1">✅</div>
                            Laravel decide el acceso
                        </div>
                    </div>

                    {/* Cámara */}
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                        {!streaming && !captured && (
                            <button
                                onClick={startCamera}
                                className="px-6 py-3 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white rounded-lg text-sm font-medium"
                            >
                                📷 Activar cámara
                            </button>
                        )}
                        <video ref={videoRef} className={`w-full h-full object-cover ${streaming ? 'block' : 'hidden'}`} />
                        {captured && <img src={captured} className="w-full h-full object-cover" alt="Captura" />}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        {streaming && (
                            <button onClick={capture} className="flex-1 py-2.5 bg-[#7c6af7] hover:bg-[#6b5ce7] text-white text-sm font-medium rounded-lg transition-colors">
                                📸 Capturar
                            </button>
                        )}
                        {captured && (
                            <>
                                <button onClick={retake} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg transition-colors">
                                    Repetir
                                </button>
                                <button onClick={verify} disabled={verifying} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                                    {verifying ? 'Verificando…' : '🔍 Verificar'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}