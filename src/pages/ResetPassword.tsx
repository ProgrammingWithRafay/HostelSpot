import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Button } from '../components/figma/ui/button';
import { Input } from '../components/figma/ui/input';
import { Label } from '../components/figma/ui/label';
import Logo from '../components/Logo';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode fallback
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-background">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo iconSize={24} containerSize="w-12 h-12" textClassName="text-2xl" />
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Password Reset!</h1>
            <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-1">Reset Password</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Choose a strong new password for your account.</p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  minLength={6} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-new">Confirm New Password</Label>
                <Input 
                  id="confirm-new" 
                  type="password" 
                  placeholder="Repeat new password" 
                  minLength={6} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full rounded-xl py-5" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <p className="text-center mt-4 text-sm text-muted-foreground">
              Remember it?{" "}
              <Link to="/login" className="text-primary hover:underline font-semibold">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
