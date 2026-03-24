<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    // Lista de juegos publicados para el jugador
    public function index(): Response
    {
        $games = Game::published()
            ->select('id', 'title', 'description', 'thumbnail', 'url')
            ->latest()
            ->get();

        return Inertia::render('Player/GameList', [
            'games' => $games,
        ]);
    }

    // Carga el juego dentro del contexto de la plataforma
    public function play(Game $game): Response
    {
        // Solo juegos publicados
        abort_unless($game->published, 404);

        return Inertia::render('Player/Play', [
            'game' => $game->only('id', 'title', 'description', 'url'),
        ]);
    }

    // Resultados del jugador autenticado
    public function results(Request $request): Response
    {
        $sessions = $request->user()
            ->gameSessions()
            ->with('game:id,title')
            ->latest()
            ->paginate(20);

        return Inertia::render('Player/Results', [
            'sessions' => $sessions,
        ]);
    }
}