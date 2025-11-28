<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Candidat;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;

class CandidatController extends Controller
{
    // 🔥 Ajouter un candidat (LOGIQUE IDENTIQUE À EMPLOYÉ)
    public function store(Request $request)
    {
        $request->validate([
            'cin' => 'required|unique:personnes,cin',
            'email' => 'required|email|unique:personnes,email',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'motdepasse' => 'required|min:6',
            'ville' => 'required',
            'cv' => 'nullable|string',
            'motivation' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            // 1️⃣ Créer adresse
            $adresse = Adresse::create([
                'ville' => $request->ville
            ]);

            // 2️⃣ Créer personne
            $personne = Personne::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'password' => $request->motdepasse, // ✅ PLAIN TEXT, comme tu veux
                'cin' => $request->cin,
                'id_adresse' => $adresse->id_adresse,
            ]);

            // 3️⃣ Créer candidat
            $candidat = Candidat::create([
                'id_personne' => $personne->id_personne,
                'cv' => $request->cv,
                'motivation' => $request->motivation
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Candidat ajouté avec succès',
                'personne' => $personne,
                'candidat' => $candidat
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erreur lors de l’ajout du candidat',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Récupérer un candidat par son id
    public function show($id)
{
    try {
        // Charger le candidat avec sa personne et l'adresse
        $candidat = Candidat::with(['personne', 'personne.adresse'])->findOrFail($id);

        // Retourner les infos "plates" pour React
        return response()->json([
            'id_candidat' => $candidat->id_candidat,
            'cin'        => $candidat->personne->cin,
            'nom'        => $candidat->personne->nom,
            'prenom'     => $candidat->personne->prenom,
            'email'      => $candidat->personne->email,
            'ville'      => $candidat->personne->adresse->ville ?? '',
            'cv'         => $candidat->cv,
            'motivation'     => $candidat->motivation
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Impossible de récupérer le candidat',
            'message' => $e->getMessage()
        ], 500);
    }
}

}