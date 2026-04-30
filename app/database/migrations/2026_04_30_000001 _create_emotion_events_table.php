<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emotion_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_session_id')->constrained()->cascadeOnDelete();
            $table->string('emotion');        // neutral, happy, sad, angry, surprised
            $table->float('confidence');      // valor de confianza del modelo
            $table->integer('elapsed_ms');    // milisegundos desde el inicio de la sesión
            $table->timestamp('recorded_at');
            // NO se guardan imágenes ni datos biométricos
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emotion_events');
    }
};