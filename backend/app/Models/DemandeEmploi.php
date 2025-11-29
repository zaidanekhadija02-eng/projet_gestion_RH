<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeEmploi extends Model
{
    use HasFactory;
    protected $table = 'demande_emplois';
    public $timestamps = false;
    // IMPORTANT : Pas de primaryKey car clé composite
    public $incrementing = false;

    protected $fillable = [
        'id_candidat',
        'id_offre',
        'accepted'
    ];
        // Définir la clé composite pour les requêtes
    protected function setKeysForSaveQuery($query)
    {
        $query->where('id_candidat', '=', $this->getAttribute('id_candidat'))
              ->where('id_offre', '=', $this->getAttribute('id_offre'));
        return $query;
    }
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

