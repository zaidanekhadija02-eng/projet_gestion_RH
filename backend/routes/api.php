 <?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\PersonneController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\ProfessionController;
use App\Http\Controllers\OffreEmploiController;
use App\Http\Controllers\CandidatController;
use App\Http\Controllers\DemandeEmploiController;
use App\Http\Controllers\CongeController;


// --- Auth ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOTP']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// --- Personnes ---
Route::get('/personnes', [PersonneController::class, 'index']);

// --- Employés ---
Route::get('/employes', [EmployeController::class, 'index']);
Route::post('/employes', [EmployeController::class, 'store']);
Route::put('/employes/{id}', [EmployeController::class, 'update']);
Route::delete('/employes/{id}', [EmployeController::class, 'destroy']);

// --- Départements ---
Route::get('/departements', [DepartementController::class, 'index']);
Route::post('/departements', [DepartementController::class, 'store']);
Route::put('/departements/{id}', [DepartementController::class, 'update']);
Route::delete('/departements/{id}', [DepartementController::class, 'destroy']);

// --- Professions ---
Route::get('/professions', [ProfessionController::class, 'index']);
Route::post('/professions', [ProfessionController::class, 'store']);
Route::put('/professions/{id}', [ProfessionController::class, 'update']);
Route::delete('/professions/{id}', [ProfessionController::class, 'destroy']);

// --- Offres d'emploi ---
Route::get('/offres', [OffreEmploiController::class, 'index']);
Route::post('/offres', [OffreEmploiController::class, 'store']);
Route::put('/offres/{id}', [OffreEmploiController::class, 'update']);
Route::delete('/offres/{id}', [OffreEmploiController::class, 'destroy']);
Route::put('/offres/{id}/bloquer', [OffreEmploiController::class, 'toggleTermine']);

// --- Candidats ---
Route::post('/candidats', [CandidatController::class, 'store']);
Route::get('/candidats/{id}', [CandidatController::class, 'show']);
Route::put('/candidats/{id}', [CandidatController::class, 'update']);

// --- Demandes d'emploi ---
Route::post('/demande-emplois', [DemandeEmploiController::class, 'postuler']);
Route::get('/demande-emplois/candidat/{id}', [DemandeEmploiController::class, 'getByCandidat']);
Route::get('/demande-emplois/offre/{id}', [DemandeEmploiController::class, 'getByOffre']);
Route::put('/demande-emplois/{id}/status', [DemandeEmploiController::class, 'updateStatus']);


// Récupérer les candidatures d’une offre
Route::get('/offres/{id}/candidatures', [DemandeEmploiController::class, 'getCandidaturesAdmin']);

// Accepter / refuser un candidat
Route::put('/demandes/update-status', [DemandeEmploiController::class, 'updateStatus']);
// Route pour voir les candidatures d'une offre (ADMIN)
Route::get('/offres/{id}/candidatures', [DemandeEmploiController::class, 'getByOffre']);
// Route pour accepter/refuser une candidature
Route::put('/demandes/{id_candidat}/{id_offre}/status', [DemandeEmploiController::class, 'updateStatus']);

// --- Congés ---
Route::post('/conges', [CongeController::class, 'store']);
Route::get('/conges/employe/{id}', [CongeController::class, 'getByEmploye']);
Route::get('/conges', [CongeController::class, 'index']); // Pour l'admin
Route::put('/conges/{id}/status', [CongeController::class, 'updateStatus']); // Pour l'admin

Route::get('/conges/by-employe/{id_employe}', [CongeController::class, 'getByEmployeId']);