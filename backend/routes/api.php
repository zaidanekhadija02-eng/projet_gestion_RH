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

// Offres d'emploi - ✅ UNE SEULE FOIS
Route::get('/offres', [OffreEmploiController::class, 'index']);
Route::post('/offres', [OffreEmploiController::class, 'store']);
Route::put('/offres/{id}', [OffreEmploiController::class, 'update']);
Route::delete('/offres/{id}', [OffreEmploiController::class, 'destroy']);


Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOTP']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);