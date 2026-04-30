<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\FacialEnrollment;
use App\Services\FacialService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FacialController extends Controller
{
    public function __construct(private FacialService $facial) {}

    // ─── Enrolamiento ───────────────────────────────────────

    // GET /security — página para registrar la foto
    public function enrollForm(): Response
    {
        $user = request()->user();
        $enrolled = FacialEnrollment::where('user_id', $user->id)->exists();

        return Inertia::render('Security/Enroll', [
            'already_enrolled' => $enrolled,
        ]);
    }

    // POST /security/enroll — guarda la imagen (Laravel NO la analiza)
    public function enroll(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // base64 desde la webcam
        ]);

        $user = $request->user();

        // Decodificar base64 y guardar en storage privado
        $base64 = $request->image;
        if (str_contains($base64, ',')) {
            [, $base64] = explode(',', $base64, 2);
        }

        $path = "faces/{$user->id}.jpg";
        Storage::disk('local')->put($path, base64_decode($base64));

        // Guardar o actualizar el registro
        FacialEnrollment::updateOrCreate(
            ['user_id' => $user->id],
            ['image_path' => $path]
        );

        return back()->with('success', 'Imagen facial registrada correctamente.');
    }

    // ─── Verificación ───────────────────────────────────────

    // GET /verify-face — página de verificación con webcam
    public function verifyForm(): Response
    {
        return Inertia::render('Security/Verify');
    }

    // POST /verify-face — Laravel envía ambas imágenes al microservicio y decide
    public function verify(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // base64 desde la webcam
        ]);

        $user = $request->user();

        // Comprobar que el usuario tiene foto registrada
        $enrollment = FacialEnrollment::where('user_id', $user->id)->first();
        if (!$enrollment) {
            return back()->with('error', 'No tienes ninguna imagen facial registrada.');
        }

        $enrolledPath = Storage::disk('local')->path($enrollment->image_path);

        // Laravel llama al microservicio — nunca el navegador directamente
        $result = $this->facial->verify($enrolledPath, $request->image);

        if (!empty($result['error'])) {
            return back()->with('error', 'El servicio facial no está disponible: ' . $result['error']);
        }

        // Laravel decide — umbral de confianza configurable
        $threshold = config('services.facial.threshold', 0.6);

        if ($result['match'] && $result['confidence'] >= $threshold) {
            // Marcar la sesión como verificada facialmente
            session(['face_verified' => true]);
            return redirect()->route('player.games')
                ->with('success', 'Identidad verificada correctamente.');
        }

        return back()->with('error', 'No se pudo verificar tu identidad. Inténtalo de nuevo.');
    }
}