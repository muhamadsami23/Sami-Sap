import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Upload, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { format, isValid } from 'date-fns'; // Import `isValid` to check date validity

interface Assignment {
  assignment_id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: string;
  course_name: string;
  status: 'submitted' | 'due' | 'missed';
  submission_date: string | null;
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const studentId = sessionStorage.getItem('student_id');
        const response = await axios.post('http://localhost:5002/student-assignments', { student_id: studentId });
        setAssignments(response.data);
      } catch (err) {
        setError('Failed to fetch assignments. Please try again later.');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmitAssignment = async (assignmentId: number, file: File) => {
    console.log(`Uploading file for assignment ${assignmentId}:`, file);
    setAssignments(assignments.map(a => 
      a.assignment_id === assignmentId 
        ? { ...a, status: 'submitted', submission_date: new Date().toISOString() } 
        : a
    ));
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Assignments
      </motion.h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <caption className="text-lg font-semibold mb-2">A list of your assignments</caption>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <tr key={assignment.assignment_id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{assignment.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.course_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isValid(new Date(assignment.submission_date)) ? format(new Date(assignment.submission_date), 'PPP') : 'Invalid Date'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignment.status === 'submitted' && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Submitted
                    </span>
                  )}
                  {assignment.status === 'due' && (
                    <span className="flex items-center text-yellow-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Due
                    </span>
                  )}
                  {assignment.status === 'missed' && (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Missed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignment.status === 'due' && (
                    <button
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsModalOpen(true);
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Submit
                    </button>
                  )}
                  {assignment.status === 'submitted' && (
                    <span className="text-sm text-gray-500">
                      Submitted on {isValid(new Date(assignment.submission_date!)) ? format(new Date(assignment.submission_date!), 'PPP') : 'Invalid Date'}
                    </span>
                  )}
                  {assignment.status === 'missed' && (
                    <span className="text-sm text-red-500">Deadline passed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedAssignment && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Submit Assignment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Upload your assignment file here. Make sure it's the correct file before submitting.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <input
                    type="file"
                    id="assignment-file"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    const fileInput = document.getElementById('assignment-file') as HTMLInputElement;
                    if (fileInput && fileInput.files?.length) {
                      handleSubmitAssignment(selectedAssignment.assignment_id, fileInput.files[0]);
                    }
                  }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
