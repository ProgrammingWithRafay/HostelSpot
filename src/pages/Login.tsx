import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "../components/figma/ui/button";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";

import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signOut, user, profile, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && (!profile || profile.is_suspended)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-card border border-border p-8 rounded-2xl max-w-md shadow-xl w-full">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-destructive text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">Account Unavailable</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {profile?.is_suspended 
              ? "Your account has been suspended by an administrator."
              : "Your account profile could not be found. It appears your account has been removed by an administrator."}
          </p>
          
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="w-full block group">
              <Button className="w-full rounded-xl font-semibold gap-2 border border-input group-hover:!bg-[#10B981] group-hover:!text-white group-hover:!border-[#10B981] transition-colors" variant="ghost">
                <MessageCircle size={18} /> Contact Support
              </Button>
            </Link>
            <div className="w-full group">
              <Button onClick={() => signOut()} variant="ghost" className="w-full rounded-xl group-hover:bg-destructive group-hover:text-white transition-colors">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user && profile) {
    if (profile.role === 'HOSTEL_OWNER') return <Navigate to="/owner-dashboard" replace />;
    if (profile.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) setError(signInError);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo iconSize={24} containerSize="w-12 h-12" textClassName="text-2xl" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Enter your details to sign in to your account</p>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <Button type="submit" className="w-full rounded-xl py-5" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>



        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
