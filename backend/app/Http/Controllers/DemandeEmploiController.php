<?php

namespace App\Http\Controllers;


use App\Models\DemandeEmploi;
use App\Models\OffreEmploi;
use Illuminate\Http\Request;

class DemandeEmploiController extends Controller
{
    // POSTULER À UNE OFFRE
    public function postuler(Request $request)
    {
        $request->validate([
            'id_candidat' => 'required|integer',
            'id_offre' => 'required|integer',
        ]);

        $existe = DemandeEmploi::where('id_candidat', $request->id_candidat)
                                ->where('id_offre', $request->id_offre)
                                ->first();

        if ($existe) {
            return response()->json([
                'message' => 'Vous avez déjà postulé à cette offre.'
            ], 409);
        }

        $demande = DemandeEmploi::create([
            'id_candidat' => $request->id_candidat,
            'id_offre' => $request->id_offre,
            'accepted' => 0,
        ]);

        return response()->json([
            'message' => 'Demande envoyée avec succès.',
            'demande' => $demande
        ], 201);
    }

   public function getByCandidat($id)
{
    $demandes = DemandeEmploi::where('id_candidat', $id)
        ->with(['offreEmploi.departement', 'offreEmploi.profession'])
        ->get();

    // Formatter les données pour le frontend
    $result = $demandes->map(function($demande) {
        $offre = $demande->offreEmploi;
        
        return [
            'id_candidat' => $demande->id_candidat,
            'id_offre' => $demande->id_offre,
            'accepted' => $demande->accepted,
            
            // Mapper les champs de l'offre au premier niveau
            'departement' => $offre->departement->nom_depart ?? '—',
            'profession' => $offre->profession->nom_prof ?? '—',
            'detail' => $offre->detail ?? null,
            'type_emploi' => $offre->type_emploi ?? '—',
            'date_pub' => $offre->date_pub ?? null,
            
            // Mapper le statut (etat)
            'etat' => $demande->accepted == 1 ? 'Accepté' : ($demande->accepted == 2 ? 'Refusé' : 'En attente')
        ];
    });

    return response()->json($result);
}

public function getByOffre($id)
{
    // Récupérer l'offre avec ses relations
    $offre = OffreEmploi::with(['departement', 'profession'])->find($id);
    
    if (!$offre) {
        return response()->json(['error' => 'Offre introuvable'], 404);
    }

    $demandes = DemandeEmploi::where('id_offre', $id)
        ->with(['candidat.personne.adresse'])
        ->get();

    // Formatter les données pour le frontend
    $result = [
        'offre_info' => [
            'id_offre' => $offre->id_offre,
            'departement' => $offre->departement->nom_depart ?? '—',
            'profession' => $offre->profession->nom_prof ?? '—',
        ],
        'candidatures' => $demandes->map(function($demande) {
            $candidat = $demande->candidat;
            $personne = $candidat->personne ?? null;
            $adresse = $personne->adresse ?? null; // ✅ AJOUTER CETTE LIGNE
            
            return [
                'id_candidat' => $demande->id_candidat,
                'id_offre' => $demande->id_offre,
                'accepted' => $demande->accepted,
                
                // Infos du candidat
                'cin' => $personne->cin ?? '—',
                'nom' => $personne->nom ?? '—',
                'prenom' => $personne->prenom ?? '—',
                'ville' => $adresse->ville ?? '—',
                'cv' => $candidat->cv ?? null,
                'lettre' => $candidat->motivation ?? null,
            ];
        })
    ];

    return response()->json($result);
}

    
    // CHANGER LE STATUT (ADMIN)
    public function updateStatus(Request $request, $id_candidat, $id_offre)
{
    $demande = DemandeEmploi::where('id_candidat', $id_candidat)
                            ->where('id_offre', $id_offre)
                            ->first();

    if (!$demande) {
        return response()->json(['message' => 'Demande introuvable.'], 404);
    }

    $demande->accepted = $request->accepted; // 1 = accepté, 2 ou -1 = refusé
    $demande->save();

    return response()->json([
        'message' => 'Statut mis à jour.',
        'demande' => $demande
    ]);
}
    
}
