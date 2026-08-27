<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DepartureController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TourController;
use Illuminate\Support\Facades\Route;

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/home', [HomeController::class, 'index']);

Route::get('/tours', [TourController::class, 'index']);
Route::get('/tour-filters', [TourController::class, 'filters']);
Route::get('/tours/{tour}', [TourController::class, 'show']);

Route::get('/departures', [DepartureController::class, 'index']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/post-categories', [PostController::class, 'categories']);

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/pages/{page}', [PageController::class, 'show']);

Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/contact', [ContactController::class, 'store']);
