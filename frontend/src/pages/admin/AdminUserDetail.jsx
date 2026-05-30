import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import StarRating from '../../components/common/StarRating';

const ROLE_BADGE = { admin: 'badge-admin', user: 'badge-user', owner: 'badge-owner' };

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Spinner />;
  if (!data) return null;

  const { user, avgRating } = data;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
      </div>

      <div className="card space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <span className={ROLE_BADGE[user.role] || 'badge'}>{user.role}</span>
        </div>

        <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Address</p>
            <p className="text-sm mt-1 text-gray-800">{user.address || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Member since</p>
            <p className="text-sm mt-1 text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {user.role === 'owner' && (
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Store Rating</p>
            {avgRating != null ? (
              <div className="flex items-center gap-3">
                <StarRating value={Math.round(avgRating)} readOnly />
                <span className="text-lg font-semibold text-gray-800">{avgRating}</span>
                <span className="text-sm text-gray-500">average across all stores</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No ratings yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
