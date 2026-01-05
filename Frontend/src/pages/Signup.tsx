import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, googleLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, UserPlus, Compass, Check, User, Phone, Eye, EyeOff } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const benefits = [
    'AI-powered trip planning',
    'Personalized itineraries',
    'Free to get started'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/85 via-slate-900/80 to-zinc-900/85" />

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-xl p-7">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl mb-3">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Create your account</h2>
            <p className="text-white/60 text-sm mt-1">
              Start planning smarter trips with AI
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {benefits.map((benefit, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 text-white/70 text-xs bg-white/5 px-3 py-1.5 rounded-full"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {benefit}
              </span>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <Input icon={User} placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Input icon={User} placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <Input icon={Mail} placeholder="Email address" name="email" value={formData.email} onChange={handleChange} />
            <Input icon={Phone} placeholder="Phone number (optional)" name="phone" value={formData.phone} onChange={handleChange} />

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <PasswordInput
                placeholder="Password"
                value={formData.password}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <PasswordInput
                placeholder="Confirm password"
                value={formData.confirmPassword}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <p className="text-xs text-white/40">Minimum 6 characters</p>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/40 text-xs">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <GoogleLoginButton onSuccess={() => {}} onError={() => {}} text="signup_with" />

          <p className="mt-4 text-center text-white/40 text-xs">
            By signing up, you agree to our Terms & Privacy Policy
          </p>

          <p className="mt-4 text-center text-white/60 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-white/40 text-sm mt-5">
          Trusted by travelers worldwide 🌍
        </p>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Input({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        {...props}
        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all text-sm"
      />
    </div>
  );
}

function PasswordInput({ placeholder, value, show, toggle, onChange }: any) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all text-sm"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
