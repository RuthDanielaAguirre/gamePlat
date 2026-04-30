#!/bin/bash
echo "🚀 Levantando GamePlat..."

cd ~/Documents/gameplat

# Docker (db + pgadmin)
docker compose up -d
echo "✅ Docker arriba"

cd app

# Laravel
php artisan serve &
echo "✅ Laravel en :8000"

# Reverb
php artisan reverb:start --port=9000 &
echo "✅ Reverb en :9000"

# Queue
php artisan queue:work &
echo "✅ Queue worker"

# Vite (foreground)
pnpm run dev
