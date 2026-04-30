<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facial_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('image_path'); // storage/app/private/faces/{user_id}.jpg
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facial_enrollments');
    }
};