import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { GraduationCap, Building2, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/figma/ui/button";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/figma/ui/tabs";

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
  const { signUp, user } = useAuth();
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
              autoComplete="new-password"
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
              autoComplete="new-password"
              required 
            />
          </div>

          <Button type="submit" className="w-full rounded-xl py-5" disabled={loading}>
            {loading ? "Creating account..." : `Create ${role === 'STUDENT' ? "Student" : "Owner"} Account`}
          </Button>
        </form>



        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
