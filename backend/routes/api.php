<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\PersonneController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\ProfessionController;
use App\Http\Controllers\OffreEmploiController;

// Auth
Route::post('/login', [AuthController::class, 'login']);

// Personnes
Route::get('/personnes', [PersonneController::class, 'index']);

// Employés
Route::get('/employes', [EmployeController::class, 'index']);
Route::post('/employes', [EmployeController::class, 'store']);
Route::put('/employes/{id}', [EmployeController::class, 'update']);
Route::delete('/employes/{id}', [EmployeController::class, 'destroy']);

// Départements
Route::get('/departements', [DepartementController::class, 'index']);
Route::post('/departements', [DepartementController::class, 'store']);
Route::put('/departements/{id}', [DepartementController::class, 'update']);
Route::delete('/departements/{id}', [DepartementController::class, 'destroy']);

// Professions
Route::get('/professions', [ProfessionController::class, 'index']);
Route::post('/professions', [ProfessionController::class, 'store']);
Route::put('/professions/{id}', [ProfessionController::class, 'update']);
Route::delete('/professions/{id}', [ProfessionController::class, 'destroy']);

// Offres d'emploi
Route::get('/offres', [OffreEmploiController::class, 'index']);
Route::post('/offres', [OffreEmploiController::class, 'store']);
Route::delete('/offres/{id}', [OffreEmploiController::class, 'destroy']);
Route::get('/offres', [OffreEmploiController::class, 'index']);
// Offres d'emploi
Route::get('/offres', [OffreEmploiController::class, 'index']);  // Liste toutes les offres
Route::post('/offres', [OffreEmploiController::class, 'store']); // Créer une offre
Route::put('/offres/{id}', [OffreEmploiController::class, 'update']);
 // ⚠️ Modifier une offre
Route::delete('/offres/{id}', [OffreEmploiController::class, 'destroy']); // Supprimer
Route::get('/offres/{id}', [OffreEmploiController::class, 'show']); // Voir une seule offre
Route::apiResource('offres', OffreEmploiController::class);
