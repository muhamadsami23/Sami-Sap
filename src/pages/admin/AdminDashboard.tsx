import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Bell, ClipboardList, Calendar, Loader } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [stats, setStats] = useState<any>({ students: 0, teachers: 0 });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const adminId = sessionStorage.getItem('admin_id');

  useEffect(() => {
    if (adminId) {
      setLoading(true);

      // Fetch admin details
      fetch('http://localhost:5002/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_id: adminId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setAdminData(data);
          }
        })
        .catch(() => setError('Error fetching admin data'))
        .finally(() => setLoading(false));

      // Fetch statistics
      fetch('http://localhost:5002/stats')
        .then((response) => response.json())
        .then((data) => setStats(data))
        .catch(() => setError('Error fetching statistics'));

      // Fetch notifications
      fetch('http://localhost:5002/notifications')
        .then((response) => response.json())
        .then((data) => setNotifications(data))
        .catch(() => setError('Error fetching notifications'));
    }
  }, [adminId]);

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
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {adminData?.name}
        </motion.h1>

        <motion.p
          className="text-center text-gray-700 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {adminData?.designation} | {adminData?.email}
        </motion.p>

        {/* Admin Details */}
        <motion.div
          className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Admin Details</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Name:</strong> {adminData?.name}</li>
            <li><strong>Contact:</strong> {adminData?.contact}</li>
            <li><strong>Date of Birth:</strong> {adminData?.dob}</li>
            <li><strong>Address:</strong> {adminData?.address}</li>
          </ul>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Students */}
          <motion.div
            className="bg-blue-50 overflow-hidden shadow-lg rounded-2xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
                Total Students
              </h3>
              <p className="text-gray-700">{stats.students} Students Registered</p>
            </div>
          </motion.div>

          {/* Total Teachers */}
          <motion.div
            className="bg-green-50 overflow-hidden shadow-lg rounded-2xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="mr-3 h-6 w-6 text-green-600" />
                Total Teachers
              </h3>
              <p className="text-gray-700">{stats.teachers} Teachers Available</p>
            </div>
          </motion.div>
        </div>

        {/* Notifications */}
        <motion.div
          className="mt-12 p-6 bg-purple-50 rounded-lg shadow-md"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notifications</h2>
          {notifications.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No new notifications.</p>
          )}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          className="mt-12 p-6 bg-yellow-50 rounded-lg shadow-md"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-700">No upcoming events scheduled.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
