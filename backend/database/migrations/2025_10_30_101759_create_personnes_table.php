<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnes', function (Blueprint $table) {
            $table->id('id_personne');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('OTP')->nullable();
            $table->dateTime('OTP_expiry')->nullable();
            $table->string('cin')->unique();
            $table->unsignedBigInteger('id_adresse')->nullable();
            $table->timestamps();

            $table->foreign('id_adresse')
                  ->references('id_adresse')
                  ->on('adresses')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnes');
    }
};