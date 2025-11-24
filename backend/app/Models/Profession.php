<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profession extends Model
{
    // Si la table s'appelle "professions", pas besoin de préciser $table
    // protected $table = 'professions';

    // Colonnes autorisées à la création en masse
    protected $fillable = ['nom_prof'];

    // Désactiver les timestamps si tu n'as pas les colonnes created_at / updated_at
    public $timestamps = false;
}
