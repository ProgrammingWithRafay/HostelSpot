import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { GraduationCap, Building2, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/figma/ui/button";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/figma/ui/tabs";
import { Separator } from "../components/figma/ui/separator";
import Logo from "../components/Logo";

export default function Register() {
  const [role, setRole] = useState<'STUDENT' | 'HOSTEL_OWNER'>('STUDENT');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    city_of_origin: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in and verified, redirect
  if (user) return <Navigate to="/hostels" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.full_name,
          phone: formData.phone,
          city_of_origin: formData.city_of_origin,
          role,
        }
      );

      if (signUpError) {
        setError(signUpError);
      } else {
        setIsSuccess(true);
      }
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
      setError('An unexpected error occurred during Google Sign Up');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  if (isSuccess) {
    return (
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-background">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">Check your email</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            We've sent a verification link to <strong className="text-foreground">{formData.email}</strong>.<br/><br/>
            Please check your inbox (and your spam folder) to verify your account. You will be able to log in after verification.
          </p>
          <Button className="w-full rounded-xl py-5" onClick={() => navigate('/login')}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo iconSize={24} containerSize="w-12 h-12" textClassName="text-2xl" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-sm text-muted-foreground text-center mb-5">Join thousands of students and hostel owners</p>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Role toggle */}
        <Tabs value={role} onValueChange={(v) => setRole(v as 'STUDENT' | 'HOSTEL_OWNER')} className="mb-5">
          <TabsList className="w-full">
            <TabsTrigger value="STUDENT" className="flex-1 gap-2 cursor-pointer">
              <GraduationCap size={15} /> Student
            </TabsTrigger>
            <TabsTrigger value="HOSTEL_OWNER" className="flex-1 gap-2 cursor-pointer">
              <Building2 size={15} /> Hostel Owner
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder={role === 'STUDENT' ? "Ali Khan" : "Tariq Mehmood"} 
              value={formData.full_name} 
              onChange={(e) => update('full_name', e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email</Label>
            <Input 
              id="reg-email" 
              type="email" 
              placeholder="you@email.com" 
              value={formData.email} 
              onChange={(e) => update('email', e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                +92
              </span>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="3001234567" 
                pattern="[0-9]{10}"
                maxLength={10}
                value={formData.phone.replace(/^\+92/, '')} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    update('phone', '+92' + val);
                  }
                }} 
                className="rounded-l-none"
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">City of Origin</Label>
            <Input 
              id="city"
              placeholder="e.g. Multan, Karachi" 
              value={formData.city_of_origin} 
              onChange={(e) => update('city_of_origin', e.target.value)} 
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <Input 
              id="reg-password" 
              type="password" 
              placeholder="Min. 6 characters" 
              minLength={6} 
              value={formData.password} 
              onChange={(e) => update('password', e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Repeat your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <Button type="submit" className="w-full rounded-xl py-5" disabled={loading}>
            {loading ? "Creating account..." : `Create ${role === 'STUDENT' ? "Student" : "Owner"} Account`}
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span>
        </div>

        <Button variant="outline" className="w-full rounded-xl gap-2" onClick={handleGoogleSignIn} disabled={loading}>
          <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
