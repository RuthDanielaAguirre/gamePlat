<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // gestor que lo creó
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('published')->default(false);
            $table->string('url'); // ruta o URL del juego (puede ser externa o /games/mi-juego)
            $table->string('thumbnail')->nullable(); // imagen previa
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};