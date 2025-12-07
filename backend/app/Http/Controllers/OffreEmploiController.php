<?php

namespace App\Http\Controllers;

use App\Models\OffreEmploi;
use Illuminate\Http\Request;

class OffreEmploiController extends Controller
{
    public function index()
{
    $offres = OffreEmploi::with(['departement', 'profession'])->get();

    $offres = $offres->map(function($offre) {
        return [
            'id_offre' => $offre->id_offre,
            'id_depart' => $offre->id_depart,
            'id_prof' => $offre->id_prof,
            'departement' => $offre->departement->nom_depart ?? '—',
            'profession' => $offre->profession->nom_prof ?? '—',
            'date_publication' => $offre->date_pub,
            'date_pub' => $offre->date_pub,
            'type' => $offre->type_emploi,
            'type_emploi' => $offre->type_emploi,
            'detail' => $offre->detail,
            'termine' => $offre->termine ?? 0,  // ✅ ADD THIS LINE
        ];
    });

    return response()->json($offres);
}

    public function store(Request $request)
    {
        $request->validate([
            'id_prof' => 'required|integer',
            'id_depart' => 'required|integer',
            'date_pub' => 'required|date',
            'type_emploi' => 'required|string',
            'detail' => 'nullable|file|mimes:pdf'
        ]);

        $offre = new OffreEmploi();
        $offre->id_prof = $request->id_prof;
        $offre->id_depart = $request->id_depart;
        $offre->date_pub = $request->date_pub;
        $offre->type_emploi = $request->type_emploi;

        if ($request->hasFile('detail')) {
            $file = $request->file('detail');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $offre->detail = $filename;
        }

        $offre->save();

        return response()->json(['message' => 'Offre créée avec succès'], 201);
    }

    public function destroy($id)
    {
        $offre = OffreEmploi::find($id);

        if (!$offre) {
            return response()->json(['error' => 'Offre non trouvée'], 404);
        }

        $offre->delete();

        return response()->json(['message' => 'Offre supprimée avec succès'], 200);
    }
    public function update(Request $request, $id)
{
    $offre = OffreEmploi::findOrFail($id);

    $validated = $request->validate([
        'id_prof' => 'required|integer',
        'id_depart' => 'required|integer',
        'date_pub' => 'required|date',
        'type_emploi' => 'required|string',
        'detail' => 'nullable|file|mimes:pdf|max:5120'
    ]);

    if ($request->hasFile('detail')) {
        // Supprimer l'ancien fichier
        if ($offre->detail && file_exists(public_path('uploads/' . $offre->detail))) {
            unlink(public_path('uploads/' . $offre->detail));
        }

        $file = $request->file('detail');
        $filename = time().'_'.$file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);
        $validated['detail'] = $filename;
    } else {
        // Garder l'ancien fichier si pas de nouveau
        unset($validated['detail']);
    }

    $offre->update($validated);
    
    return response()->json(['message' => 'Offre modifiée avec succès'], 200);
}
public function toggleTermine($id)
{
    $offre = OffreEmploi::find($id);

    if (!$offre) {
        return response()->json(['message' => 'Offre non trouvée'], 404);
    }

    $offre->termine = $offre->termine == 1 ? 0 : 1;
    $offre->save();

    return response()->json([
        'message' => $offre->termine ? 'Offre bloquée' : 'Offre débloquée',
        'termine' => $offre->termine
    ]);
}





}
