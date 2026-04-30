<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmotionEvent;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmotionController extends Controller
{
    /**
     * POST /api/emotions
     *
     * Recibe datos abstractos de emoción desde el cliente.
     * NO recibe imágenes ni datos biométricos.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'session_id'  => 'required|exists:game_sessions,id',
            'emotion'     => 'required|string|in:neutral,happy,sad,angry,surprised,fearful,disgusted',
            'confidence'  => 'required|numeric|min:0|max:1',
            'elapsed_ms'  => 'required|integer|min:0',
        ]);

        // Verificar que la sesión pertenece al usuario autenticado
        $session = GameSession::where('id', $request->session_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        EmotionEvent::create([
            'game_session_id' => $session->id,
            'emotion'         => $request->emotion,
            'confidence'      => $request->confidence,
            'elapsed_ms'      => $request->elapsed_ms,
            'recorded_at'     => now(),
        ]);

        return response()->json(['status' => 'ok'], 201);
    }

    /**
     * GET /api/emotions/{session}
     * Historial de emociones de una sesión
     */
    public function index(Request $request, GameSession $session): JsonResponse
    {
        // Solo el dueño puede ver sus emociones
        if ($session->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $events = EmotionEvent::where('game_session_id', $session->id)
            ->orderBy('elapsed_ms')
            ->get(['emotion', 'confidence', 'elapsed_ms', 'recorded_at']);

        return response()->json(['data' => $events]);
    }
}