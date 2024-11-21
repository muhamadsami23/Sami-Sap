import React from 'react';
import {
  GraduationCap,
  ClipboardList,
  Calendar,
  BarChart2,
  Users,
  Settings,
  BookOpen,
  Briefcase,
  Bell,
  LogOut,
} from 'lucide-react';

type Page = 'dashboard' | 'attendance' | 'schedule' | 'assignment' | 'grades';

interface SidebarProps {
  onPageChange: (page: Page) => void;
}

const sidebarItems = [
  { name: 'Dashboard', icon: GraduationCap, page: 'dashboard' as Page },
  { name: 'Manage Attendance', icon: ClipboardList, page: 'attendance' as Page },
  { name: 'Schedule', icon: Calendar, page: 'schedule' as Page },
  { name: 'Manage Grades', icon: BarChart2, page: 'grades' as Page },
  { name: 'Upload Assignments', icon: Briefcase, page: 'assignment' as Page },
  { name: 'Notifications', icon: Bell, page: 'dashboard' as Page },
  { name: 'Settings', icon: Settings, page: 'dashboard' as Page },
];

const TeacherSidebar: React.FC<SidebarProps> = ({ onPageChange }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white sidebar">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-2xl font-bold">Teacher Portal</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 py-4">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onPageChange(item.page)}
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
    </div>
  );
};

export default TeacherSidebar;
