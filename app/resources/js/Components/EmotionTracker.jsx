import { useEffect, useRef, useState } from 'react';

/**
 * EmotionTracker
 *
 * - Detección de emociones EN EL NAVEGADOR con face-api.js
 * - NO envía imágenes ni vídeo al servidor
 * - Solo envía datos abstractos: { emotion, confidence, elapsed_ms }
 * - Se asocia siempre a una sesión de juego concreta
 *
 * Uso: <EmotionTracker sessionId={sessionId} startedAt={Date.now()} />
 */
export default function EmotionTracker({ sessionId, startedAt, onEmotion }) {
    const videoRef    = useRef(null);
    const intervalRef = useRef(null);
    const [faceApiLoaded, setFaceApiLoaded] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [cameraActive, setCameraActive]     = useState(false);

    const INTERVAL_MS = 3000; // analizar cada 3 segundos

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ')
                .find(r => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? ''
        );
    }

    // Cargar face-api.js desde CDN
    useEffect(() => {
        if (window.faceapi) { setFaceApiLoaded(true); return; }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
        script.onload = async () => {
            // Cargar modelos desde CDN
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
            try {
                await Promise.all([
                    window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                setFaceApiLoaded(true);
            } catch (e) {
                console.warn('EmotionTracker: no se pudieron cargar los modelos', e);
            }
        };
        document.head.appendChild(script);
    }, []);

    // Arrancar cámara cuando los modelos estén listos y haya sesión
    useEffect(() => {
        if (!faceApiLoaded || !sessionId) return;

        navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setCameraActive(true);
                }
            })
            .catch(() => console.warn('EmotionTracker: cámara no disponible'));

        return () => {
            videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
            clearInterval(intervalRef.current);
        };
    }, [faceApiLoaded, sessionId]);

    // Analizar emociones periódicamente
    useEffect(() => {
        if (!cameraActive || !sessionId) return;

        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || !window.faceapi) return;

            try {
                const detection = await window.faceapi
                    .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (!detection) return;

                // Encontrar la emoción dominante
                const expressions = detection.expressions;
                const dominant = Object.entries(expressions)
                    .reduce((a, b) => a[1] > b[1] ? a : b);

                const emotion    = dominant[0];
                const confidence = parseFloat(dominant[1].toFixed(4));
                const elapsed_ms = Date.now() - startedAt;

                setCurrentEmotion({ emotion, confidence });
                if (onEmotion) onEmotion({ emotion, confidence });

                // Enviar a Laravel — solo datos abstractos, NO imágenes
                await fetch('/api/emotions', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCsrf(),
                    },
                    body: JSON.stringify({ session_id: sessionId, emotion, confidence, elapsed_ms }),
                }).catch(() => {}); // silenciar errores de red

            } catch (e) {
                // Silenciar errores de detección
            }
        }, INTERVAL_MS);

        return () => clearInterval(intervalRef.current);
    }, [cameraActive, sessionId, startedAt]);

    const EMOTION_EMOJI = {
        happy:     '😊',
        sad:       '😢',
        angry:     '😠',
        surprised: '😲',
        fearful:   '😨',
        disgusted: '🤢',
        neutral:   '😐',
    };

    return (
        <div className="space-y-2">
            {/* Vídeo oculto — solo para análisis local */}
            <video
                ref={videoRef}
                className="hidden"
                muted
                playsInline
                width={320}
                height={240}
            />

            {/* Indicador de emoción actual */}
            {cameraActive && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <span className="text-lg">
                        {currentEmotion ? EMOTION_EMOJI[currentEmotion.emotion] ?? '😐' : '⏳'}
                    </span>
                    <div>
                        <p className="text-xs text-white/60 capitalize">
                            {currentEmotion ? currentEmotion.emotion : 'Detectando…'}
                        </p>
                        {currentEmotion && (
                            <p className="text-[10px] text-white/30">
                                {Math.round(currentEmotion.confidence * 100)}% confianza
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!faceApiLoaded && (
                <p className="text-[10px] text-white/20">Cargando detector de emociones…</p>
            )}
        </div>
    );
}