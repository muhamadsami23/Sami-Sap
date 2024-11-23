'use client'

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import StudentPage from './pages/students/StudentPage';
import TeacherPage from './pages/teacher/TeacherPage';
import AdminPage from './pages/admin/adminPage';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  // Check for stored role in sessionStorage on page load
  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  }, []);

  // Handle the login process
  const handleLogin = (username: string, password: string) => {
    // Assuming successful login:
    const userRole = sessionStorage.getItem('role'); // This would come from your API or authentication service
    sessionStorage.setItem('userRole', userRole);
    setRole(userRole);
    setIsLoggedIn(true);
  };

  // Redirect users based on their role
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'student':
        return <Navigate to="/student" />;
      case 'teacher':
        return <Navigate to="/teacher" />;
      case 'admin':
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/student" element={<StudentPage />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Redirect to the appropriate page based on user role */}
            <Route path="/" element={redirectBasedOnRole(role!)} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
