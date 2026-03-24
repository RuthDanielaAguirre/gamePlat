<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    // ─── Panel de gestión: lista de juegos ─────────────────
    public function index(): Response
    {
        $games = Game::with('creator')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Games/Index', [
            'games' => $games,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Games/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'url'         => 'required|string|max:500',
            'published'   => 'boolean',
        ]);

        $game = $request->user()->games()->create($validated);

        return redirect()
            ->route('admin.games.index')
            ->with('success', "Juego \"{$game->title}\" creado.");
    }

    public function edit(Game $game): Response
    {
        return Inertia::render('Admin/Games/Edit', [
            'game' => $game,
        ]);
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'url'         => 'required|string|max:500',
            'published'   => 'boolean',
        ]);

        $game->update($validated);

        return redirect()
            ->route('admin.games.index')
            ->with('success', 'Juego actualizado.');
    }

    public function destroy(Game $game)
    {
        $game->delete();

        return redirect()
            ->route('admin.games.index')
            ->with('success', 'Juego eliminado.');
    }

    // Publicar / despublicar rápido
    public function togglePublish(Game $game)
    {
        $game->update(['published' => !$game->published]);
        $msg = $game->published ? 'Juego publicado.' : 'Juego despublicado.';

        return back()->with('success', $msg);
    }

    // Preview del juego dentro del panel
    public function preview(Game $game): Response
    {
        return Inertia::render('Admin/Games/Preview', [
            'game' => $game,
        ]);
    }
}