<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // GET /api/chat/{gameId?} — historial de mensajes
    public function index(Request $request, ?int $gameId = null): JsonResponse
    {
        $messages = Message::with('user:id,name')
            ->where('game_id', $gameId)
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json(['data' => $messages]);
    }

    // POST /api/chat — enviar mensaje
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:500',
            'game_id' => 'nullable|exists:games,id',
        ]);

        $message = Message::create([
            'user_id' => $request->user()->id,
            'game_id' => $request->game_id,
            'content' => $request->content,
        ]);

        $message->load('user:id,name');

        // Dispara el evento por WebSocket
        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['data' => $message], 201);
    }
}
