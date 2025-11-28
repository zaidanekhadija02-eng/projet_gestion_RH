 <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidats', function (Blueprint $table) {
            $table->id('id_candidat');
            $table->unsignedBigInteger('id_personne');
            $table->string('cv')->nullable();
            $table->string('motivation')->nullable();
            $table->timestamps();

            $table->foreign('id_personne')
                  ->references('id_personne')
                  ->on('personnes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidats');
    }
};
