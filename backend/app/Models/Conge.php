<?php

namespace App\Models;



use Illuminate\Database\Eloquent\Model;

class Conge extends Model
{
    protected $table = 'conges';
    protected $primaryKey = 'id_conge';
    public $timestamps = false;

    protected $fillable = [
        'id_employe',
        'date_debut',
        'date_fin',
        'type_conge',
        'certificat_medical',
        'date_demande',
        'etat',
        'justif',
        'date_accept'
    ];

    // ✅ AJOUTER CETTE LIGNE
    protected $casts = [
        'etat' => 'integer',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'id_employe', 'id_employe');
    }
}