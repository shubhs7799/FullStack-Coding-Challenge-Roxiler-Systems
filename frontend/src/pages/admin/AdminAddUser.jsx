import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import FormField from '../../components/common/FormField';

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post('/users', form);
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.message || 'Failed to create user');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name (20–60 characters)" error={errors.name}>
            <input name="name" className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Full name" value={form.name} onChange={handleChange} minLength={20} maxLength={60} required />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input name="email" type="email" className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="user@example.com" value={form.email} onChange={handleChange} required />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input name="password" type="password" className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="8-16 chars, 1 uppercase, 1 special char" value={form.password} onChange={handleChange} required />
          </FormField>
          <FormField label="Address" error={errors.address}>
            <textarea name="address" className={`input ${errors.address ? 'input-error' : ''}`}
              placeholder="Address" value={form.address} onChange={handleChange} maxLength={400} rows={2} />
          </FormField>
          <FormField label="Role" error={errors.role}>
            <select name="role" className="input" value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="owner">Store Owner</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating…' : 'Create User'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
