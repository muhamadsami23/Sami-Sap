import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Book, FileText, GraduationCap, Calendar, ChevronDown, ChevronUp, AlertCircle, Award, Percent } from 'lucide-react';

type GradeItemType = {
  id: number;
  item_id: string;
  student_id: string;
  course_id: string;
  description: string;
  upload_date: string;
  total_marks: number;
  obtained_marks: number;
  type: string;
};

type Course = {
  course_id: string;
  course_name: string;
  description: string;
  gradeItems: GradeItemType[];
};

const GradePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const studentId = sessionStorage.getItem('student_id');
        const response = await axios.post('http://localhost:5002/grades', { student_id: studentId });
        const data: Course[] = response.data;
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      } catch (err) {
        setError('Failed to fetch grades. Please try again later.');
        console.error('Error fetching grades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'assignment':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'exam':
        return <GraduationCap className="w-5 h-5 text-green-600" />;
      case 'quiz':
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <Book className="w-5 h-5 text-gray-600" />;
    }
  };

  const toggleAccordion = (type: string) => {
    setOpenAccordions(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const calculateOverallGrade = (gradeItems: GradeItemType[]) => {
    const totalObtained = gradeItems.reduce((sum, item) => sum + item.obtained_marks, 0);
    const totalMarks = gradeItems.reduce((sum, item) => sum + item.total_marks, 0);
    return (totalObtained / totalMarks) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Grade Overview</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <button
                key={course.course_id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 rounded text-left transition-all ${
                  selectedCourse?.course_id === course.course_id
                    ? 'bg-blue-100 border-blue-500 border-2'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="font-medium">{course.course_name}</div>
                <div className="text-sm text-gray-500 mt-1">{course.description}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <motion.div
            key={selectedCourse.course_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{selectedCourse.course_name}</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2 text-gray-700">Overall Grade</h3>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-blue-500 rounded-full h-4" 
                  style={{ width: `${calculateOverallGrade(selectedCourse.gradeItems).toFixed(2)}%` }}
                ></div>
              </div>
              <div className="text-right mt-1 text-sm text-gray-600">
                {calculateOverallGrade(selectedCourse.gradeItems).toFixed(2)}%
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 mb-8">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedCourse.gradeItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getIcon(item.type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.upload_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.obtained_marks} / {item.total_marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 rounded-full h-2" 
                            style={{ width: `${(item.obtained_marks / item.total_marks) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {((item.obtained_marks / item.total_marks) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-gray-700">Grade Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {['assignment', 'quiz', 'exam', 'project'].map((type) => {
                  const items = selectedCourse.gradeItems.filter(item => item.type.toLowerCase() === type);
                  if (items.length === 0) return null;

                  const totalObtained = items.reduce((sum, item) => sum + item.obtained_marks, 0);
                  const totalMarks = items.reduce((sum, item) => sum + item.total_marks, 0);
                  const percentage = (totalObtained / totalMarks) * 100;

                  return (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">{type}s</span>
                        <span className="text-sm text-gray-500">{percentage.toFixed(2)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 w-full">
                        <div 
                          className="bg-blue-500 rounded-full h-2" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GradePage;