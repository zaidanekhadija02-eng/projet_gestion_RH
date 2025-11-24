<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    // Lister tous les départements
    public function index()
    {
        return response()->json(Departement::all());
    }

    // Ajouter un département
    public function store(Request $request)
    {
        $request->validate([
            'nom_depart' => 'required|string|max:255',
        ]);

        $departement = Departement::create([
            'nom_depart' => $request->nom_depart,
        ]);

        return response()->json($departement, 201);
    }

    // Modifier un département
    public function update(Request $request, $id)
    {
        $departement = Departement::find($id);
        if (!$departement) {
            return response()->json(['message' => 'Département non trouvé'], 404);
        }

        $request->validate([
            'nom_depart' => 'required|string|max:255',
        ]);

        $departement->nom_depart = $request->nom_depart;
        $departement->save();

        return response()->json($departement);
    }

    // Supprimer un département
    public function destroy($id)
    {
        $departement = Departement::find($id);
        if (!$departement) {
            return response()->json(['message' => 'Département non trouvé'], 404);
        }

        $departement->delete();

        return response()->json(['message' => 'Département supprimé']);
    }
}
