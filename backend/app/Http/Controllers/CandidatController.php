<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Candidat;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
    // Mettre à jour un candidat
    public function update(Request $request, $id)
    {
        try {
            $candidat = Candidat::with(['personne.adresse'])->find($id);

            if (!$candidat) {
                return response()->json(['message' => 'Candidat introuvable'], 404);
            }

            $personne = $candidat->personne;

            // Validation
            $request->validate([
                'nom' => 'sometimes|string',
                'prenom' => 'sometimes|string',
                'email' => 'sometimes|email|unique:personnes,email,' . $personne->id_personne . ',id_personne',
                'ville' => 'nullable|string',
                'cv' => 'nullable|file|mimes:pdf|max:10240',
                'lettre' => 'nullable|file|mimes:pdf|max:10240',
            ]);

            // Mettre à jour la personne
            if ($request->has('nom')) {
                $personne->nom = $request->nom;
            }
            if ($request->has('prenom')) {
                $personne->prenom = $request->prenom;
            }
            if ($request->has('email')) {
                $personne->email = $request->email;
            }
            $personne->save();

            // Mettre à jour l'adresse
            if ($request->has('ville')) {
                $adresse = $personne->adresse;
                if ($adresse) {
                    $adresse->ville = $request->ville;
                    $adresse->save();
                } else {
                    Adresse::create([
                        'id_personne' => $personne->id_personne,
                        'ville' => $request->ville,
                    ]);
                }
            }

            // Mettre à jour le CV
            if ($request->hasFile('cv')) {
                // Supprimer l'ancien CV
                if ($candidat->cv) {
                    Storage::disk('public')->delete('uploads/' . $candidat->cv);
                }
                
                $cvPath = $request->file('cv')->store('uploads', 'public');
                $candidat->cv = basename($cvPath);
            }

            // Mettre à jour la lettre
            if ($request->hasFile('lettre')) {
                // Supprimer l'ancienne lettre
                if ($candidat->motivation) {
                    Storage::disk('public')->delete('uploads/' . $candidat->motivation);
                }
                
                $lettrePath = $request->file('lettre')->store('uploads', 'public');
                $candidat->motivation = basename($lettrePath);
            }

            $candidat->save();

            return response()->json([
                'message' => 'Informations mises à jour avec succès',
                'candidat' => [
                    'id_candidat' => $candidat->id_candidat,
                    'cin' => $personne->cin,
                    'nom' => $personne->nom,
                    'prenom' => $personne->prenom,
                    'email' => $personne->email,
                    'ville' => $personne->adresse->ville ?? '',
                    'cv' => $candidat->cv,
                    'motivation' => $candidat->motivation,
                ]
            ], 200);

        } catch (\Exception $e) {
            ('Erreur update candidat: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}