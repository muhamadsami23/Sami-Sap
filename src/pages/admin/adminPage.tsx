import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar'; // Adjust the import path as necessary
import AdminDashboard from './AdminDashboard'; // Adjust the import path as necessary
import StudentRecordPage from './StudentRecord'; // Import the Student Record Page component
import TeacherRecordPage from './TeacherPage'; // Import the Teacher Record Page component
//import ScheduleTimetablePage from './ScheduleTimeTable.tsx'; // Import the Schedule Timetable Page component
import ExamSchedulePage from './ExamSchedulePage'; // Import the Exam Schedule Page component

const AdminPage = () => {
  const [currentPage, setCurrentPage] = useState<
    'dashboard' | 'Student Record' | 'Teacher Record' | 'Schedule Timetable' | 'Exam Schedule'
  >('dashboard');

  const handlePageChange = (
    page: 'dashboard' | 'Student Record' | 'Teacher Record' | 'Schedule Timetable' | 'Exam Schedule'
  ) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar onPageChange={handlePageChange} />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {currentPage === 'dashboard' && <AdminDashboard />}
        {currentPage === 'Student Record' && <StudentRecordPage />}
        {currentPage === 'Teacher Record' && <TeacherRecordPage />}
        {currentPage === 'Exam Schedule' && <ExamSchedulePage />}
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

export default AdminPage;


//{currentPage === 'Schedule Timetable' && <ScheduleTimetablePage />}
