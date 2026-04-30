<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        $this->message->load('user');
    }

    public function broadcastOn(): array
    {
        // Canal por juego — solo jugadores de ese juego lo reciben
        $channel = $this->message->game_id
            ? 'chat.game.' . $this->message->game_id
            : 'chat.general';

        return [new Channel($channel)];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
