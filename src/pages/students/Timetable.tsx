import React from 'react';
import { Clock } from 'lucide-react';

interface Class {
  subject: string;
  time: string;
}

type DaySchedule = Class[];

const weekSchedule: Record<string, DaySchedule> = {
  Monday: [
    { subject: 'Mathematics', time: '09:00 - 10:30' },
    { subject: 'Science', time: '11:00 - 12:30' },
    { subject: 'English', time: '14:00 - 15:30' },
    { subject: 'History', time: '16:00 - 17:30' },
  ],
  Tuesday: [
    { subject: 'Art', time: '09:00 - 10:30' },
    { subject: 'Mathematics', time: '11:00 - 12:30' },
    { subject: 'Science', time: '14:00 - 15:30' },
    { subject: 'English', time: '16:00 - 17:30' },
  ],
  Wednesday: [
    { subject: 'History', time: '09:00 - 10:30' },
    { subject: 'Art', time: '11:00 - 12:30' },
    { subject: 'Mathematics', time: '14:00 - 15:30' },
    { subject: 'Science', time: '16:00 - 17:30' },
  ],
  Thursday: [
    { subject: 'English', time: '09:00 - 10:30' },
    { subject: 'History', time: '11:00 - 12:30' },
    { subject: 'Art', time: '14:00 - 15:30' },
    { subject: 'Mathematics', time: '16:00 - 17:30' },
  ],
  Friday: [
    { subject: 'Science', time: '09:00 - 10:30' },
    { subject: 'English', time: '11:00 - 12:30' },
    { subject: 'History', time: '14:00 - 15:30' },
    { subject: 'Art', time: '16:00 - 17:30' },
  ],
};

const SchedulePage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weekly Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(weekSchedule).map(([day, classes]) => (
          <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-600 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">{day}</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {classes.map((classItem, index) => (
                <li key={index} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{classItem.subject}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock size={16} className="mr-1" />
                        {classItem.time}
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;