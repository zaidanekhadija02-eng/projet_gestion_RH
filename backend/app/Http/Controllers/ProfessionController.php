<?php

namespace App\Http\Controllers;

use App\Models\Profession;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    // Récupérer toutes les professions
    public function index()
    {
        $professions = Profession::all();
        return response()->json($professions);
    }

    // Ajouter une nouvelle profession
    public function store(Request $request)
    {
        $request->validate([
            'nom_prof' => 'required|string|max:255',
        ]);

        $profession = Profession::create([
            'nom_prof' => $request->nom_prof,
        ]);

        return response()->json($profession, 201);
    }
}
