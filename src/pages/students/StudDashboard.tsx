import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Book, Users, Bell, FileText, Clock, Loader } from 'lucide-react';

const StudDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = sessionStorage.getItem('student_id');

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      fetch('http://localhost:5002/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setStudentData(data);
          }
        })
        .catch((error) => {
          setError('Error fetching student data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {studentData.name}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-blue-50 overflow-hidden shadow-lg rounded-2xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="mr-3 h-6 w-6 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <InfoItem icon={<User className="text-blue-600" />} label="Name" value={studentData.name} />
                <InfoItem icon={<Mail className="text-blue-600" />} label="Email" value={studentData.email} />
                <InfoItem icon={<Phone className="text-blue-600" />} label="Contact" value={studentData.contact} />
                <InfoItem icon={<MapPin className="text-blue-600" />} label="Address" value={studentData.address} />
                <InfoItem icon={<Calendar className="text-blue-600" />} label="DOB" value={studentData.dob} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-green-50 overflow-hidden shadow-lg rounded-2xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="mr-3 h-6 w-6 text-green-600" />
                Academic Information
              </h3>
              <div className="space-y-4">
                <InfoItem icon={<FileText className="text-green-600" />} label="Roll No" value={studentData.roll_no} />
                <InfoItem icon={<Book className="text-green-600" />} label="Program" value={studentData.program_name} />
                <InfoItem icon={<Users className="text-green-600" />} label="Section" value={studentData.section_name} />
                <InfoItem icon={<Calendar className="text-green-600" />} label="Semester" value={studentData.semester} />
                <InfoItem icon={<Clock className="text-green-600" />} label="Enrollment Date" value={studentData.enrollment_date} />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 bg-yellow-50 overflow-hidden shadow-lg rounded-2xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <div className="px-6 py-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="mr-3 h-6 w-6 text-yellow-600" />
              Recent Activity
            </h3>
            <ul className="divide-y divide-gray-200">
              <ActivityItem
                icon={<Book className="text-blue-600" />}
                title="Assignment Submitted"
                description="You submitted the assignment for CS301 - Data Structures"
                time="1h ago"
              />
              <ActivityItem
                icon={<Calendar className="text-green-600" />}
                title="Exam Schedule Updated"
                description="The final exam schedule for this semester has been published"
                time="1d ago"
              />
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center text-gray-700">
    <div className="mr-3 h-5 w-5">{icon}</div>
    <span className="font-medium mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);

const ActivityItem: React.FC<{ icon: React.ReactNode; title: string; description: string; time: string }> = ({ icon, title, description, time }) => (
  <li className="py-4">
    <div className="flex space-x-3">
      <div className="h-6 w-6">{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </li>
);

export default StudDashboard;