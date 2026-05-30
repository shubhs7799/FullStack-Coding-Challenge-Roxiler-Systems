import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import FormField from '../components/common/FormField';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Logging you in…');
      await login(form.email, form.password);
      navigate('/stores');
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.message || 'Registration failed');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">StoreRate</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name (20–60 characters)" error={errors.name}>
              <input
                name="name"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                minLength={20}
                maxLength={60}
                required
              />
              <p className="text-xs text-gray-400 mt-1">{form.name.length}/60</p>
            </FormField>
            <FormField label="Email" error={errors.email}>
              <input
                name="email"
                type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField label="Password" error={errors.password}>
              <input
                name="password"
                type="password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                value={form.password}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField label="Address (optional)" error={errors.address}>
              <textarea
                name="address"
                className={`input ${errors.address ? 'input-error' : ''}`}
                placeholder="Your address"
                value={form.address}
                onChange={handleChange}
                maxLength={400}
                rows={2}
              />
            </FormField>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
