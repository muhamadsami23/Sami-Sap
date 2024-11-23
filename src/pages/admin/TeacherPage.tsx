"use client";

import React, { useState } from "react";
import { Trash2, Edit, Eye } from "lucide-react";

// Define the structure of a teacher record
interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  department: string;
}

// Sample teacher data
const initialTeachers: Teacher[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", subject: "Math", department: "Mathematics" },
  { id: 2, name: "Mark Brown", email: "mark@example.com", subject: "Physics", department: "Science" },
  { id: 3, name: "Laura White", email: "laura@example.com", subject: "English", department: "Arts" },
];

export default function TeacherRecords() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  const handleUpdate = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map((teacher) => (teacher.id === updatedTeacher.id ? updatedTeacher : teacher)));
    setIsEditModalOpen(false);
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Subject</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4">{teacher.subject}</td>
                <td className="py-2 px-4">{teacher.department}</td>
                <td className="py-2 px-4 space-x-2">
                  <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleView(teacher)}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-green-500 text-white rounded" onClick={() => handleEdit(teacher)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-red-500 text-white rounded" onClick={() => handleDelete(teacher.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Teacher Information</h2>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedTeacher.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedTeacher.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedTeacher.subject}
              </p>
              <p>
                <strong>Department:</strong> {selectedTeacher.department}
              </p>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsViewModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedTeacher = {
                  ...selectedTeacher,
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  subject: formData.get("subject") as string,
                  department: formData.get("department") as string,
                };
                handleUpdate(updatedTeacher);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={selectedTeacher.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedTeacher.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  defaultValue={selectedTeacher.subject}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  defaultValue={selectedTeacher.department}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Update Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
