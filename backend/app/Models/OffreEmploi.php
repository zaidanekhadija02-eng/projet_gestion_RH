<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DemandeEmploi;

class OffreEmploi extends Model
{
    protected $table = 'offre_emplois';
    protected $primaryKey = 'id_offre';
    public $timestamps = false;

protected $fillable = [
    'id_prof',
    'id_depart',
    'date_pub',
    'type_emploi',
    'detail',
    'termine'  // ← AJOUTER
];


    public function departement()
    {
        return $this->belongsTo(Departement::class, 'id_depart', 'id_depart');
    }

    public function profession()
    {
        return $this->belongsTo(Profession::class, 'id_prof', 'id_prof');
    }
    public function demandes()
{
    return $this->hasMany(DemandeEmploi::class, 'id_offre', 'id_offre');
}

}