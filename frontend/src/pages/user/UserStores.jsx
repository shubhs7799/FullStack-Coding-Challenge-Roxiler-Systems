import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import StarRating from '../../components/common/StarRating';

function StoreCard({ store, onRated }) {
  const [selected, setSelected] = useState(store.userRating || 0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (value) => {
    setSubmitting(true);
    try {
      await api.post('/ratings', { storeId: store.id, value });
      toast.success(store.userRating ? 'Rating updated!' : 'Rating submitted!');
      setSelected(value);
      onRated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{store.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{store.address}</p>
        </div>
        {store.avgRating && (
          <div className="ml-3 text-right flex-shrink-0">
            <div className="text-lg font-bold text-amber-500">{store.avgRating}</div>
            <div className="text-xs text-gray-400">{store.ratings?.length} rating{store.ratings?.length !== 1 ? 's' : ''}</div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Overall rating</p>
          <StarRating value={Math.round(store.avgRating || 0)} readOnly size="sm" />
        </div>
        <div className="sm:ml-auto">
          <p className="text-xs text-gray-500 mb-1">
            {store.userRating ? 'Your rating (tap to change)' : 'Rate this store'}
          </p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={submitting}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRate(star)}
                className={`text-2xl transition-all ${submitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'} ${
                  star <= (hover || selected) ? 'text-amber-400' : 'text-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stores', { params: search });
      setStores(data.stores);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Search by name…"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Search by address…"
            value={search.address}
            onChange={(e) => setSearch({ ...search, address: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : stores.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🏪</p>
          <p>No stores found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRated={fetchStores} />
          ))}
        </div>
      )}
    </div>
  );
}
