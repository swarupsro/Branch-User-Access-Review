import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Upload, Users, Clock, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Mock data for the dashboard stats
  const stats = [
    { id: 1, name: 'Pending Reviews', value: 8, icon: <Clock size={24} className="text-amber-500" />, change: '+2', trend: 'up' },
    { id: 2, name: 'Completed Reviews', value: 24, icon: <CheckCircle size={24} className="text-green-500" />, change: '+5', trend: 'up' },
    { id: 3, name: 'Branch Users', value: 42, icon: <Users size={24} className="text-blue-500" />, change: '0', trend: 'neutral' },
    { id: 4, name: 'Flagged Permissions', value: 3, icon: <AlertTriangle size={24} className="text-red-500" />, change: '-1', trend: 'down' },
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, action: 'Permissions reviewed', date: '2 hours ago', status: 'completed' },
    { id: 2, action: 'New users added', date: 'Yesterday', status: 'completed' },
    { id: 3, action: 'Access file uploaded', date: 'Yesterday', status: 'completed' },
    { id: 4, action: 'System maintenance', date: '3 days ago', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{currentDate}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A2463] hover:bg-[#143594] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] transition-colors duration-200"
            >
              <Upload size={16} className="mr-2" />
              Upload Access Data
            </Link>
            <Link
              to="/review"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] transition-colors duration-200"
            >
              <Users size={16} className="mr-2" />
              Review Access
            </Link>
          </div>
        </div>
      </div>

      {/* Branch Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Branch Information</h2>
        <div className="bg-[#0A2463] rounded-lg p-4 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#E6AF2E] text-[#0A2463]">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{user?.branchName}</h3>
              <p className="text-sm opacity-80">Branch ID: {user?.branchId}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-[#143594] p-3 rounded">
              <div className="text-sm opacity-80">Branch Manager</div>
              <div className="font-medium">{user?.name}</div>
            </div>
            <div className="bg-[#143594] p-3 rounded">
              <div className="text-sm opacity-80">Last Review</div>
              <div className="font-medium">3 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-600'
                      : stat.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.change} 
                </span>{' '}
                <span className="text-gray-500">from last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Activity size={20} className="text-[#0A2463] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <li key={activity.id}>
              <div className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors duration-150">
                <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' : 
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <button className="font-medium text-[#0A2463] hover:text-[#143594] transition-colors duration-150">
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;