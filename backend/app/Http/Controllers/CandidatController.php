<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Candidat;
use Illuminate\Support\Facades\Hash;

class CandidatController extends Controller
{
 public function registerCandidat(Request $request)
{
    $request->validate([
        'nom' => 'required|string',
        'prenom' => 'required|string',
        'email' => 'required|email|unique:personnes,email',
        'password' => 'required|string|min:6',
        'cin' => 'required|string|unique:personnes,cin',
        'cv' => 'required|file|mimes:pdf,doc,docx',
        'motivation' => 'required|file|mimes:pdf,doc,docx',
    ]);

    $personne = Personne::create([
        'nom' => $request->nom,
        'prenom' => $request->prenom,
        'email' => $request->email,
        'password' => $request->password, // mot de passe en clair
        'cin' => $request->cin,
    ]);

    $cvPath = $request->file('cv')->store('cvs', 'public');
    $motivationPath = $request->file('motivation')->store('motivations', 'public');

    Candidat::create([
        'id_personne' => $personne->id_personne,
        'cv' => $cvPath,
        'motivation' => $motivationPath,
    ]);

    return response()->json(['message' => 'Inscription réussie !']);
}

}
