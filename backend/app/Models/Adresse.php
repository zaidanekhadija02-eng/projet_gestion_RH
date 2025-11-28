<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adresse extends Model
{
    use HasFactory;

    protected $table = 'adresses';
    protected $primaryKey = 'id_adresse';
    public $timestamps = false; // ✅ AJOUTER si pas de timestamps
    protected $fillable = ['ville'];
}
