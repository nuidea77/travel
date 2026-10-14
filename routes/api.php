<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\BookingAdminController;
use App\Http\Controllers\Api\Admin\ContactMessageAdminController;
use App\Http\Controllers\Api\Admin\DestinationAdminController;
use App\Http\Controllers\Api\Admin\MetaAdminController;
use App\Http\Controllers\Api\Admin\PageAdminController;
use App\Http\Controllers\Api\Admin\PostAdminController;
use App\Http\Controllers\Api\Admin\PostCategoryAdminController;
use App\Http\Controllers\Api\Admin\SettingAdminController;
use App\Http\Controllers\Api\Admin\TestimonialAdminController;
use App\Http\Controllers\Api\Admin\TourAdminController;
use App\Http\Controllers\Api\Admin\TourCategoryAdminController;
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

/* ── Public site API ─────────────────────────────────────────── */

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

/* ── Admin API (own panel; bearer-token auth) ────────────────── */

Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::prefix('admin')->middleware('auth.admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/meta', [MetaAdminController::class, 'index']);

    // Tours use route-model binding by id here (public routes bind by slug).
    Route::get('/tours', [TourAdminController::class, 'index']);
    Route::post('/tours', [TourAdminController::class, 'store']);
    Route::get('/tours/{tour:id}', [TourAdminController::class, 'show']);
    Route::put('/tours/{tour:id}', [TourAdminController::class, 'update']);
    Route::delete('/tours/{tour:id}', [TourAdminController::class, 'destroy']);

    Route::get('/posts', [PostAdminController::class, 'index']);
    Route::post('/posts', [PostAdminController::class, 'store']);
    Route::get('/posts/{post:id}', [PostAdminController::class, 'show']);
    Route::put('/posts/{post:id}', [PostAdminController::class, 'update']);
    Route::delete('/posts/{post:id}', [PostAdminController::class, 'destroy']);

    foreach ([
        'tour-categories' => TourCategoryAdminController::class,
        'destinations' => DestinationAdminController::class,
        'post-categories' => PostCategoryAdminController::class,
        'testimonials' => TestimonialAdminController::class,
        'pages' => PageAdminController::class,
    ] as $uri => $controller) {
        Route::get("/{$uri}", [$controller, 'index']);
        Route::post("/{$uri}", [$controller, 'store']);
        Route::put("/{$uri}/{id}", [$controller, 'update']);
        Route::delete("/{$uri}/{id}", [$controller, 'destroy']);
    }

    Route::get('/bookings', [BookingAdminController::class, 'index']);
    Route::put('/bookings/{booking}', [BookingAdminController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingAdminController::class, 'destroy']);

    Route::get('/messages', [ContactMessageAdminController::class, 'index']);
    Route::put('/messages/{contactMessage}', [ContactMessageAdminController::class, 'update']);
    Route::delete('/messages/{contactMessage}', [ContactMessageAdminController::class, 'destroy']);

    Route::get('/settings', [SettingAdminController::class, 'index']);
    Route::put('/settings', [SettingAdminController::class, 'update']);
});
