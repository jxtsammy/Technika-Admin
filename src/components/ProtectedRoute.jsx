import { Navigate } from 'react-router-dom';
import { getToken, getStoredUser } from '../api/client';

// Blocks access to admin routes unless a logged-in admin session exists.
export default function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
