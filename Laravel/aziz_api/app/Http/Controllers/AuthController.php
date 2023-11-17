<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $input = [
            'email' => $request->input('email'),
            'password' => $request->input('password'),
        ];

        $user = User::where('email', $input['email'])->first();

        $loginSuccess = $input['email'] == $user->email && Hash::check($input['password'], $user->password);

        if ($loginSuccess) {
            $token = $user->createToken('auth_token')->plainTextToken;
            $data = [
                'massage' => 'Login success',
                'token' => $token
            ];
            return response()->json($data, 200);
        }
        else {
            $data = [
                'massage' => 'Login failed'
            ];
            return response()->json($data, 401);
        }
    }
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        $data = [
            'massage' => 'Registration success',
            'data' => $user,
            'token_access' => $token
        ];
        return response()->json($data, 200);
    }
}
