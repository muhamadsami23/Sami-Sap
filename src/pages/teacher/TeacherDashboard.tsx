import React from 'react';
import { User, Book, Users, Calendar } from 'lucide-react';

interface TeacherInfo {
  name: string;
  subject: string;
  email: string;
  phone: string;
}

interface Course {
  id: string;
  name: string;
  students: number;
}

interface Section {
  id: string;
  name: string;
  course: string;
  students: number;
}

interface UpcomingClass {
  id: string;
  course: string;
  section: string;
  time: string;
  date: string;
}

const teacherInfo: TeacherInfo = {
  name: "Dr. Jane Smith",
  subject: "Computer Science",
  email: "jane.smith@university.edu",
  phone: "(555) 123-4567"
};

const courses: Course[] = [
  { id: "CS101", name: "Introduction to Programming", students: 150 },
  { id: "CS201", name: "Data Structures", students: 100 },
  { id: "CS301", name: "Algorithms", students: 75 },
];

const sections: Section[] = [
  { id: "CS101-A", name: "Section A", course: "Introduction to Programming", students: 50 },
  { id: "CS101-B", name: "Section B", course: "Introduction to Programming", students: 50 },
  { id: "CS101-C", name: "Section C", course: "Introduction to Programming", students: 50 },
  { id: "CS201-A", name: "Section A", course: "Data Structures", students: 50 },
  { id: "CS201-B", name: "Section B", course: "Data Structures", students: 50 },
  { id: "CS301-A", name: "Section A", course: "Algorithms", students: 75 },
];

const upcomingClasses: UpcomingClass[] = [
  { id: "1", course: "CS101", section: "Section A", time: "09:00 AM", date: "2023-05-15" },
  { id: "2", course: "CS201", section: "Section B", time: "11:00 AM", date: "2023-05-15" },
  { id: "3", course: "CS301", section: "Section A", time: "02:00 PM", date: "2023-05-16" },
  { id: "4", course: "CS101", section: "Section C", time: "10:00 AM", date: "2023-05-17" },
];

const TeacherDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> Teacher Information
          </h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {teacherInfo.name}</p>
            <p><strong>Subject:</strong> {teacherInfo.subject}</p>
            <p><strong>Email:</strong> {teacherInfo.email}</p>
            <p><strong>Phone:</strong> {teacherInfo.phone}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Book className="mr-2" /> Courses
          </h2>
          <ul className="space-y-2">
            {courses.map(course => (
              <li key={course.id} className="flex justify-between items-center">
                <span>{course.name}</span>
                <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-sm">
                  {course.students} students
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" /> Sections
          </h2>
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id} className="flex justify-between items-center">
                <span>{section.name} - {section.course}</span>
                <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm">
                  {section.students} students
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" /> Upcoming Classes
          </h2>
          <ul className="space-y-2">
            {upcomingClasses.map(cls => (
              <li key={cls.id} className="flex justify-between items-center">
                <span>{cls.course} - {cls.section}</span>
                <span className="text-sm text-gray-600">{cls.date} at {cls.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;