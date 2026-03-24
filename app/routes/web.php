<?php

use App\Http\Controllers\Web\GameController;
use App\Http\Controllers\Web\PlayerController;
use App\Http\Controllers\Web\UserController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = request()->user()->load('role');
        if ($user->canManageGames()) {
            return redirect()->route('admin.games.index');
        }
        return redirect()->route('player.games');
    })->name('dashboard');

    Route::middleware([CheckRole::class . ':administrador,gestor'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/games',                 [GameController::class, 'index'])->name('games.index');
            Route::get('/games/create',          [GameController::class, 'create'])->name('games.create');
            Route::post('/games',                [GameController::class, 'store'])->name('games.store');
            Route::get('/games/{game}/edit',     [GameController::class, 'edit'])->name('games.edit');
            Route::put('/games/{game}',          [GameController::class, 'update'])->name('games.update');
            Route::delete('/games/{game}',       [GameController::class, 'destroy'])->name('games.destroy');
            Route::patch('/games/{game}/toggle', [GameController::class, 'togglePublish'])->name('games.toggle');
            Route::get('/games/{game}/preview',  [GameController::class, 'preview'])->name('games.preview');
        });

    Route::middleware([CheckRole::class . ':administrador'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/users',               [UserController::class, 'index'])->name('users.index');
            Route::get('/users/{user}/edit',   [UserController::class, 'edit'])->name('users.edit');
            Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');
            Route::delete('/users/{user}',     [UserController::class, 'destroy'])->name('users.destroy');
        });

    Route::middleware([CheckRole::class . ':jugador'])
        ->prefix('player')
        ->name('player.')
        ->group(function () {
            Route::get('/games',        [PlayerController::class, 'index'])->name('games');
            Route::get('/games/{game}', [PlayerController::class, 'play'])->name('play');
            Route::get('/results',      [PlayerController::class, 'results'])->name('results');
        });
});

require __DIR__ . '/auth.php';
