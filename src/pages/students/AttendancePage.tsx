import React, { useState, useEffect } from 'react';
import { Info, Calendar, Clock, Check, X } from 'lucide-react';

interface Course {
  course_id: string;
  course_name: string;
  description: string;
}

interface AttendanceRecord {
  lectureNo: number;
  date: string;
  duration: number;
  status: 'Present' | 'Absent';
}

const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  for (let i = 1; i <= 10; i++) {
    records.push({
      lectureNo: i,
      date: `2024-08-${i + 18}`,
      duration: 1,
      status: Math.random() > 0.2 ? 'Present' : 'Absent',
    });
  }
  return records;
};

const AttendancePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]); // Initialize the state for attendance records
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error
  
  const studentId = sessionStorage.getItem('student_id'); // Get the student_id from sessionStorage
  
  useEffect(() => {
    if (studentId) {
      setLoading(true); // Set loading to true before starting the fetch
      fetch('http://localhost:5002/courses', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }), // Send student_id in the request body
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error); // Set error if there's one
          } else {
            setStudentData(data); // Set student data
            // Optionally, you can store the attendance records here as well if needed.
          }
        })
        .catch((error) => {
          setError('Error fetching student data');
        })
        .finally(() => {
          setLoading(false); // Set loading to false when request is finished
        });
    }
  }, [studentId]);
  
  useEffect(() => {
    if (selectedCourse && studentData) {
      // Assuming the studentData contains attendance information, filter it for the selected course
      const courseAttendance = studentData.courses
        .find((course: Course) => course.course_id === selectedCourse.course_id)
        ?.attendance || [];
      setAttendanceRecords(courseAttendance);
    }
  }, [selectedCourse, studentData]);
  
  if (loading) {
    return <div>Loading...</div>; // Show loading text while waiting for response
  }
  
  if (error) {
    return <div>{error}</div>; // Show error message if there's any
  }
  
  const courses = studentData?.courses || []; // Assuming the courses are stored in studentData.courses
  
  // Calculate the total attendance percentage
  const totalAttendance = attendanceRecords.filter(
    (record) => record.status === 'Present'
  ).length / attendanceRecords.length * 100;
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 animate-fade-in-down">Attendance</h1>
  
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-r-lg shadow-md transition-all duration-300 hover:shadow-lg" role="alert">
        <div className="flex items-center">
          <Info className="mr-2 animate-pulse" />
          <span className="font-medium">Note!</span>
          <span className="ml-1">Attendance updates after 24 hours.</span>
        </div>
      </div>
  
      <div className="mb-6">
        <div className="flex justify-center space-x-2 overflow-x-auto py-2">
          {courses.map((course: Course) => (
            <button
              key={course.course_id} // Use course_id as the key
              onClick={() => setSelectedCourse(course)} // Set selected course
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCourse?.course_id === course.course_id
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {course.course_name} {/* Display course name */}
            </button>
          ))}
        </div>
      </div>
  
      {selectedCourse && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-2xl font-semibold">{selectedCourse.course_name}</h2>
          <p>{selectedCourse.description}</p>
        </div>
      )}
  
  {selectedCourse && (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{selectedCourse.course_name}</h2>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Attendance Percentage
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {totalAttendance.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${totalAttendance}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-in-out ${
              totalAttendance < 80 ? 'bg-red-500' : 'bg-blue-500'
            }`}
          ></div>
        </div>
      </div>
    </div>

    <table className="w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecture No</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (Hours)</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presence</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {attendanceRecords.map((attendance, index) => (
          <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-150`}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td> {/* Lecture Number */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {attendance.date ? new Date(attendance.date).toLocaleDateString() : "N/A"} {/* Attendance Date */}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {attendance.duration} {/* Duration of Lecture */}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  attendance.status === 'Present'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {attendance.status === 'Present' ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                {attendance.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
  
};

export default AttendancePage;
