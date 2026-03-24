<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ─── Relaciones ────────────────────────────────────────
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    public function gameSessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }

    // ─── Helpers de rol ────────────────────────────────────
    public function isAdmin(): bool
    {
        return $this->role?->name === Role::ADMIN;
    }

    public function isGestor(): bool
    {
        return $this->role?->name === Role::GESTOR;
    }

    public function isJugador(): bool
    {
        return $this->role?->name === Role::JUGADOR;
    }

    public function canManageGames(): bool
    {
        return $this->isAdmin() || $this->isGestor();
    }

    // ─── Accessor cómodo ───────────────────────────────────
    public function getRoleLabelAttribute(): string
    {
        return $this->role?->label ?? 'Sin rol';
    }
}