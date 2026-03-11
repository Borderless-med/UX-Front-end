/**
 * AIScanPage.tsx
 * Route: /ai-scan  (also served at orallink.orachope.org via Vercel subdomain)
 *
 * Flow:
 *  1. User arrives at this page
 *  2. If already logged in  → show "Start Scan" button immediately
 *  3. If not logged in      → show Sign Up / Log In form
 *  4. On successful auth    → insert row into ai_scans table → redirect to orallink.health
 *
 * NOTE: Requires Supabase migration before ai_scans inserts will work.
 * Run this SQL in Supabase dashboard → SQL Editor:
 *
 *   CREATE TABLE IF NOT EXISTS ai_scans (
 *     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *     user_id UUID REFERENCES auth.users(id),
 *     scan_id TEXT UNIQUE NOT NULL,
 *     status TEXT DEFAULT 'initiated',
 *     created_at TIMESTAMPTZ DEFAULT NOW(),
 *     completed_at TIMESTAMPTZ
 *   );
 *   ALTER TABLE ai_scans ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Users can insert own scans" ON ai_scans
 *     FOR INSERT WITH CHECK (auth.uid() = user_id);
 *   CREATE POLICY "Users can view own scans" ON ai_scans
 *     FOR SELECT USING (auth.uid() = user_id);
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ORALLINK_URL = 'https://orallink.health?ref=orachope&source=ai-scan-page';

// Generate Scan ID: OL-2026-XXXX
function generateScanId(): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OL-2026-${suffix}`;
}

// Record scan initiation in Supabase
async function recordScanInitiation(
  userId: string,
  userName?: string,
  userEmail?: string
): Promise<string> {
  const scanId = generateScanId();

  // Fallback: look up user_profiles if name not passed in
  let resolvedName = userName || null;
  if (!resolvedName) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    resolvedName = profile?.full_name || null;
  }

  const { error } = await supabase.from('ai_scans').insert({
    user_id: userId,
    scan_id: scanId,
    status: 'initiated',
    user_name: resolvedName,
    user_email: userEmail || null,
  } as any);

  if (error) {
    console.warn('ai_scans insert error:', error.message);
  }

  return scanId;
}

export default function AIScanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── If already logged in, go straight to scan ──────────────────────────────
  const handleStartScan = async () => {
    if (!user) return;
    setIsLoading(true);
    await recordScanInitiation(
      user.id,
      user.user_metadata?.full_name,
      user.email
    );
    window.location.href = ORALLINK_URL;
  };

  // ── Validate: need at least email OR mobile ─────────────────────────────────
  const validate = () => {
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (mode === 'signup' && !email && !mobile) {
      setError('Please enter at least your email address or mobile number.');
      return false;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (mode === 'signup' && !agreed) {
      setError('Please agree to the terms to continue.');
      return false;
    }
    if (mode === 'login' && !email) {
      setError('Please enter your email address.');
      return false;
    }
    return true;
  };

  // ── Handle Sign Up ──────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError('');

    // Supabase requires email for signUp; use mobile as fallback identifier in metadata
    const signUpEmail = email || `${mobile.replace(/\D/g, '')}@mobile.orachope.org`;

    const { data, error: authError } = await supabase.auth.signUp({
      email: signUpEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
          mobile: mobile || null,
          email_provided: !!email,
          source: 'ai-scan-page',
        },
        emailRedirectTo: `${window.location.origin}/ai-scan`,
      },
    });

    if (authError) {
      // If already registered, auto-switch to login mode
      if (authError.message.toLowerCase().includes('already registered') ||
          authError.message.toLowerCase().includes('already been registered') ||
          authError.message.toLowerCase().includes('user already')) {
        setMode('login');
        setError('You already have an account. Please log in below.');
      } else {
        setError(authError.message);
      }
      setIsLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await recordScanInitiation(userId, name.trim(), signUpEmail);
      window.location.href = ORALLINK_URL;
    } else {
      // Email confirmation required — inform user
      setError('');
      setIsLoading(false);
      alert('Check your email to confirm your account, then return here to start your scan.');
    }
  };

  // ── Handle Log In ───────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await recordScanInitiation(
        userId,
        data.user.user_metadata?.full_name,
        email
      );
      window.location.href = ORALLINK_URL;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') await handleSignUp();
    else await handleLogin();
  };

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* OralLink logo — use text fallback since external image */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">OL</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">OralLink</span>
              </div>
              <span className="text-gray-400 text-sm">in partnership with</span>
              <img
                src="/orachope.png"
                alt="OraChope"
                className="h-10"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              ← Back to OraChope
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free AI Dental Screening
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Free AI Dental Scan Awaits
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            2 minutes to scan · Instant AI analysis · Find the perfect clinic on OraChope
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap">
            {['100% Free', 'Secure & Private', 'No Medical Diagnosis'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Auth Card ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-auto mb-12">

          {/* Already logged in */}
          {user ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">You're logged in!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Logged in as <strong>{user.email}</strong>
              </p>
              <button
                onClick={handleStartScan}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all disabled:opacity-60"
              >
                {isLoading ? 'Starting...' : 'Start My Free Scan →'}
              </button>
            </div>
          ) : (
            <>
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Log In
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {mode === 'signup' ? 'Get Started in 30 Seconds' : 'Welcome Back'}
              </h2>
              {mode === 'signup' && (
                <p className="text-sm text-gray-500 mb-5">Name required · Email or mobile — at least one required</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First name or full name"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address {mode === 'signup' && <span className="text-gray-400 font-normal">(optional if mobile provided)</span>}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Mobile (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Mobile Number <span className="text-gray-400 font-normal">(optional if email provided)</span>
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Terms (signup only) */}
                {mode === 'signup' && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-teal-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to OralLink's Terms and understand this is a screening tool, not a medical diagnosis.
                    </span>
                  </label>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all disabled:opacity-60"
                >
                  {isLoading
                    ? 'Please wait...'
                    : mode === 'signup'
                    ? 'Create Account & Start Scan →'
                    : 'Log In & Start Scan →'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── How It Works ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { step: '1', title: 'Sign Up', desc: 'Create your free account' },
            { step: '2', title: 'Take Photos', desc: '5 quick smartphone shots' },
            { step: '3', title: 'AI Scan', desc: 'Instant analysis' },
            { step: '4', title: 'Find Clinics', desc: 'Back to OraChope', highlight: true },
          ].map(({ step, title, desc, highlight }) => (
            <div
              key={step}
              className={`bg-white rounded-xl p-5 text-center border-2 shadow-sm ${
                highlight ? 'border-teal-300' : 'border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg text-white ${
                highlight
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500'
                  : 'bg-gradient-to-br from-blue-500 to-teal-500'
              }`}>
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── AI Detects ─────────────────────────────────────────────────────── */}
        <div className="bg-blue-900 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-center mb-6">AI Screening Detects:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: '🦷', title: 'Cavity Risk', desc: 'Tooth decay, enamel damage' },
              { icon: '❤️', title: 'Gum Health', desc: 'Inflammation, recession' },
              { icon: '📏', title: 'Alignment', desc: 'Crowding, bite issues' },
            ].map(({ icon, title, desc }) => (
              <div key={title}>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-blue-200">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── After Scan ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center border-2 border-emerald-400 text-white">
          <p className="text-lg font-semibold mb-2">📍 After Your Scan</p>
          <p className="text-emerald-100">
            We'll guide you back to{' '}
            <span className="font-bold text-white">OraChope.org</span> to find clinics
            that treat your specific needs — with transparent pricing and real reviews.
          </p>
        </div>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 py-6 mt-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p className="mb-1">OralLink × OraChope Partnership</p>
          <p>🔒 Your data is encrypted and secure · This is a screening tool, not a medical diagnosis</p>
        </div>
      </footer>

    </div>
  );
}
