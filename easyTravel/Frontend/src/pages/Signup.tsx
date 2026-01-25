import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Compass,
  User,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await signup(formData);
      login(res.user);
      navigate('/');
    } catch {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/signupphoto.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* GLASS CARD (MATCHES FIRST PHOTO) */}
      <div
        className="
          relative w-full max-w-md
          rounded-3xl
          bg-white/10
          backdrop-blur-3xl
          border border-white/25
          px-6 py-5
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-[#F3704B] flex items-center justify-center">
            <Compass className="text-white w-5 h-5" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-white">
          Create your account
        </h2>
        <p className="text-center text-white/70 text-xs mt-1">
          Start Planning Smarter Trips With AI
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input icon={User} placeholder="First Name" name="firstName" onChange={handleChange} />
            <Input icon={User} placeholder="Last Name" name="lastName" onChange={handleChange} />
          </div>

          <Input icon={Mail} placeholder="Email Address" name="email" onChange={handleChange} />
          <Input icon={Phone} placeholder="Contact no" name="phone" onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <PasswordInput
              placeholder="Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={(e: any) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <PasswordInput
              placeholder="Confirm Password"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              onChange={(e: any) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <p className="text-[11px] text-white/60">Minimum 6 characters</p>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            className="w-full bg-[#F3704B] text-white py-2.5 rounded-lg font-medium text-sm hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-3 flex items-center gap-2">
          <div className="flex-1 h-px bg-white/30" />
          <span className="text-white/60 text-xs">or</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Google */}
        <div className="bg-white rounded-lg">
          <GoogleLoginButton
            onSuccess={() => {}}
            onError={() => setError('Google signup failed')}
          />
        </div>

        {/* Footer */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-white/60">
            By signing up, you agree to our{' '}
            <span className="underline">Terms</span> &{' '}
            <span className="underline">Privacy Policy</span>
          </p>
          <p className="text-sm text-white mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F3704B] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
      <input
        {...props}
        className="
          w-full
          bg-white/15
          border border-white/25
          rounded-lg
          py-2.5
          pl-10 pr-3
          text-white text-sm
          placeholder-white/60
          focus:outline-none
          focus:ring-2 focus:ring-white/40
        "
      />
    </div>
  );
}

function PasswordInput({ placeholder, show, toggle, onChange }: any) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={onChange}
        className="
          w-full
          bg-white/15
          border border-white/25
          rounded-lg
          py-2.5
          pl-10 pr-10
          text-white text-sm
          placeholder-white/60
          focus:outline-none
          focus:ring-2 focus:ring-white/40
        "
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}