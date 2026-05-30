import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import SortableTh from '../../components/common/SortableTh';

const ROLE_BADGE = {
  admin: 'badge-admin',
  user: 'badge-user',
  owner: 'badge-owner',
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'createdAt', order: 'DESC' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, ...sort };
      const { data } = await api.get('/users', { params });
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link to="/admin/users/add" className="btn-primary text-sm">+ Add User</Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['name', 'email', 'address'].map((f) => (
            <input
              key={f}
              name={f}
              className="input text-sm"
              placeholder={`Filter by ${f}`}
              value={filters[f]}
              onChange={handleFilterChange}
            />
          ))}
          <select name="role" className="input text-sm" value={filters.role} onChange={handleFilterChange}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <SortableTh label="Name" field="name" {...sort} onSort={handleSort} />
                  <SortableTh label="Email" field="email" {...sort} onSort={handleSort} />
                  <SortableTh label="Address" field="address" {...sort} onSort={handleSort} />
                  <SortableTh label="Role" field="role" {...sort} onSort={handleSort} />
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="table-td text-center text-gray-400 py-8">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td font-medium">{u.name}</td>
                    <td className="table-td">{u.email}</td>
                    <td className="table-td text-gray-500 max-w-xs truncate">{u.address || '—'}</td>
                    <td className="table-td">
                      <span className={ROLE_BADGE[u.role] || 'badge'}>{u.role}</span>
                    </td>
                    <td className="table-td">
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
