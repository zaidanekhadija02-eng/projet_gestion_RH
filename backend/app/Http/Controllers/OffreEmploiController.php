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
                'departement' => $offre->departement->nom_depart ?? '—',
                'profession' => $offre->profession->nom_prof ?? '—',
                'date_publication' => $offre->date_pub,
                'type' => $offre->type_emploi,
                'detail' => $offre->detail,
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
    $request->validate([
        'id_prof' => 'required|integer',
        'id_depart' => 'required|integer',
        'date_pub' => 'required|date',
        'type_emploi' => 'required|string',
        'detail' => 'nullable|file|mimes:pdf'
    ]);

    $offre = OffreEmploi::find($id);

    if (!$offre) {
        return response()->json(['error' => 'Offre non trouvée'], 404);
    }

    $offre->id_prof = $request->id_prof;
    $offre->id_depart = $request->id_depart;
    $offre->date_pub = $request->date_pub;
    $offre->type_emploi = $request->type_emploi;

    // Gestion du fichier PDF
    if ($request->hasFile('detail')) {
        $file = $request->file('detail');
        $filename = time().'_'.$file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);
        $offre->detail = $filename;
    }

    $offre->save();

    return response()->json(['message' => 'Offre modifiée avec succès'], 200);
}

}
