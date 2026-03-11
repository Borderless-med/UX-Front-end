/**
 * HomeV3_OralLink.tsx
 * New homepage featuring 3-pathway cards: AI Scan | AI Companion | Browse & Compare
 *
 * HOW TO REVERT TO ORIGINAL HOMEPAGE (if OralLink partnership ends):
 * ─────────────────────────────────────────────────────────────────
 * In src/App.tsx, change ONE line:
 *
 *   // To use this new homepage (current):
 *   <Route path="/" element={usePrototypes ? <HomeV3_OralLink /> : <Index />} />
 *
 *   // To revert to original homepage:
 *   <Route path="/" element={usePrototypes ? <HomePrototype_v2 /> : <Index />} />
 *
 * HomePrototype_v2.tsx is NEVER deleted. Revert takes 30 seconds.
 * ─────────────────────────────────────────────────────────────────
 */

import { useNavigate } from 'react-router-dom';
import MasterTemplate from '@/components/layout/MasterTemplate';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import ChatHelperTextbox from '@/components/chat/ChatHelperTextbox';

// Check icon used across cards
const CheckIcon = ({ color }: { color: string }) => (
  <svg className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function HomeV3_OralLink() {
  const navigate = useNavigate();

  const openChatWidget = () => {
    const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement | null;
    chatButton?.click();
  };

  return (
    <MasterTemplate title="" subtitle="">

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              World-Class Dental Care<br />
              Smart Savings &amp; <span className="text-blue-600">AI Powered</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Compare dental options with intelligent guidance every step of the way
            </p>
          </div>

          {/* Choose Your Experience */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Choose Your Preferred Experience</h2>
          </div>

          {/* ── Three Pathway Cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Card 1: AI Dental Scan ──────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-200 shadow-lg relative flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
              {/* NEW badge */}
              <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                NEW
              </span>

              <div className="text-center mb-6">
                <div className="bg-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Dental Scan</h3>
                <p className="text-base text-gray-700 leading-relaxed">Identify your dental needs before booking</p>
              </div>

              <div className="text-sm text-emerald-800 font-semibold mb-6 text-center">
                Perfect for: Uncertain about treatment needs
              </div>

              <ul className="space-y-3 mb-6 text-sm text-gray-700 flex-1">
                {['5-photo smartphone scan', 'Instant risk assessment', 'Matched clinic recommendations', '2 minutes to complete'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon color="text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA → /ai-scan (our login-gated page, then redirects to orallink.health) */}
              <button
                onClick={() => navigate('/ai-scan')}
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg text-center text-sm transition-all shadow-md hover:shadow-lg mt-auto"
              >
                Start Free AI Scan →
              </button>

              <div className="bg-emerald-100 text-emerald-800 text-xs px-3 py-2 rounded-full font-semibold text-center mt-4">
                🎯 Identify issues first, then book
              </div>
            </div>

            {/* Card 2: Smart AI Companion ─────────────────────────────────── */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200 shadow-lg flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart AI Companion</h3>
                <p className="text-base text-gray-700 leading-relaxed">Get personalised recommendations instantly</p>
              </div>

              <div className="text-sm text-blue-800 font-semibold mb-6 text-center">
                Perfect for: First-time patients seeking guidance
              </div>

              <ul className="space-y-3 mb-6 text-sm text-gray-700 flex-1">
                {['Ask any dental question', 'Compare JB vs SG clinics', 'Book appointments directly', 'Powered by patient reviews'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon color="text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={openChatWidget}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-sm transition-all shadow-md hover:shadow-lg mt-auto"
              >
                Start Chatting with AI →
              </button>

              <div className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded-full font-semibold text-center mt-4">
                🔐 Free signup · 40 chats/month
              </div>
            </div>

            {/* Card 3: Browse & Compare ────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-8 border-2 border-slate-200 shadow-lg flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-slate-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse &amp; Compare</h3>
                <p className="text-base text-gray-700 leading-relaxed">Explore clinics at your own pace</p>
              </div>

              <div className="text-sm text-slate-800 font-semibold mb-6 text-center">
                Perfect for: Experienced patients, self-researchers
              </div>

              <ul className="space-y-3 mb-6 text-sm text-gray-700 flex-1">
                {['Browse all verified clinics', 'Advanced search & filtering', 'Compare clinics side-by-side', 'Read real patient reviews'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon color="text-slate-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/clinics')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-lg text-sm transition-all shadow-md hover:shadow-lg mt-auto"
              >
                Start Browsing Clinics →
              </button>

              <div className="bg-slate-100 text-slate-800 text-xs px-3 py-2 rounded-full font-semibold text-center mt-4">
                💡 No account required
              </div>
            </div>

          </div>{/* end grid */}

          {/* Mission Statement */}
          <div className="text-center mt-12 text-sm text-gray-600">
            <p className="font-medium">Empowering patients with transparent information to make informed dental care decisions</p>
          </div>

        </div>
      </section>

      {/* ── Why Choose OraChope ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose OraChope?</h2>
            <p className="text-lg text-gray-600">Transparent information to help you decide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                bg: 'bg-blue-100', icon: 'text-blue-600',
                title: 'Patient-Reviewed Clinics',
                desc: 'Browse clinics with authentic reviews and ratings from real patients',
                path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                bg: 'bg-green-100', icon: 'text-green-600',
                title: 'Transparent Pricing',
                desc: 'Compare costs across clinics with clear, upfront pricing information',
                path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                bg: 'bg-purple-100', icon: 'text-purple-600',
                title: 'AI-Powered',
                desc: 'Smart tools to help you make informed decisions',
                path: 'M13 10V3L4 14h7v7l9-11h-7z',
              },
            ].map(({ bg, icon, title, desc, path }) => (
              <div key={title} className="text-center">
                <div className={`${bg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <svg className={`w-8 h-8 ${icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
      <ChatHelperTextbox />

    </MasterTemplate>
  );
}
