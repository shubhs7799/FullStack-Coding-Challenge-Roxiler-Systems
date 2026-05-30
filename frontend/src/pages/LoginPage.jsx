import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import FormField from '../components/common/FormField';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const errs = {};
        err.response.data.errors.forEach(({ field, message }) => { errs[field] = message; });
        setErrors(errs);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">StoreRate</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" error={errors.email}>
              <input
                name="email"
                type="email"
                autoComplete="email"
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
                autoComplete="current-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </FormField>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            New customer?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
