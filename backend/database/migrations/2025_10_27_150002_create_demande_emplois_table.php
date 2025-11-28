 <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_emplois', function (Blueprint $table) {
            $table->unsignedBigInteger('id_candidat');
            $table->unsignedBigInteger('id_offre');
            $table->boolean('accepted')->default(false);
            $table->timestamps();

            $table->primary(['id_candidat', 'id_offre']);
            $table->foreign('id_candidat')->references('id_candidat')->on('candidats')->onDelete('cascade');
            $table->foreign('id_offre')->references('id_offre')->on('offre_emplois')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_emplois');
    }
};
