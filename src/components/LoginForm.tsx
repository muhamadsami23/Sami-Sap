'use client'

import React, { useState, useEffect } from 'react'
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

export default function Login({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role:'',
    student_id:''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === 'username') {
      validateUsername(value)
    } else if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError('Username is required.')
    } else {
      setUsernameError('')
    }
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the username and password for debugging
    console.log("Form Data Submitted:", formData);
    
    if (usernameError || passwordStrength < 3) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the errors in the form.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    
    try {
      const url = 'http://localhost:5002/login';
      console.log("API URL:", url); // Log the API endpoint
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    
    console.log("API Response Status:", response.status); // Log the response status
    
    const result = await response.json();
    console.log("API Response Data:", result.message); // This will log the login message
    
    if (response.ok) {
      console.log("User's username from session:", formData.username);
  
      // Store session and username in sessionStorage
  
  
      // Get the role from the API response (now it should be result.userRole)
      const userRole = result.userRole; // 'userRole' contains the role sent by the backend
      const studentID = result.studentId;

      sessionStorage.setItem('sessionId', result.sessionId);
      sessionStorage.setItem('userUsername', formData.username);
      sessionStorage.setItem('role', userRole);
      sessionStorage.setItem('student_id', studentID); // This will store the student_id correctly.

      console.log("Role from session:", sessionStorage.getItem('role'));
      console.log("ID from session:", sessionStorage.getItem('student_id'));

      // Check the user role and show appropriate message
      if (userRole === "student") {
          // Welcome student and redirect to the student dashboard
          Swal.fire({
              title: 'Login Successful',
              text: `Welcome student, ${formData.username}!`,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#10B981',
          }).then(() => {
              // Redirect to student dashboard page
              window.location.href = '/Student';
          });
      } else if (userRole === "teacher") {
          // Welcome teacher and show appropriate message
          Swal.fire({
              title: 'Login Successful',
              text: `Welcome teacher, ${formData.username}!`,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#10B981',
          }).then(() => {
              // You can redirect to a different page for teachers
              window.location.href = '/teacher';
          });
      } else {
          // If userRole is something else (optional default case)
          Swal.fire({
              title: 'Login Successful',
              text: `Welcome, ${formData.username}! Your role is: ${userRole}`,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#10B981',
          }).then(() => {
              // Redirect to home page if needed
              window.location.href = '/admin';
          });
      }
  
  } else {
      Swal.fire({
          title: 'Error',
          text: result.message || 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'OK',
      });
  }
  
  } catch (error) {
      console.error("Error connecting to the server:", error); // Log the error
      Swal.fire({
          title: 'Error',
          text: 'Failed to connect to the server',
          icon: 'error',
          confirmButtonText: 'OK',
      });
  }
  
    
    setFormData({
      username: '',
      password: '',
      role: '',
      student_id:''
    });
  };
  
  

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-green" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green">
            Login
          </h2>
         
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 appearance-none block w-full px-3 py-2 border ${
                    usernameError ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="Username"
                />
              </div>
              {usernameError && (
                <p className="mt-2 text-sm text-red-600" id="username-error">
                  <AlertCircle className="h-5 w-5 text-red-500 inline mr-1" />
                  {usernameError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-1/4 ${
                        passwordStrength >= level ? 'bg-green-500' : 'bg-gray-200'
                      } mr-1 rounded-full`}
                    ></div>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {passwordStrength < 3
                    ? 'Password should be at least 8 characters long and include uppercase, lowercase, number, and special character.'
                    : 'Strong password!'}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
