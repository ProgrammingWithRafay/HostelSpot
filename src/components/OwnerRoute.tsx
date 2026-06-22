import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface OwnerRouteProps {
  children: ReactNode;
}

function OwnerRoute({ children }: OwnerRouteProps) {
  const { user, profile, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-slate-900/20 border-t-slate-900 animate-spin" />
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  if (profile && profile.role !== 'HOSTEL_OWNER') {
    return <Navigate to="/" replace />;
  }

  if (profile && !profile.is_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-[448px] w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-blue-500 text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            Verification Pending
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            Your Hostel Owner account is pending verification. Please wait for an admin to verify your account and assign your property. Once assigned, you will gain full access to your dashboard.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 text-left">
            <strong>Next Steps:</strong>
            <ul className="mt-2 space-y-1 list-disc pl-4 text-slate-500">
              <li>Admin reviews your registration</li>
              <li>Admin verifies your identity</li>
              <li>Admin assigns your property</li>
              <li>You get full dashboard access</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default OwnerRoute;
