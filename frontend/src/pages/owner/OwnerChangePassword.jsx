import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import FormField from '../../components/common/FormField';

export default function OwnerChangePassword() {
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(form.password);
      toast.success('Password updated successfully');
      setForm({ password: '', confirm: '' });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.errors?.[0]?.message || data?.message || 'Failed to update password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="New Password">
            <input
              type="password"
              className="input"
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Confirm New Password">
            <input
              type="password"
              className="input"
              placeholder="Repeat new password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </FormField>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
