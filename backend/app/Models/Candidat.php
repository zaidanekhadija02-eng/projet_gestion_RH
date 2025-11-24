<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidat extends Model
{
    use HasFactory;

    protected $table = 'candidats';
    protected $primaryKey = 'id_candidat';
    protected $fillable = ['id_personne','cv','motivation'];

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne');
    }
}
