<?php

namespace App\Http\Controllers;


use App\Models\Conge;
use App\Models\Employe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CongeController extends Controller
{
    // Créer une demande de congé
    public function store(Request $request)
    {
        $request->validate([
            'id_employe' => 'required|integer',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'type_conge' => 'required|string',
            'certificat' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        try {
            $certificatPath = null;
            
            if ($request->hasFile('certificat')) {
                $certificatPath = $request->file('certificat')->store('uploads', 'public');
                $certificatPath = basename($certificatPath);
            }

            $conge = Conge::create([
                'id_employe' => $request->id_employe,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'type_conge' => $request->type_conge,
                'certificat_medical' => $certificatPath,
                'etat' => 0, // En attente par défaut (0 = en attente, 1 = accepté, 2 = refusé)
                'date_demande' => now()->format('Y-m-d'),
                'justif' => null,
                'date_accept' => null,
            ]);

            return response()->json([
                'message' => 'Demande de congé créée avec succès',
                'conge' => $conge
            ], 201);

        } catch (\Exception $e) {
            ('Erreur création congé: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer les congés d'un employé
    public function getByEmploye($id)
{
    $employe = \App\Models\Employe::where('id_personne', $id)->first();
    
    if (!$employe) {
        return response()->json(['error' => 'Employé introuvable'], 404);
    }

    $conges = Conge::where('id_employe', $employe->id_employe)
        ->with(['employe.personne'])
        ->orderBy('date_demande', 'desc')
        ->get();

    $result = $conges->map(function($conge) {
        return [
            'id_conge' => $conge->id_conge,
            'id_employe' => $conge->id_employe,
            'date_debut' => $conge->date_debut,
            'date_fin' => $conge->date_fin,
            'type_conge' => $conge->type_conge,
            'certificat_medical' => $conge->certificat_medical,
            'date_demande' => $conge->date_demande,
            'etat' => (int)$conge->etat, // ✅ FORCER LE TYPE INT
            'justif' => $conge->justif,
            'date_accept' => $conge->date_accept,
            'employe' => [
                'personne' => [
                    'cin' => $conge->employe->personne->cin ?? '—',
                    'nom' => $conge->employe->personne->nom ?? '—',
                    'prenom' => $conge->employe->personne->prenom ?? '—',
                ]
            ]
        ];
    });

    return response()->json($result);
}
    // Accepter/Refuser une demande de congé (ADMIN)
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'etat' => 'required|integer|in:0,1,2',
                'justif' => 'nullable|string'
            ]);

            $conge = Conge::find($id);

            if (!$conge) {
                return response()->json(['message' => 'Demande introuvable'], 404);
            }

            $conge->etat = $request->etat;
            $conge->date_accept = now()->format('Y-m-d');
            
            if ($request->has('justif')) {
                $conge->justif = $request->justif;
            }
            
            $conge->save();

            return response()->json([
                'message' => 'Statut mis à jour avec succès',
                'conge' => $conge
            ], 200);

        } catch (\Exception $e) {
            ('Erreur update status congé: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}