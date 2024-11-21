import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Book, Users, Bell, Search, LogOut } from 'lucide-react';

const StudDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error

  const studentId = sessionStorage.getItem('student_id');  // Get the student_id from sessionStorage

  useEffect(() => {
    if (studentId) {
      setLoading(true); // Set loading to true before starting the fetch
      fetch('http://localhost:5002/student', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }), // Send student_id in the request body
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);  // Set error if there's one
          } else {
            setStudentData(data);  // Set student data
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

  if (loading) {
    return <div>Loading...</div>;  // Show loading text while waiting for response
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if there's any
  }

  return (
    <div className="min-h-screen  ">
    
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {studentData.name}</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white overflow-hidden shadow rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <p className="flex items-center text-sm text-gray-500">
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  {studentData.name}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  {studentData.email}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  {studentData.contact}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  {studentData.address}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  DOB: {studentData.dob}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white overflow-hidden shadow rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="space-y-3">
                <p className="flex items-center text-sm text-gray-500">
                  <GraduationCap className="mr-3 h-5 w-5 text-gray-400" />
                  Roll No: {studentData.roll_no}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Book className="mr-3 h-5 w-5 text-gray-400" />
                  Program: {studentData.program_name}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Users className="mr-3 h-5 w-5 text-gray-400" />
                  Section: {studentData.section_name}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  Semester: {studentData.semester}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  Enrollment Date: {studentData.enrollment_date}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-white overflow-hidden shadow rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex space-x-3">
                  <Book className="h-6 w-6 text-gray-400" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Assignment Submitted</h3>
                      <p className="text-sm text-gray-500">1h ago</p>
                    </div>
                    <p className="text-sm text-gray-500">You submitted the assignment for CS301 - Data Structures</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Exam Schedule Updated</h3>
                      <p className="text-sm text-gray-500">1d ago</p>
                    </div>
                    <p className="text-sm text-gray-500">The final exam schedule for this semester has been published</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudDashboard;