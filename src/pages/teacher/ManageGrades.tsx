'use client'

import React, { useState } from 'react'
import { Book, Search, Edit2, Save, X, Upload, FileText, PenTool, Plus, Check } from 'lucide-react'

type GradeType = 'assignment' | 'midterm' | 'final'

interface Student {
  id: number
  name: string
}

interface Assignment {
  id: number
  name: string
  totalMarks: number
}

interface Grade {
  studentId: number
  assignmentId?: number
  type: GradeType
  marks: number
  totalMarks: number
}

const students: Student[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'David Lee' },
  { id: 5, name: 'Eva Martinez' },
]

const initialAssignments: Assignment[] = [
  { id: 1, name: 'Assignment 1', totalMarks: 100 },
  { id: 2, name: 'Assignment 2', totalMarks: 50 },
  { id: 3, name: 'Assignment 3', totalMarks: 75 },
]

const initialGrades: Grade[] = [
  { studentId: 1, assignmentId: 1, type: 'assignment', marks: 85, totalMarks: 100 },
  { studentId: 2, assignmentId: 1, type: 'assignment', marks: 78, totalMarks: 100 },
  { studentId: 1, type: 'midterm', marks: 88, totalMarks: 100 },
  { studentId: 2, type: 'midterm', marks: 92, totalMarks: 100 },
]

export default function ManageGrades() {
  const [grades, setGrades] = useState<Grade[]>(initialGrades)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [activeTab, setActiveTab] = useState<GradeType>('assignment')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [newAssignment, setNewAssignment] = useState<Assignment | null>(null)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGradeChange = (studentId: number, assignmentId: number | undefined, type: GradeType, marks: number, totalMarks: number) => {
    const updatedGrades = grades.map(grade => 
      (grade.studentId === studentId && grade.assignmentId === assignmentId && grade.type === type)
        ? { ...grade, marks, totalMarks }
        : grade
    )
    if (!updatedGrades.some(grade => grade.studentId === studentId && grade.assignmentId === assignmentId && grade.type === type)) {
      updatedGrades.push({ studentId, assignmentId, type, marks, totalMarks })
    }
    setGrades(updatedGrades)
  }

  const handleSave = () => {
    if (editingGrade) {
      handleGradeChange(editingGrade.studentId, editingGrade.assignmentId, editingGrade.type, editingGrade.marks, editingGrade.totalMarks)
      setEditingGrade(null)
    }
  }

  const handleAddAssignment = () => {
    if (newAssignment) {
      setAssignments([...assignments, { ...newAssignment, id: assignments.length + 1 }])
      setNewAssignment(null)
    }
  }

  const renderAssignmentGrades = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-600">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student</th>
            {assignments.map(assignment => (
              <th key={assignment.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                {assignment.name}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              <button
                onClick={() => setNewAssignment({ id: 0, name: `Assignment ${assignments.length + 1}`, totalMarks: 100 })}
                className="text-white hover:text-teal-200 focus:outline-none"
                aria-label="Add new assignment"
              >
                <Plus size={18} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map(student => (
            <tr key={student.id} className="hover:bg-teal-50 transition-colors duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
              {assignments.map(assignment => {
                const grade = grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id && g.type === 'assignment')
                return (
                  <td key={assignment.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      value={grade ? grade.marks : ''}
                      onChange={(e) => handleGradeChange(student.id, assignment.id, 'assignment', Number(e.target.value), assignment.totalMarks)}
                      className="w-16 mr-2 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      min="0"
                      max={assignment.totalMarks}
                      aria-label={`${student.name}'s marks for ${assignment.name}`}
                    />
                    <span className="text-gray-400">/ {assignment.totalMarks}</span>
                  </td>
                )
              })}
              {newAssignment && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    className="w-16 mr-2 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    min="0"
                    max={newAssignment.totalMarks}
                    aria-label={`${student.name}'s marks for new assignment`}
                  />
                  <span className="text-gray-400">/ {newAssignment.totalMarks}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {newAssignment && (
        <div className="mt-4 flex items-center space-x-4">
          <input
            type="text"
            value={newAssignment.name}
            onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
            className="border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Assignment name"
          />
          <input
            type="number"
            value={newAssignment.totalMarks}
            onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: Number(e.target.value) })}
            className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Total marks"
            min="1"
          />
          <button
            onClick={handleAddAssignment}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Check size={18} className="mr-1" />
            Add
          </button>
        </div>
      )}
    </div>
  )

  const renderExamGrades = (type: 'midterm' | 'final') => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-600">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Marks</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map(student => {
            const grade = grades.find(g => g.studentId === student.id && g.type === type)
            return (
              <tr key={student.id} className="hover:bg-teal-50 transition-colors duration-150 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingGrade && editingGrade.studentId === student.id && editingGrade.type === type ? (
                    <>
                      <input
                        type="number"
                        value={editingGrade.marks}
                        onChange={(e) => setEditingGrade({ ...editingGrade, marks: Number(e.target.value) })}
                        className="w-16 mr-2 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        min="0"
                        max={editingGrade.totalMarks}
                        aria-label={`${student.name}'s ${type} marks`}
                      />
                      <span className="text-gray-400">/ </span>
                      <input
                        type="number"
                        value={editingGrade.totalMarks}
                        onChange={(e) => setEditingGrade({ ...editingGrade, totalMarks: Number(e.target.value) })}
                        className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        min="1"
                        aria-label={`${student.name}'s ${type} total marks`}
                      />
                    </>
                  ) : (
                    grade ? `${grade.marks} / ${grade.totalMarks}` : '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingGrade && editingGrade.studentId === student.id && editingGrade.type === type ? (
                    <>
                      <button onClick={handleSave} className="text-teal-600 hover:text-teal-900 mr-2" aria-label="Save changes">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingGrade(null)} className="text-red-600 hover:text-red-900" aria-label="Cancel changes">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditingGrade({ 
                        studentId: student.id, 
                        type, 
                        marks: grade ? grade.marks : 0, 
                        totalMarks: grade ? grade.totalMarks : 100 
                      })} 
                      className="text-indigo-600 hover:text-indigo-900"
                      aria-label={`Edit ${student.name}'s ${type} marks`}
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-teal-900 mb-12">
          <Book className="inline-block mr-2 mb-1" size={36} />
          Manage Grades
        </h1>
        <div className="mb-8 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search students"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-4 py-2 rounded-md ${activeTab === 'assignment' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}
            >
              <FileText className="inline-block mr-2 mb-1" size={18} />
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('midterm')}
              className={`px-4 py-2 rounded-md ${activeTab === 'midterm' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}
            >
              <PenTool className="inline-block mr-2 mb-1" size={18} />
              Mid-term
            </button>
            <button
              onClick={() => setActiveTab('final')}
              className={`px-4 py-2 rounded-md ${activeTab === 'final' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}
            >
              <Upload className="inline-block mr-2 mb-1" size={18} />
              Final
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {activeTab === 'assignment' && renderAssignmentGrades()}
          {activeTab === 'midterm' && renderExamGrades('midterm')}
          {activeTab === 'final' && renderExamGrades('final')}
        </div>
      </div>
    </div>
  )
}