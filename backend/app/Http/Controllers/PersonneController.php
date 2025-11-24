<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;

class PersonneController extends Controller
{
    // Méthode pour créer une personne (déjà existante)
    public function store(Request $request)
    {
        $personne = Personne::create([
            'cin' => $request->cin,
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'id_adresse' => $request->id_adresse ?? null
        ]);

        return response()->json($personne, 201);
    }

    // Nouvelle méthode pour récupérer toutes les personnes
    public function index()
    {
        $personnes = Personne::all();
        return response()->json($personnes);
    }
}
