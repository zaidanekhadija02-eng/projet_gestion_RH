<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conges', function (Blueprint $table) {
            $table->id('id_conge');
            $table->unsignedBigInteger('id_employe');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('certificat_medical')->nullable();
            $table->date('date_demande');
            $table->string('etat')->default('en attente');
            $table->string('justif')->nullable();
            $table->string('type_conge');
            $table->date('date_accept')->nullable();
            $table->timestamps();

            $table->foreign('id_employe')->references('id_employe')->on('employes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conges');
    }
};