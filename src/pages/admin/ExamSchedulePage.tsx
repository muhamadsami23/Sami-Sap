import React from 'react';

const examDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const examTimeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];
const studentGroups = ['Freshmen', 'Sophomores', 'Juniors', 'Seniors'];

const WeeklySchedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Scheduling</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Exam Schedule</h2>
            <div className="space-y-6">
              {examDays.map(day => (
                <div key={day} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{day}</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Time
                          </th>
                          {studentGroups.map(group => (
                            <th
                              key={group}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {group}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {examTimeSlots.map((time, index) => (
                          <tr key={time} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {time}
                            </td>
                            {studentGroups.map(group => (
                              <td
                                key={`${group}-${time}`}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {/* Placeholder for exam information */}
                                <div className="bg-green-100 rounded p-1">Exam Info</div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklySchedule;
