import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';

const StatCard = ({ label, value, color, to }) => (
  <Link to={to} className={`card hover:shadow-md transition-shadow group`}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-4xl font-bold mt-2 ${color} group-hover:scale-105 transition-transform`}>
      {value ?? '—'}
    </p>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users/add" className="btn-primary text-sm">+ Add User</Link>
          <Link to="/admin/stores/add" className="btn-secondary text-sm">+ Add Store</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats?.totalUsers} color="text-blue-600" to="/admin/users" />
        <StatCard label="Total Stores" value={stats?.totalStores} color="text-green-600" to="/admin/stores" />
        <StatCard label="Total Ratings" value={stats?.totalRatings} color="text-amber-600" to="/admin/stores" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/users/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-lg">👤</span>
              <div>
                <p className="text-sm font-medium">Add New User</p>
                <p className="text-xs text-gray-500">Create admin, user or store owner</p>
              </div>
            </Link>
            <Link to="/admin/stores/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-lg">🏪</span>
              <div>
                <p className="text-sm font-medium">Add New Store</p>
                <p className="text-xs text-gray-500">Register a store on the platform</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Navigation</h2>
          <div className="space-y-2">
            <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-sm font-medium">Manage Users</p>
                <p className="text-xs text-gray-500">View, filter and manage all users</p>
              </div>
            </Link>
            <Link to="/admin/stores" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🗂️</span>
              <div>
                <p className="text-sm font-medium">Manage Stores</p>
                <p className="text-xs text-gray-500">View all stores with ratings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
