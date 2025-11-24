<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Admin;
use App\Models\Employe;
use App\Models\Candidat;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Récupérer email et password sans espaces
        $email = trim($request->email);
        $password = trim($request->password);

        // Vérifier si l'utilisateur existe
        $personne = Personne::where('email', $email)->first();

        if (!$personne) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Vérification du mot de passe en clair (pas de hash)
        if ($password !== $personne->password) {
            return response()->json([
                'message' => 'Mot de passe incorrect'
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

        // Génération d’un token simple (non obligatoire)
        $token = Str::random(60);

        // Réponse envoyée pour React
        return response()->json([
            'id_personne' => $personne->id_personne,
            'nom' => $personne->nom,
            'prenom' => $personne->prenom,
            'email' => $personne->email,
            'role' => $role,
            'token' => $token
        ], 200);
    }
}
