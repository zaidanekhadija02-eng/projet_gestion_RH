<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Candidat;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;

class CandidatController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cin' => 'required|unique:personnes,cin',          // ✅ FIXED: personnes (plural)
            'email' => 'required|email|unique:personnes,email', // ✅ FIXED: personnes (plural)
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'motdepasse' => 'required|min:6',
            'ville' => 'nullable|string',
            'cv' => 'required|file|mimes:pdf|max:2048',
            'lettre' => 'required|file|mimes:pdf|max:2048'
        ]);

        DB::beginTransaction();

        try {
            // 1️⃣ Upload CV
            $cvPath = null;
            if ($request->hasFile('cv')) {
                $cvFile = $request->file('cv');
                $cvName = time() . '_cv_' . $cvFile->getClientOriginalName();
                $cvFile->move(public_path('uploads'), $cvName);
                $cvPath = $cvName;
            }

            // 2️⃣ Upload Lettre de motivation
            $lettrePath = null;
            if ($request->hasFile('lettre')) {
                $lettreFile = $request->file('lettre');
                $lettreName = time() . '_lettre_' . $lettreFile->getClientOriginalName();
                $lettreFile->move(public_path('uploads'), $lettreName);
                $lettrePath = $lettreName;
            }

            // 3️⃣ Créer adresse
            $adresse = Adresse::create([
                'ville' => $request->ville ?? ''
            ]);

            // 4️⃣ Créer personne
            $personne = Personne::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'password' => $request->motdepasse,
                'cin' => $request->cin,
                'id_adresse' => $adresse->id_adresse,
            ]);

            // 5️⃣ Créer candidat
            $candidat = Candidat::create([
                'id_personne' => $personne->id_personne,
                'cv' => $cvPath,
                'motivation' => $lettrePath
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
                'message' => 'Erreur lors de l\'ajout du candidat',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $candidat = Candidat::with(['personne', 'personne.adresse'])->findOrFail($id);

            return response()->json([
                'id_candidat' => $candidat->id_candidat,
                'cin'        => $candidat->personne->cin,
                'nom'        => $candidat->personne->nom,
                'prenom'     => $candidat->personne->prenom,
                'email'      => $candidat->personne->email,
                'ville'      => $candidat->personne->adresse->ville ?? '',
                'cv'         => $candidat->cv,
                'motivation' => $candidat->motivation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Impossible de récupérer le candidat',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}