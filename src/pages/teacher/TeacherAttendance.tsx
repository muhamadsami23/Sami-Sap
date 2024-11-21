'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, X, Plus } from 'lucide-react'

// Mock data for sections and students
const sections = [
  { id: 1, name: 'Section A' },
  { id: 2, name: 'Section B' },
  { id: 3, name: 'Section C' },
]

const students = [
  { id: 1, name: 'Alice Johnson', section: 1 },
  { id: 2, name: 'Bob Smith', section: 1 },
  { id: 3, name: 'Charlie Brown', section: 1 },
  { id: 4, name: 'David Lee', section: 2 },
  { id: 5, name: 'Eva Martinez', section: 2 },
  { id: 6, name: 'Frank Wilson', section: 3 },
  { id: 7, name: 'Grace Taylor', section: 3 },
]

type AttendanceStatus = 'P' | 'A' | 'L'

interface AttendanceRecord {
  studentId: number
  status: AttendanceStatus
}

export default function AttendancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [savedRecords, setSavedRecords] = useState<{date: string, section: number, records: AttendanceRecord[]}[]>([])

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(Number(event.target.value))
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value))
  }

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => {
      const existing = prev.find(record => record.studentId === studentId)
      if (existing) {
        return prev.map(record =>
          record.studentId === studentId ? { ...record, status } : record
        )
      } else {
        return [...prev, { studentId, status }]
      }
    })
  }

  const getAttendanceStatus = (studentId: number): AttendanceStatus | undefined => {
    return attendance.find(record => record.studentId === studentId)?.status
  }

  const filteredStudents = students.filter(student => student.section === selectedSection)

  const saveAttendance = () => {
    if (selectedSection && selectedDate) {
      setSavedRecords(prev => [
        ...prev,
        {
          date: selectedDate.toISOString().split('T')[0],
          section: selectedSection,
          records: attendance
        }
      ])
      setIsModalOpen(false)
      setAttendance([])
      setSelectedSection(null)
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      setAttendance([])
      setSelectedSection(null)
    }
  }, [isModalOpen])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-12">
          <Users className="inline-block mr-2 mb-1" size={36} />
          Attendance Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-150" size={20} />
          Add Attendance
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add Attendance</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                  <select
                    id="section"
                    onChange={handleSectionChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a section</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    onChange={handleDateChange}
                    value={selectedDate.toISOString().split('T')[0]}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {selectedSection && selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Student Attendance</h3>
                    <div className="space-y-2">
                      {filteredStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <span className="font-medium text-gray-900">{student.name}</span>
                          <div className="flex space-x-2">
                            {[
                              { status: 'P', icon: CheckCircle, color: 'text-green-600' },
                              { status: 'A', icon: XCircle, color: 'text-red-600' },
                              { status: 'L', icon: Clock, color: 'text-yellow-600' }
                            ].map(({ status, icon: Icon, color }) => (
                              <button
                                key={status}
                                onClick={() => handleAttendanceChange(student.id, status as AttendanceStatus)}
                                className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                  getAttendanceStatus(student.id) === status
                                    ? `bg-indigo-100 ${color}`
                                    : 'text-gray-400 hover:text-gray-500'
                                }`}
                              >
                                <Icon size={20} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAttendance}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display attendance records */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Attendance Records</h2>
          {savedRecords.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sections.find(s => s.id === record.section)?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {record.records.filter(a => a.status === 'P').length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {record.records.filter(a => a.status === 'A').length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {record.records.filter(a => a.status === 'L').length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding new attendance records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}