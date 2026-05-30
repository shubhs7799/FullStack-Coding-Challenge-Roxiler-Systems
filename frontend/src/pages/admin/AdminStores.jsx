import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import SortableTh from '../../components/common/SortableTh';
import StarRating from '../../components/common/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stores', { params: { ...filters, ...sort } });
      setStores(data.stores);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <Link to="/admin/stores/add" className="btn-primary text-sm">+ Add Store</Link>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-2 gap-3">
          {['name', 'address'].map((f) => (
            <input
              key={f}
              className="input text-sm"
              placeholder={`Filter by ${f}`}
              value={filters[f]}
              onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
            />
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <SortableTh label="Name" field="name" {...sort} onSort={handleSort} />
                  <SortableTh label="Email" field="email" {...sort} onSort={handleSort} />
                  <SortableTh label="Address" field="address" {...sort} onSort={handleSort} />
                  <th className="table-th">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.length === 0 ? (
                  <tr><td colSpan={4} className="table-td text-center text-gray-400 py-8">No stores found</td></tr>
                ) : stores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="table-td font-medium">{s.name}</td>
                    <td className="table-td">{s.email}</td>
                    <td className="table-td text-gray-500 max-w-xs truncate">{s.address}</td>
                    <td className="table-td">
                      {s.avgRating ? (
                        <div className="flex items-center gap-2">
                          <StarRating value={Math.round(s.avgRating)} readOnly size="sm" />
                          <span className="text-sm text-gray-600">{s.avgRating}</span>
                        </div>
                      ) : <span className="text-gray-400 text-sm">No ratings</span>}
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
