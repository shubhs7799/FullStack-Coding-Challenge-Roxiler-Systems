import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import UserStores from './pages/user/UserStores';
import UserChangePassword from './pages/user/UserChangePassword';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerChangePassword from './pages/owner/OwnerChangePassword';

import Layout from './components/common/Layout';
import Spinner from './components/common/Spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

    
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="users/add" element={<AdminAddUser />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="stores/add" element={<AdminAddStore />} />
      </Route>

   
      <Route path="/stores" element={<ProtectedRoute roles={['user']}><Layout /></ProtectedRoute>}>
        <Route index element={<UserStores />} />
      </Route>
      <Route path="/change-password" element={<ProtectedRoute roles={['user']}><Layout /></ProtectedRoute>}>
        <Route index element={<UserChangePassword />} />
      </Route>

      <Route path="/owner" element={<ProtectedRoute roles={['owner']}><Layout /></ProtectedRoute>}>
        <Route index element={<OwnerDashboard />} />
      </Route>
      <Route path="/owner/change-password" element={<ProtectedRoute roles={['owner']}><Layout /></ProtectedRoute>}>
        <Route index element={<OwnerChangePassword />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
