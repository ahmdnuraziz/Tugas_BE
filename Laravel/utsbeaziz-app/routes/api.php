<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('pasien')->group(function () {
        Route::get('/', [PasienController::class, 'index']);
        Route::get('/{id}', [PasienController::class, 'show']);
        Route::post('/', [PasienController::class, 'store']);
        Route::put('/{id}', [PasienController::class, 'update']);
        Route::delete('/{id}', [PasienController::class, 'destroy']);
    });
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'registrasi']);