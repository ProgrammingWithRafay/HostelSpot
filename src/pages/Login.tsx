import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "../components/figma/ui/button";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";
import { Separator } from "../components/figma/ui/separator";
import Logo from "../components/Logo";
import { WHATSAPP_SUPPORT_LINK } from '../utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signOut, user, profile, loading: authLoading } = useAuth();

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
            <a
              href={WHATSAPP_SUPPORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button className="w-full rounded-xl font-semibold gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10" variant="outline">
                <MessageCircle size={18} /> Appeal to Support
              </Button>
            </a>
            <Button onClick={() => signOut()} variant="ghost" className="w-full rounded-xl">
              Sign Out
            </Button>
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) setError(error);
    } catch {
      setError('An unexpected error occurred during Google Sign In');
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

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span>
        </div>

        <Button variant="outline" className="w-full rounded-xl gap-2" onClick={handleGoogleSignIn} disabled={loading}>
          <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
