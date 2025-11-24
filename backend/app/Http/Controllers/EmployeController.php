<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personne;
use App\Models\Employe;
use App\Models\Adresse;
use App\Models\Profession;
use App\Models\Departement;

class EmployeController extends Controller
{
    // ---------------------------------------
    // 1️⃣ Ajouter un employé
    // ---------------------------------------
    public function store(Request $request)
    {
        // Créer l'adresse
        $adresse = Adresse::create([
            'ville' => $request->ville
        ]);

        // Créer la personne
        $personne = Personne::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => bcrypt($request->motdepasse),
            'cin' => $request->cin,
            'id_adresse' => $adresse->id_adresse,
        ]);

        // Créer l'employé
        $employe = Employe::create([
            'id_personne' => $personne->id_personne,
            'id_prof' => $request->id_prof,
            'id_depart' => $request->id_depart,
            'bureau' => $request->bureau,
        ]);

        return response()->json([
            'personne' => $personne,
            'employe' => $employe
        ]);
    }

    // ---------------------------------------
    // 2️⃣ Liste employés
    // ---------------------------------------
    public function index()
    {
        $employes = Employe::with('personne.adresse','profession','departement')->get();
        return response()->json($employes);
    }

    // ---------------------------------------
    // 3️⃣ Modifier un employé
    // ---------------------------------------
    public function update(Request $request, $id_personne)
    {
        $personne = Personne::findOrFail($id_personne);

        // 🔥 Modifier la personne
        $personne->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'cin' => $request->cin,
            'password' => $request->motdepasse 
                ? bcrypt($request->motdepasse) 
                : $personne->password,
        ]);

        // 🔥 Modifier l'adresse
        if ($personne->adresse) {
            $personne->adresse->update([
                'ville' => $request->ville
            ]);
        }

        // 🔥 Modifier l'employé
        $employe = $personne->employe;
        if ($employe) {
            $employe->update([
                'id_prof' => $request->id_prof,
                'id_depart' => $request->id_depart,
                'bureau' => $request->bureau,
            ]);
        }

        return response()->json([
            'message' => 'Employé mis à jour avec succès',
            'personne' => $personne,
            'employe' => $employe
        ]);
    }

    // ---------------------------------------
    // 4️⃣ Supprimer un employé
    // ---------------------------------------
    public function destroy($id_personne)
    {
        $personne = Personne::findOrFail($id_personne);
        $personne->delete();  // supprime employé si FK CASCADE

        return response()->json([
            'message' => 'Employé supprimé avec succès'
        ]);
    }
}
