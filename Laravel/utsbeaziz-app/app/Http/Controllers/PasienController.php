<?php

namespace App\Http\Controllers;

use App\Models\PasienModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class PasienController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validasi input
        try {
            $query = PasienModel::query();

            if ($request->has('nama')) {
                $query->where('nama', 'like', '%' . $request->input('nama') . '%');
            }

            if ($request->has('alamat')) {
                $query->where('alamat', 'like', '%' . $request->input('alamat') . '%');
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->has('tanggal_masuk')) {
                $query->where('tanggal_masuk', $request->input('tanggal_masuk'));
            }
            
            if ($request->has('tanggal_keluar')) {
                $query->where('tanggal_keluar', $request->input('tanggal_keluar'));
            }

            if ($request->has('sort')) {
                $sortField = $request->input('sort');
                $sortOrder = $request->input('order', 'asc'); 

                $allowedSortFields = ['tanggal_masuk', 'tanggal_keluar', 'nama', 'alamat'];
                if (in_array($sortField, $allowedSortFields)) {
                    $query->orderBy($sortField, $sortOrder);
                } else {
                    return response()->json(['error' => 'Data tidak ditemukan'], 400);
                }
            }
            
            // Validasi input
            $sizePage = $request->input('sizePage', 10);
            $page = $request->input('page', 1);

            $pasien = $query->paginate($sizePage, ['*'], 'page', $page);

            if ($pasien->isEmpty()) {
                return response()->json(['error' => 'No data found'], 404);
            } else {
                return response()->json(['message' => 'The request succeeded', 'data' => $pasien], 200);
            }

        // error handling    
        } catch (\Illuminate\Auth\AuthenticationException $e) {
            return response()->json(['error' => 'Authentication error', 'error' => $e->getMessage()], 401);
        } catch (\Symfony\Component\Routing\Exception\RouteNotFoundException $e) {
            return response()->json(['error' => 'Route not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in PasienController@index: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        // Validasi input
        try {
            $pasien = PasienModel::findOrFail($id);
            return response()->json(['message' => 'The request succeeded', 'data' => $pasien], 200);

        // error handling    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Data not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in PasienController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function store(Request $request)
{
    try {
        // input validation
        $request->validate([
            'nama' => 'required|string',
            'alamat' => 'required|string',
            'status' => 'required|in:positif,sembuh,meninggal',
            'tanggal_masuk' => 'required|date',
        ]);

        // Create a new pasien
        $pasien = PasienModel::create([
            'nama' => $request->input('nama'),
            'alamat' => $request->input('alamat'),
            'status' => $request->input('status'),
            'tanggal_masuk' => $request->input('tanggal_masuk'),
        ]);

        // Memberikan respons sesuai keberhasilan atau kegagalan
        if ($pasien) {
            return response()->json(['message' => 'Pasien berhasil ditambahkan'], 201);
        } else {
            return response()->json(['message' => 'Gagal menambahkan pasien'], 500);
        }
    } catch (\Exception $e) {
        // Menangani kesalahan dan memberikan respons
        return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
    }
}


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validasi input
        try {
            $this->validate($request, [
                'nama' => 'required',
                'alamat' => 'required',
                'status' => 'required|in:positif,sembuh,meninggal',
                'tanggal_masuk' => 'required|date',
                'tanggal_keluar' => 'date',
            ]);

            $pasien = PasienModel::findOrFail($id);

            // ubah data ke dalam bentuk array
            $pasienArray = $pasien->toArray();

            // tambahkan data baru ke dalam array
            Log::debug('Received data:', $request->all());
            Log::debug('Found pasient:', $pasienArray);

            // update data dari array
            $pasien->update($request->only(['nama', 'alamat', 'status', 'tanggal_masuk', 'tanggal_keluar']));

            return response()->json(['message' => 'Resource updated', 'data' => $pasien], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'The request Not Found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in PasienController@update: ' . $e->getMessage());

            if (strpos($e->getMessage(), 'Data truncated for column \'status\'') !== false) {
                return response()->json(['error' => 'Invalid status value. Allowed values are: positif, sembuh, meninggal'], 422);
            }

            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Validasi input
        try {
            $pasien = pasienModel::findOrFail($id);
            $pasien->delete();
            return response()->json(['message' => 'Resource deleted'], 200);

        // error handling    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'The request Not Found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in PasienController@destroy: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
