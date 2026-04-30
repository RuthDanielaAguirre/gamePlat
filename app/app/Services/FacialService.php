<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * FacialService
 *
 * Laravel NO analiza imágenes. Solo coordina.
 * La decisión final siempre la toma Laravel, nunca el microservicio.
 *
 * En .env:
 *   FACIAL_SERVICE_URL=http://localhost:5001
 */
class FacialService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.facial.url', 'http://localhost:5001'), '/');
    }

    /**
     * Verifica si dos imágenes corresponden a la misma persona.
     *
     * @param string $enrolledPath  Ruta absoluta de la imagen registrada
     * @param string $liveData      Base64 o ruta de la imagen en vivo
     * @return array{match: bool, distance: float, confidence: float, error?: string}
     */
    public function verify(string $enrolledPath, string $liveData): array
    {
        try {
            $livePath = $this->resolveBase64($liveData);

            $response = Http::timeout(15)
                ->attach('enrolled_image', file_get_contents($enrolledPath), 'enrolled.jpg')
                ->attach('live_image',     file_get_contents($livePath),     'live.jpg')
                ->post("{$this->baseUrl}/verify");

            if ($livePath !== $liveData && file_exists($livePath)) {
                unlink($livePath);
            }

            if ($response->failed()) {
                Log::warning('FacialService: respuesta fallida', ['status' => $response->status()]);
                return $this->errorResult('El servicio facial devolvió un error.');
            }

            return $response->json();

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('FacialService: no se puede conectar', ['error' => $e->getMessage()]);
            return $this->errorResult('No se pudo conectar con el servicio facial.');
        } catch (\Throwable $e) {
            Log::error('FacialService: error inesperado', ['error' => $e->getMessage()]);
            return $this->errorResult('Error inesperado en el servicio facial.');
        }
    }

    public function isAvailable(): bool
    {
        try {
            return Http::timeout(3)->get("{$this->baseUrl}/health")->successful();
        } catch (\Throwable) {
            return false;
        }
    }

    private function resolveBase64(string $data): string
    {
        if (str_starts_with($data, 'data:image')) {
            [, $base64] = explode(',', $data, 2);
            $tmp = tempnam(sys_get_temp_dir(), 'face_') . '.jpg';
            file_put_contents($tmp, base64_decode($base64));
            return $tmp;
        }
        return $data;
    }

    private function errorResult(string $message): array
    {
        return ['match' => false, 'distance' => 1.0, 'confidence' => 0.0, 'error' => $message];
    }
}