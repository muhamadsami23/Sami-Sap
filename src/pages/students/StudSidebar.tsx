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

type Page = 'dashboard' | 'attendance' | 'schedule' | 'grades';

interface SidebarProps {
  onPageChange: (page: Page) => void;
}

const sidebarItems = [
  { name: 'Dashboard', icon: GraduationCap, page: 'dashboard' as Page },
  { name: 'Attendance', icon: ClipboardList, page: 'attendance' as Page },
  { name: 'Schedule', icon: Calendar, page: 'schedule' as Page },
  { name: 'Grades', icon: BarChart2, page: 'grades' as Page },
  { name: 'Courses', icon: BookOpen, page: 'dashboard' as Page },
  { name: 'Teachers', icon: Users, page: 'dashboard' as Page },
  { name: 'Assignments', icon: Briefcase, page: 'dashboard' as Page },
  { name: 'Transcript', icon: BookOpen, page: 'transcript' as Page },
  { name: 'Notifications', icon: Bell, page: 'dashboard' as Page },
  { name: 'Settings', icon: Settings, page: 'dashboard' as Page },
];

const StudSidebar: React.FC<SidebarProps> = ({ onPageChange }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed inset-0 z-30">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Student Portal</h1>
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

      {/* Content Area */}
      <div className="flex-grow ml-64 p-4">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default StudSidebar;
