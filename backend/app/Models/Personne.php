<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Personne extends Authenticatable
{
    use HasFactory;

    protected $table = 'personnes';
    protected $primaryKey = 'id_personne';
    protected $fillable = ['nom','prenom','email','password','cin','OTP','OTP_expiry','id_adresse'];

    protected $hidden = ['password'];

    public function candidat()
    {
        return $this->hasOne(Candidat::class, 'id_personne');
    }

    public function employe()
    {
        return $this->hasOne(Employe::class, 'id_personne');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_personne');
    }

    // Relation pour récupérer la profession via l'employé
    public function profession()
    {
        return $this->hasOneThrough(
            Profession::class, // modèle final
            Employe::class,    // modèle intermédiaire
            'id_personne',     // clé étrangère dans Employe vers Personne
            'id_prof',         // clé étrangère dans Profession
            'id_personne',     // clé locale dans Personne
            'id_prof'          // clé locale dans Employe
        );
    }

    // Relation pour récupérer le département via l'employé
    public function departement()
    {
        return $this->hasOneThrough(
            Departement::class,
            Employe::class,
            'id_personne',
            'id_depart',
            'id_personne',
            'id_depart'
        );
    }
    // app/Models/Personne.php
public function adresse()
{
    return $this->belongsTo(Adresse::class, 'id_adresse', 'id_adresse');
}

}
