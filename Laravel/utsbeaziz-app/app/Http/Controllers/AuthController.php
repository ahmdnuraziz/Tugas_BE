<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function registrasi(Request $request)
    {
        try {
            // request validation
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }


            // Create new user
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
            $token = $user->createToken('AuthToken')->plainTextToken;

            // Send response
            $data = [
                'message' => 'User registered successfully',
                'data' => $user,
                'token' => $token
            ];

            return response()->json($data, 201);
        } catch (\Exception $e) {
            // error handling
            Log::error('Error in register: ' . $e->getMessage());

            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function login(Request $request)
    {
        try {
            // Request validation
            $input = [
                'email' => $request->input('email'),
                'password' => $request->input('password'),
            ];

            $user = User::where('email', $input['email'])->first();

            $isLoginSuccess = $input['email'] == $user->email && Hash::check($input['password'], $user->password);
            // You can generate a token for the user here if you're implementing authentication
            if ($isLoginSuccess) {
                $token = $user->createToken('auth_token')->plainTextToken;
                $data = [
                    'message' => 'Login successful',
                    'token' => $token
                ];
                return response()->json($data, 200);
            } else {
                $data = [
                    'message' => 'Email atau password salah',
                ];
                return response()->json($data, 401);
            }
        } catch (\Exception $e) {
            // error handling
            Log::error('Error in login: ' . $e->getMessage());

            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

}
