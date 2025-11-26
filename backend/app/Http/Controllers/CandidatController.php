<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Candidat;
use Illuminate\Support\Facades\Hash;

class CandidatController extends Controller
{
    public function registerCandidat(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:personnes,email',
            'motdepasse' => 'required|string|min:6',
            'cin' => 'required|string|unique:personnes,cin',
            'cv' => 'required|file|mimes:pdf',
            'lettre' => 'required|file|mimes:pdf',
        ]);

        // ✅ 1. CRÉER LA PERSONNE (AVEC MOT DE PASSE HASHÉ)
        $personne = Personne::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->motdepasse),
// ✅ HASH OBLIGATOIRE
            'cin' => $request->cin,
        ]);

        // ✅ 2. ENREGISTRER LES FICHIERS DANS PUBLIC/UPLOADS
        $cvName = time().'_'.$request->file('cv')->getClientOriginalName();
        $request->file('cv')->move(public_path('uploads'), $cvName);

        $lettreName = time().'_'.$request->file('lettre')->getClientOriginalName();
        $request->file('lettre')->move(public_path('uploads'), $lettreName);

        // ✅ 3. CRÉER LE CANDIDAT
        Candidat::create([
            'id_personne' => $personne->id_personne,
            'cv' => $cvName,
            'motivation' => $lettreName, // ✅ correspond à ta table
        ]);

        return response()->json([
            'message' => 'Candidat ajouté avec succès'
        ], 201);
    }
}
