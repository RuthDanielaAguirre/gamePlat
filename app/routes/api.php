<?php

use App\Http\Controllers\Api\GameApiController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Middleware\CheckRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user()->load('role');
    });

    Route::get('/games',        [GameApiController::class, 'index']);
    Route::get('/games/{game}', [GameApiController::class, 'show']);

    Route::middleware([CheckRole::class . ':jugador'])->group(function () {
        Route::post('/sessions/start',         [GameApiController::class, 'startSession']);
        Route::post('/sessions/{session}/end', [GameApiController::class, 'endSession']);
        Route::get('/sessions',                [GameApiController::class, 'mySessions']);
    });

    Route::get('/chat/{gameId?}',  [MessageController::class, 'index']);
    Route::post('/chat',           [MessageController::class, 'store']);
});
