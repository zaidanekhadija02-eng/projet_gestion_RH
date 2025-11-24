<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'detail'
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class, 'id_depart', 'id_depart');
    }

    public function profession()
    {
        return $this->belongsTo(Profession::class, 'id_prof', 'id_prof');
    }
}
