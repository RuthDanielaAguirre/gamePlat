<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'published',
        'url',
        'thumbnail',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    // ─── Relaciones ────────────────────────────────────────
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }

    // ─── Scopes ────────────────────────────────────────────
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}