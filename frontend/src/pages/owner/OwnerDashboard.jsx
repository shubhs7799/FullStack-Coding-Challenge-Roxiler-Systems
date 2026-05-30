import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import StarRating from '../../components/common/StarRating';
import SortableTh from '../../components/common/SortableTh';

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/stores/owner-dashboard')
      .then(({ data }) => setStores(data.stores))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Stores</h1>

      {stores.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🏪</p>
          <p>No stores assigned to your account yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stores.map((store) => (
            <div key={store.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{store.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{store.address}</p>
                </div>
                <div className="text-right">
                  {store.avgRating ? (
                    <>
                      <div className="text-2xl font-bold text-amber-500">{store.avgRating}</div>
                      <StarRating value={Math.round(store.avgRating)} readOnly size="sm" />
                      <p className="text-xs text-gray-400 mt-1">{store.ratings.length} rating{store.ratings.length !== 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">No ratings yet</p>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <button
                  onClick={() => setExpanded(expanded === store.id ? null : store.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expanded === store.id ? 'Hide' : 'Show'} ratings ({store.ratings.length})
                </button>

                {expanded === store.id && (
                  <div className="mt-3 overflow-x-auto">
                    {store.ratings.length === 0 ? (
                      <p className="text-sm text-gray-400">No ratings submitted yet</p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-th">Customer</th>
                            <th className="table-th">Email</th>
                            <th className="table-th">Rating</th>
                            <th className="table-th">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {store.ratings.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                              <td className="table-td font-medium">{r.user?.name}</td>
                              <td className="table-td text-gray-500">{r.user?.email}</td>
                              <td className="table-td">
                                <div className="flex items-center gap-2">
                                  <StarRating value={r.value} readOnly size="sm" />
                                  <span className="text-sm">{r.value}/5</span>
                                </div>
                              </td>
                              <td className="table-td text-gray-500">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
