<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
//    return Auth::user();
})->middleware('auth:sanctum');

Route::get('/test-api', function (){
    return ['test-api' => 'isOk'];
})->middleware('auth:sanctum');

