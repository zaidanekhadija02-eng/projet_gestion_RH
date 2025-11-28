 <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offre_emplois', function (Blueprint $table) {
            $table->id('id_offre');
            $table->unsignedBigInteger('id_prof');
            $table->unsignedBigInteger('id_depart');
            $table->text('detail');
            $table->date('date_pub');
            $table->string('type_emploi');
            $table->boolean('termine')->default(false);
            $table->timestamps();

            $table->foreign('id_prof')->references('id_prof')->on('professions')->onDelete('cascade');
            $table->foreign('id_depart')->references('id_depart')->on('departements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offre_emplois');
    }
};
