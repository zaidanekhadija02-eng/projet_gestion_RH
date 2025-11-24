<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;

    protected $table = 'departements';

    // Clé primaire
    protected $primaryKey = 'id_depart';

    // Si tu n'utilises pas les timestamps created_at/updated_at
    public $timestamps = false;

    // Champs assignables
    protected $fillable = ['nom_depart'];
}
