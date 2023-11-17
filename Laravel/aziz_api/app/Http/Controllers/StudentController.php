<?php

namespace App\Http\Controllers;

use App\Models\Studen;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $name = $request->input('name');
        $email = $request->input('email');
        $nim = $request->input('nim');
        $email = $request->input('email');
        $jurusan = $request->input('jurusan');

        $sortBy = $request->input('sortBy');
        $order = $request->input('order');

        if(!in_array($order, ['asc', 'desc'])) {
            return response()->json([
                'message' => 'Invalid order'
            ], 400);
        }

        $query = Studen::query();

        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        if ($nim) {
            $query->where('nim', 'like', '%' . $nim . '%');
        }
        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }
        if ($jurusan) {
            $query->where('jurusan', 'like', '%' . $jurusan . '%');
        }

        $query->orderBy($sortBy, $order);
        $sizePage = $request->input('sizePage',10);
        $studens = $query->paginate($sizePage);

        $data = [
            'message' => 'success',
            'data' => $studens,
            'rows' => $studens->count(),
            'page' => $studens->currentPage(),
            'last_page' => $studens->lastPage()
        ];

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'students' => 'required|array',
            'students.*.nama' => 'required',
            'students.*.nim' => 'required',
            'students.*.email' => 'required|email',
            'students.*.jurusan' => 'required'
        ]);

        $studentsData = $request->input('students');

        // Use Eloquent's insert method for bulk insertion
        $students = Studen::insert($studentsData);

        $data = [
            'message' => 'Students created successfully',
            'data' => $students
        ];

        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Studen $studen)
    {
        $student = Studen::find($studen);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $data = [
            'message' => 'success',
            'data' => $student
        ];

        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Studen $id)
    {
        $this->validate($request, [
            'nama' => 'required',
            'nim' => 'required',
            'email' => 'required|email',
            'jurusan' => 'required',
        ]);

        $student = Studen::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->update($request->all());

        if ($student->wasChanged()) {
            $data = [
                'message' => 'Student updated successfully',
                'data' => $student
            ];

            return response()->json($data, 200);
        } else {
            return response()->json(['message' => 'No changes made'], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Studen $id)
    {
        $student = Studen::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->delete();

        $data = [
            'message' => 'Student deleted successfully',
        ];

        return response()->json($data, 200);
    }
}
