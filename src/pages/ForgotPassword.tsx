import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Button } from '../components/figma/ui/button';
import { Input } from '../components/figma/ui/input';
import { Label } from '../components/figma/ui/label';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode
        setSent(true);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
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

        {sent ? (
          <div className="text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folder.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full rounded-xl gap-2">
                <ArrowLeft size={16} /> Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-1">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fp-email">Email Address</Label>
                <Input
                  id="fp-email" 
                  type="email" 
                  placeholder="you@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <Button type="submit" className="w-full rounded-xl py-5" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center mt-5">
              <Link to="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
