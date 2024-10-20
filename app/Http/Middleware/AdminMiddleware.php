<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware extends Middleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Check if the authenticated user is an admin
        if ($user && $user->is_admin) {
            return $next($request);
        }

        // If not an admin, return a 403 Forbidden response
        return response()->json(['message' => 'Forbidden'], 403);
    }
}
