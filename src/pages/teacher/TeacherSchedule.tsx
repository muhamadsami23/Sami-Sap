'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Book, Users } from 'lucide-react'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const initialSchedule = [
  { day: 'Monday', classes: [
    { time: '09:00 AM - 10:30 AM', course: 'Intro to Programming', room: 'Room 101', students: 25 },
    { time: '11:00 AM - 12:30 PM', course: 'Data Structures', room: 'Room 203', students: 20 },
  ]},
  { day: 'Tuesday', classes: [
    { time: '10:00 AM - 11:30 AM', course: 'Algorithms', room: 'Room 105', students: 22 },
    { time: '02:00 PM - 03:30 PM', course: 'Web Development', room: 'Lab 2', students: 28 },
  ]},
  { day: 'Wednesday', classes: [
    { time: '09:00 AM - 10:30 AM', course: 'Intro to Programming', room: 'Room 101', students: 25 },
    { time: '01:00 PM - 02:30 PM', course: 'Database Systems', room: 'Room 204', students: 18 },
  ]},
  { day: 'Thursday', classes: [
    { time: '11:00 AM - 12:30 PM', course: 'Data Structures', room: 'Room 203', students: 20 },
    { time: '03:00 PM - 04:30 PM', course: 'Software Engineering', room: 'Room 301', students: 24 },
  ]},
  { day: 'Friday', classes: [
    { time: '10:00 AM - 11:30 AM', course: 'Algorithms', room: 'Room 105', students: 22 },
    { time: '02:00 PM - 03:30 PM', course: 'Web Development', room: 'Lab 2', students: 28 },
  ]},
]

export default function TeacherSchedule() {
  const [currentWeek, setCurrentWeek] = useState(0)

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => prev - 1)
  }

  const goToNextWeek = () => {
    setCurrentWeek(prev => prev + 1)
  }

  const getWeekDates = () => {
    const today = new Date()
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7))
    return daysOfWeek.map((day, index) => {
      const date = new Date(firstDayOfWeek)
      date.setDate(date.getDate() + index)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
  }

  const weekDates = getWeekDates()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-12">
          <Calendar className="inline-block mr-2 mb-1" size={36} />
          Teacher Schedule
        </h1>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-indigo-800">
            Week of {weekDates[0]} - {weekDates[4]}
          </h2>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Next week"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {initialSchedule.map((daySchedule, index) => (
            <div key={daySchedule.day} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 text-white py-3 px-4">
                <h3 className="font-semibold text-lg">{daySchedule.day}</h3>
                <p className="text-sm text-indigo-200">{weekDates[index]}</p>
              </div>
              <div className="p-4 space-y-4">
                {daySchedule.classes.map((classInfo, classIndex) => (
                  <div key={classIndex} className="bg-indigo-50 rounded-md p-3 transition duration-300 ease-in-out hover:shadow-md">
                    <p className="font-medium text-indigo-900 flex items-center">
                      <Clock size={16} className="mr-1 text-indigo-700" />
                      {classInfo.time}
                    </p>
                    <p className="text-indigo-800 mt-1 flex items-center">
                      <Book size={16} className="mr-1 text-indigo-700" />
                      {classInfo.course}
                    </p>
                    <p className="text-sm text-indigo-600 mt-1 flex items-center">
                      <MapPin size={16} className="mr-1 text-indigo-700" />
                      {classInfo.room}
                    </p>
                    <p className="text-sm text-indigo-600 mt-1 flex items-center">
                      <Users size={16} className="mr-1 text-indigo-700" />
                      {classInfo.students} students
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}