<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameApiController extends Controller
{
    // GET /api/games — lista de juegos publicados (para el cliente)
    public function index(): JsonResponse
    {
        $games = Game::published()
            ->select('id', 'title', 'description', 'thumbnail', 'url')
            ->latest()
            ->get();

        return response()->json(['data' => $games]);
    }

    // GET /api/games/{id}
    public function show(Game $game): JsonResponse
    {
        abort_unless($game->published, 404);

        return response()->json(['data' => $game->only('id', 'title', 'description', 'url')]);
    }

    // POST /api/sessions/start — el juego inicia una partida
    public function startSession(Request $request): JsonResponse
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
        ]);

        $game = Game::findOrFail($request->game_id);

        // El juego debe estar publicado
        if (!$game->published) {
            return response()->json(['message' => 'Juego no disponible.'], 403);
        }

        $session = GameSession::create([
            'user_id'    => $request->user()->id,
            'game_id'    => $game->id,
            'started_at' => now(),
            'status'     => 'active',
        ]);

        return response()->json([
            'session_id' => $session->id,
            'started_at' => $session->started_at,
        ], 201);
    }

    // POST /api/sessions/{session}/end — el juego termina la partida
    public function endSession(Request $request, GameSession $session): JsonResponse
    {
        // Solo el dueño puede cerrar su sesión
        if ($session->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'result' => 'nullable|array',
        ]);

        $endedAt = now();
        $duration = $session->started_at
            ? (int) $session->started_at->diffInSeconds($endedAt)
            : null;

        $session->update([
            'ended_at'         => $endedAt,
            'duration_seconds' => $duration,
            'result'           => $request->result,
            'status'           => 'completed',
        ]);

        return response()->json([
            'session_id'       => $session->id,
            'duration_seconds' => $duration,
            'result'           => $session->result,
        ]);
    }

    // GET /api/sessions — historial del jugador autenticado
    public function mySessions(Request $request): JsonResponse
    {
        $sessions = $request->user()
            ->gameSessions()
            ->with('game:id,title')
            ->latest()
            ->paginate(20);

        return response()->json($sessions);
    }
}