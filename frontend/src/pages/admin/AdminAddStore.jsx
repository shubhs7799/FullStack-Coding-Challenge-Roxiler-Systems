import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import FormField from '../../components/common/FormField';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.ownerId) delete payload.ownerId;
      await api.post('/stores', payload);
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.message || 'Failed to create store');
      if (data?.errors) {
        const errs = {};
        data.errors.forEach(({ field, message }) => { errs[field] = message; });
        setErrors(errs);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Store</h1>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Store Name (20–60 characters)" error={errors.name}>
            <input name="name" className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Store name" value={form.name} onChange={handleChange} minLength={20} maxLength={60} required />
          </FormField>
          <FormField label="Store Email" error={errors.email}>
            <input name="email" type="email" className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="store@example.com" value={form.email} onChange={handleChange} required />
          </FormField>
          <FormField label="Address" error={errors.address}>
            <textarea name="address" className={`input ${errors.address ? 'input-error' : ''}`}
              placeholder="Store address" value={form.address} onChange={handleChange} maxLength={400} rows={2} required />
          </FormField>
          <FormField label="Owner ID (optional)" error={errors.ownerId}>
            <input name="ownerId" className={`input ${errors.ownerId ? 'input-error' : ''}`}
              placeholder="UUID of store owner (optional)" value={form.ownerId} onChange={handleChange} />
            <p className="text-xs text-gray-400 mt-1">Leave blank to create a store without an owner</p>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating…' : 'Create Store'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
