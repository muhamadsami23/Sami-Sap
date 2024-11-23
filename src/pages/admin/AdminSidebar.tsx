import React from 'react';
import {
  Home,
  Users,
  ClipboardList,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';

type Page =
  | 'dashboard'
  | 'Student Record'
  | 'Teacher Record'
  | 'Schedule Timetable'
  | 'Exam Schedule';

interface SidebarProps {
  onPageChange: (page: Page) => void;
}

const adminSidebarItems = [
  { name: 'Dashboard', icon: Home, page: 'dashboard' as Page },
  { name: 'Student Record', icon: Users, page: 'Student Record' as Page },
  { name: 'Teacher Record', icon: ClipboardList, page: 'Teacher Record' as Page },
  { name: 'Schedule Timetable', icon: Calendar, page: 'Schedule Timetable' as Page },
  { name: 'Exam Schedule', icon: FileText, page: 'Exam Schedule' as Page },
  { name: 'Notifications', icon: Bell, page: 'dashboard' as Page }, // Placeholder page
  { name: 'Settings', icon: Settings, page: 'dashboard' as Page }, // Placeholder page
];

const AdminSidebar: React.FC<SidebarProps> = ({ onPageChange }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed inset-0 z-30">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            {adminSidebarItems.map((item) => (
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
        <div className="border-t border-gray-700 py-4">
          <button
            onClick={() => {
              // Handle logout logic
              sessionStorage.clear();
              localStorage.clear();
              window.location.href = '/'; // Redirect to the login page
            }}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="h-6 w-6 mr-3" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow ml-64 p-4">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default AdminSidebar;
