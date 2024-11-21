import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, FileText, PenTool, GraduationCap, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface GradeItem {
  id: number;
  student_id: number;
  item_id: number;
  course_id: string;
  description: string;
  upload_date: string;
  total_marks: number;
  obtained_marks?: number;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
}

interface Course {
  id: string;
  name: string;
  gradeItems: GradeItem[];
}

const courses: Course[] = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    gradeItems: [
      { id: 1, student_id: 1, item_id: 101, course_id: 'CS101', description: 'Assignment 1', upload_date: '2023-05-01', total_marks: 100, obtained_marks: 85, type: 'assignment' },
      { id: 2, student_id: 1, item_id: 201, course_id: 'CS101', description: 'Quiz 1', upload_date: '2023-05-10', total_marks: 50, obtained_marks: 45, type: 'quiz' },
      { id: 3, student_id: 1, item_id: 301, course_id: 'CS101', description: 'Midterm Exam', upload_date: '2023-06-15', total_marks: 100, obtained_marks: 78, type: 'exam' },
    ],
  },
  {
    id: 'MATH201',
    name: 'Calculus II',
    gradeItems: [
      { id: 4, student_id: 1, item_id: 102, course_id: 'MATH201', description: 'Problem Set 1', upload_date: '2023-05-05', total_marks: 50, obtained_marks: 48, type: 'assignment' },
      { id: 5, student_id: 1, item_id: 202, course_id: 'MATH201', description: 'Quiz 1', upload_date: '2023-05-20', total_marks: 30, obtained_marks: 28, type: 'quiz' },
      { id: 6, student_id: 1, item_id: 302, course_id: 'MATH201', description: 'Final Project', upload_date: '2023-06-30', total_marks: 200, obtained_marks: 185, type: 'project' },
    ],
  },
];

const GradeItem: React.FC<{ item: GradeItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'quiz': return <PenTool className="w-5 h-5 text-green-500" />;
      case 'project': return <Book className="w-5 h-5 text-purple-500" />;
      case 'exam': return <GraduationCap className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          {getIcon(item.type)}
          <span className="font-medium">{item.description}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {item.obtained_marks}/{item.total_marks}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-medium">ID:</span> {item.id}</p>
              <p><span className="font-medium">Item ID:</span> {item.item_id}</p>
              <p><span className="font-medium">Course ID:</span> {item.course_id}</p>
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span className="font-medium mr-1">Upload Date:</span> {item.upload_date}
              </p>
              <p><span className="font-medium">Total Marks:</span> {item.total_marks}</p>
              {item.obtained_marks && (
                <p><span className="font-medium">Obtained Marks:</span> {item.obtained_marks}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GradePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Grade Overview</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Course</h2>
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedCourse.id === course.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{course.name}</div>
                <div className="text-sm">{course.id}</div>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCourse.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">{selectedCourse.name}</h2>
          <div className="space-y-4">
            {selectedCourse.gradeItems.map((item) => (
              <GradeItem key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GradePage;