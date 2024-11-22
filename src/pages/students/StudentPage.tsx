import React, { useState } from 'react';
import StudentSidebar from './StudSidebar'; // Adjust the import path as necessary
import StudentDashboard from './StudDashboard'; // Adjust the import path as necessary
import AttendancePage from './AttendancePage'; // Import the Attendance Page component
import SchedulePage from './Timetable'; // Import the Schedule Page component
import GradePage from './Grades';
import CoursePage from './CoursePage';
import AssginmentPage from './AssignmentPage';
import app from '../../App';

const StudentPage = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'attendance' | 'schedule' | 'grades' | 'courses' | 'assignments'>('dashboard');

  const handlePageChange = (page: 'dashboard' | 'attendance' | 'schedule' | 'grades'| 'courses' | 'assignments') => {
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
      <StudentSidebar onPageChange={handlePageChange} />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {currentPage === 'dashboard' && <StudentDashboard />}
        {currentPage === 'attendance' && <AttendancePage />} {/* Render the AttendancePage component */}
        {currentPage === 'schedule' && <SchedulePage />} {/* Render the SchedulePage component */}
        {currentPage === 'grades' && <GradePage />}
        {currentPage === 'courses' && <CoursePage />}
        {currentPage === 'assignments' && <AssginmentPage />}

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

export default StudentPage;
