import { api } from './client';

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function signup(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isVerified?: boolean;
}) {
  const res = await api.post('/auth/signup', data);
  return res.data;
}

export async function sendOTP(email: string) {
  const res = await api.post('/auth/send-otp', { email });
  return res.data;
}

export async function verifyOTP(email: string, otp: string) {
  const res = await api.post('/auth/verify-otp', { email, otp });
  return res.data;
}

export async function googleLogin(credential: string) {
  const res = await api.post('/auth/google', { credential });
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}
