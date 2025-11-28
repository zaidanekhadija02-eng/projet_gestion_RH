<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Employe;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;

class EmployeController extends Controller
{
    // ✅ Ajouter un employé (SÉCURISÉ)
    public function store(Request $request)
    {
        $request->validate([
            'cin' => 'required|unique:personnes,cin',
            'email' => 'required|email|unique:personnes,email',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'motdepasse' => 'required|min:6',
            'ville' => 'required',
            'id_prof' => 'required',
            'id_depart' => 'required',
            'num_bureau' => 'required'
        ]);

        DB::beginTransaction();

        try {
            // 1️⃣ Créer l'adresse
            $adresse = Adresse::create([
                'ville' => $request->ville
            ]);

            // 2️⃣ Créer la personne
            $personne = Personne::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'password' => $request->motdepasse, // ✅ PLAIN TEXT
                'cin' => $request->cin,
                'id_adresse' => $adresse->id_adresse,
            ]);

            // 3️⃣ Créer l'employé
            $employe = Employe::create([
                'id_personne' => $personne->id_personne,
                'id_prof' => $request->id_prof,
                'id_depart' => $request->id_depart,
                'num_bureau' => $request->num_bureau,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Employé ajouté avec succès',
                'personne' => $personne,
                'employe' => $employe
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erreur lors de l’ajout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Liste employés
    public function index()
    {
        $employes = Employe::with('personne.adresse','profession','departement')->get();
        return response()->json($employes);
    }

    // ✅ Modifier un employé (SÉCURISÉ)
    public function update(Request $request, $id_personne)
    {
        $personne = Personne::findOrFail($id_personne);

        $request->validate([
            'cin' => 'required|unique:personnes,cin,' . $id_personne . ',id_personne',
            'email' => 'required|unique:personnes,email,' . $id_personne . ',id_personne',
            'nom' => 'required',
            'prenom' => 'required',
        ]);

        DB::beginTransaction();

        try {
            // Modifier personne
            $personne->update([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'cin' => $request->cin,
                'password' => $request->motdepasse 
                    ? $request->motdepasse  // ✅ PLAIN TEXT
                    : $personne->password,
            ]);

            // Modifier adresse
            if ($personne->adresse) {
                $personne->adresse->update([
                    'ville' => $request->ville
                ]);
            }

            // Modifier employé
            $employe = $personne->employe;
            if ($employe) {
                $employe->update([
                    'id_prof' => $request->id_prof,
                    'id_depart' => $request->id_depart,
                    'num_bureau' => $request->num_bureau
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Employé mis à jour avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erreur modification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Supprimer un employé
    public function destroy($id_personne)
    {
        $personne = Personne::findOrFail($id_personne);
        $personne->delete();

        return response()->json([
            'message' => 'Employé supprimé avec succès'
        ]);
    }
}
