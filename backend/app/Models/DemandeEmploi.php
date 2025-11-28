<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class DemandeEmploi extends Model
{
    protected $table = 'demande_emplois';
    public $timestamps = false;
    // IMPORTANT : Pas de primaryKey car clé composite
    public $incrementing = false;

    protected $fillable = [
        'id_candidat',
        'id_offre',
        'accepted'
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class, 'id_candidat', 'id_candidat');
    }

    public function offreEmploi()
    {
        return $this->belongsTo(OffreEmploi::class, 'id_offre', 'id_offre');
        //                                           ↑ clé étrangère  ↑ clé primaire de offre_emplois
    }

}
