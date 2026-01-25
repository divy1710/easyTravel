import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login as loginApi, googleLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Plane } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      login(res.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleLogin(credential);
      login(res.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/signupphoto.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* GLASS CARD — SAME AS SIGNUP */}
      <div
        className="
          relative w-full max-w-md
          rounded-3xl
          bg-white/10
          backdrop-blur-xl
          border border-white/25
          px-6 py-5
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-[#F3704B] flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-white">
          Welcome Back
        </h2>
        <p className="text-center text-white/70 text-xs mt-1">
          Sign in to continue your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <GlassInput
            icon={Mail}
            placeholder="Email Address"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <GlassInput
            icon={Lock}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            className="
              w-full bg-[#F3704B]
              text-white py-2.5
              rounded-lg font-medium text-sm
              hover:opacity-90 transition
              disabled:opacity-50
            "
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
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
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
          />
        </div>

        {/* Footer */}
        <div className="mt-3 text-center">
          <p className="text-sm text-white">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-[#F3704B] font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Glass Input (SAME AS SIGNUP) ---------- */

function GlassInput({ icon: Icon, ...props }: any) {
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
