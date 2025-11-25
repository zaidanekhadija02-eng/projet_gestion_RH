<?php 

 namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Admin;
use App\Models\Employe;
use App\Models\Candidat;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Login standard
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $email = trim($request->email);
        $password = trim($request->password);

        // Debug: Log ce qu'on cherche
        Log::info('Login attempt', [
            'email' => $email,
            'password' => $password
        ]);

        $personne = Personne::where('email', $email)->first();

        if (!$personne) {
            Log::warning('User not found', ['email' => $email]);
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Debug: Log ce qu'on a trouvé
        Log::info('User found', [
            'db_email' => $personne->email,
            'db_password' => $personne->password,
            'password_match' => ($password === $personne->password)
        ]);

        // Vérification mot de passe (plain text)
        if (trim($password) !== trim($personne->password)) {
    return response()->json([
        'message' => 'Email ou mot de passe incorrect'
    ], 401);
}

        // Déterminer le rôle
        if (Admin::where('id_personne', $personne->id_personne)->exists()) {
            $role = 'admin';
        } else if (Employe::where('id_personne', $personne->id_personne)->exists()) {
            $role = 'employe';
        } else if (Candidat::where('id_personne', $personne->id_personne)->exists()) {
            $role = 'candidat';
        } else {
            $role = 'inconnu';
        }

        $token = Str::random(60);

        Log::info('Login successful', [
            'user_id' => $personne->id_personne,
            'role' => $role
        ]);

        return response()->json([
            'id_personne' => $personne->id_personne,
            'nom' => $personne->nom,
            'prenom' => $personne->prenom,
            'email' => $personne->email,
            'role' => $role,
            'token' => $token
        ]);
    }

    /**
     * Générer et envoyer OTP
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $personne = Personne::where('email', $request->email)->first();

        if (!$personne) {
            return response()->json([
                'message' => 'Aucun utilisateur trouvé avec cet email'
            ], 404);
        }

        // Générer OTP 6 chiffres
        $otp = rand(100000, 999999);
        
        // Sauvegarder OTP et expiration (5 minutes)
        $personne->OTP = $otp;
        $personne->OTP_expiry = now()->addMinutes(5);
        $personne->save();

        Log::info('OTP generated', [
            'email' => $personne->email,
            'otp' => $otp
        ]);

        // ⚠ POUR PROJET SCOLAIRE: On retourne l'OTP directement
        return response()->json([
            'message' => 'OTP généré avec succès',
            'otp' => $otp,
            'expires_at' => $personne->OTP_expiry
        ]);
    }

    /**
     * Vérifier OTP
     */
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric|digits:6'
        ]);

        $personne = Personne::where('email', $request->email)->first();

        if (!$personne) {
            return response()->json([
                'message' => 'Email introuvable'
            ], 404);
        }

        // Vérifier si OTP existe
        if (!$personne->OTP) {
            return response()->json([
                'message' => 'Aucun OTP généré pour cet email'
            ], 400);
        }

        // Vérifier si OTP est expiré
        if (now()->greaterThan($personne->OTP_expiry)) {
            return response()->json([
                'message' => 'OTP expiré. Demandez un nouveau code.'
            ], 400);
        }

        // Vérifier si OTP est correct
        if ((int)$personne->OTP !== (int)$request->otp) {
            Log::warning('OTP mismatch', [
                'sent' => $request->otp,
                'stored' => $personne->OTP
            ]);
            
            return response()->json([
                'message' => 'OTP incorrect'
            ], 400);
        }

        Log::info('OTP verified', ['email' => $personne->email]);

        return response()->json([
            'message' => 'OTP validé avec succès',
            'email' => $personne->email
        ]);
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric|digits:6',
            'new_password' => 'required|min:6|confirmed'
        ]);

        $personne = Personne::where('email', $request->email)->first();

        if (!$personne) {
            return response()->json([
                'message' => 'Email introuvable'
            ], 404);
        }

        // Vérifier OTP une dernière fois
        if ((int)$personne->OTP !== (int)$request->otp || now()->greaterThan($personne->OTP_expiry)) {
            return response()->json([
                'message' => 'OTP invalide ou expiré'
            ], 400);
        }

        // Mettre à jour le mot de passe
        $personne->password = $request->new_password;
        
        // Nettoyer OTP
        $personne->OTP = null;
        $personne->OTP_expiry = null;
        $personne->save();

        Log::info('Password reset successful', ['email' => $personne->email]);

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès'
        ]);
    }
}