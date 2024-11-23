"use client"

import React, { useState } from 'react'
import { Trash2, Edit, Eye } from 'lucide-react'

// Define the structure of a student record
interface Student {
  id: number
  name: string
  email: string
  grade: string
  major: string
}

// Sample student data
const initialStudents: Student[] = [
  { id: 1, name: "John Doe", email: "john@example.com", grade: "A", major: "Computer Science" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", grade: "B", major: "Mathematics" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", grade: "C", major: "Physics" },
]

export default function StudentRecords() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = (id: number) => {
    setStudents(students.filter(student => student.id !== id))
  }

  const handleUpdate = (updatedStudent: Student) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ))
    setIsEditModalOpen(false)
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setIsViewModalOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Grade</th>
              <th className="py-2 px-4 text-left">Major</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4">{student.grade}</td>
                <td className="py-2 px-4">{student.major}</td>
                <td className="py-2 px-4 space-x-2">
                  <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleView(student)}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-green-500 text-white rounded" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-red-500 text-white rounded" onClick={() => handleDelete(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Student Information</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Grade:</strong> {selectedStudent.grade}</p>
              <p><strong>Major:</strong> {selectedStudent.major}</p>
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updatedStudent = {
                ...selectedStudent,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                grade: formData.get('grade') as string,
                major: formData.get('major') as string,
              }
              handleUpdate(updatedStudent)
            }} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  id="name" 
                  name="name" 
                  defaultValue={selectedStudent.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  defaultValue={selectedStudent.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
                <input 
                  id="grade" 
                  name="grade" 
                  defaultValue={selectedStudent.grade}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700">Major</label>
                <input 
                  id="major" 
                  name="major" 
                  defaultValue={selectedStudent.major}
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
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

