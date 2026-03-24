<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = ['name', 'label'];

    // Constantes para evitar strings mágicos en el código
    const ADMIN   = 'administrador';
    const GESTOR  = 'gestor';
    const JUGADOR = 'jugador';

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}