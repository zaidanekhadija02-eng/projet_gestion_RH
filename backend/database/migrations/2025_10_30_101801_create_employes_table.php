<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employes', function (Blueprint $table) {
            $table->id('id_employe');
            $table->unsignedBigInteger('id_personne');
            $table->unsignedBigInteger('id_prof');
            $table->unsignedBigInteger('id_depart');
            $table->string('num_bureau')->nullable();
            $table->timestamps();

            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
            $table->foreign('id_prof')->references('id_prof')->on('professions')->onDelete('cascade');
            $table->foreign('id_depart')->references('id_depart')->on('departements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employes');
    }
};