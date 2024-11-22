import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TimetableEntry {
  course_name: string;
  time: string;
  room_no: string;
}

interface Timetable {
  [day: string]: TimetableEntry[];
}

const StudentTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
  ];

  const rooms = [
    ...Array.from({ length: 7 }, (_, i) => `A-${i + 1}`),
    ...Array.from({ length: 7 }, (_, i) => `B-${i + 8}`),
    ...Array.from({ length: 8 }, (_, i) => `C-${i + 15}`),
    ...Array.from({ length: 4 }, (_, i) => `D-${i + 23}`),
    ...Array.from({ length: 4 }, (_, i) => `E-${i + 27}`)
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const studentId = sessionStorage.getItem('student_id');
        const response = await axios.post('http://localhost:5002/timetable', { student_id: studentId });
        setTimetable(response.data);
      } catch (err) {
        setError('Failed to fetch timetable. Please try again later.');
        console.error('Error fetching timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const getClassForTimeSlot = (day: string, time: string) => {
    if (!timetable) return null;
    return timetable[day].find(entry => entry.time === time);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Student Timetable</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Room</th>
            {timeSlots.map(time => (
              <th key={time} className="border border-gray-300 p-2">{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room}>
              <td className="border border-gray-300 p-2 font-semibold">{room}</td>
              {timeSlots.map(time => {
                const classEntry = days.map(day => getClassForTimeSlot(day, time)).find(entry => entry?.room_no === room);
                return (
                  <td key={`${room}-${time}`} className="border border-gray-300 p-2">
                    {classEntry && (
                      <div className="bg-blue-100 p-1 rounded">
                        <div className="font-semibold">{classEntry.course_name}</div>
                        <div className="text-xs">{classEntry.time}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTimetable;