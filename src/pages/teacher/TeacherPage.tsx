import React, { useState } from 'react';
import TeacherSidebar from './TeacherSidebar'; // Adjust the import path as necessary
import TeacherDashboard from './TeacherDashboard';
import TeacherAttendance from './TeacherAttendance';
import TeacherSchedule from './TeacherSchedule';
import ManageAssignments from './ManageAssignments';
import ManageGrades from './ManageGrades';
import app from '../../App';

const TeacherPage = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'attendance' | 'schedule' | 'assignment' | 'grades'>('dashboard');

  const handlePageChange = (page: 'dashboard' | 'attendance' | 'schedule' | 'assignment' | 'grades') => {
    setCurrentPage(page);
  };
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/'; // Redirect to the login page using React Router (adjust the route if needed)

  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <TeacherSidebar onPageChange={handlePageChange} />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {currentPage === 'dashboard' && <TeacherDashboard />}
        {currentPage === 'attendance' && <TeacherAttendance />} 
        {currentPage === 'schedule' && <TeacherSchedule />} 
        {currentPage === 'assignment' && <ManageAssignments />}
        {currentPage === 'grades' && <ManageGrades />}

      </div>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherPage;
