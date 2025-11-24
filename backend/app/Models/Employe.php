<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;

    protected $table = 'employes';
    protected $primaryKey = 'id_employe';
    protected $fillable = ['id_personne', 'id_prof', 'id_depart', 'num_bureau'];

    // Relation vers la personne
    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne', 'id_personne');
    }

    // Relation vers la profession
    public function profession()
    {
        return $this->belongsTo(Profession::class, 'id_prof', 'id_prof');
    }

    // Relation vers le département
    public function departement()
    {
        return $this->belongsTo(Departement::class, 'id_depart', 'id_depart');
    }
}
