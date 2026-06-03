import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/AuthStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user, fetchMe } = useAuthStore();
  const [checking, setChecking]  = useState(!user && !!token);

  useEffect(() => {
    if (token && !user) {
      fetchMe().finally(() => setChecking(false));
    }
  }, [token, user, fetchMe]);

  if (!token) return <Navigate to="/login" replace />;
  if (checking) return (
    <div className="flex h-screen items-center justify-center bg-[#0e1014]">
      <svg className="animate-spin size-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  return <>{children}</>;
}