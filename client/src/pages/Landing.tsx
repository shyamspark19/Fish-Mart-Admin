import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

const BANNERS = [
  {
    id: 1,
    tag: "🏆 TAMIL NADU'S #1 FISH MARKETPLACE",
    headline: "Tamil Nadu's First Online\nFish Selling Application",
    sub: "From the coast to your kitchen — fresh, cleaned & delivered in 90 minutes across Chennai, Coimbatore, Madurai & more.",
    accent: '#06B6D4',
    glow: 'rgba(6,182,212,0.18)',
    bg: 'from-[#020B18] via-[#041C2C] to-[#021A2B]',
    badge: '🐟 PIONEERING SINCE 2024',
    emoji: '🌊',
    stats: [
      { label: 'Cities Covered', value: '12+' },
      { label: 'Daily Orders', value: '500+' },
      { label: 'Fresh Species', value: '40+' },
    ]
  },
  {
    id: 2,
    tag: '🌊 STRAIGHT FROM THE BAY OF BENGAL',
    headline: 'Sea-Fresh to Doorstep\nin Under 90 Minutes',
    sub: 'Seer Fish, Pomfret, Prawns, Crabs — sourced daily from Kasimedu & Cuddalore harbours. 100% Chemical-Free guarantee.',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.18)',
    bg: 'from-[#0D0800] via-[#1C1000] to-[#0A0600]',
    badge: '⚡ 90-MIN EXPRESS DELIVERY',
    emoji: '🦐',
    stats: [
      { label: 'Harbour Partners', value: '8' },
      { label: 'Avg Delivery', value: '72 min' },
      { label: 'Customer Rating', value: '4.9★' },
    ]
  },
  {
    id: 3,
    tag: '🧊 TEMPERATURE CONTROLLED · 0–4°C',
    headline: 'Cleaned, Gutted &\nDescaled — Ready to Cook',
    sub: 'Every fish is expertly processed at our facility: scaled, gutted & portioned by certified seafood handlers before delivery.',
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.18)',
    bg: 'from-[#020D08] via-[#021A10] to-[#020F08]',
    badge: '✅ 100% CHEMICAL-FREE',
    emoji: '🐠',
    stats: [
      { label: 'QC Checks', value: '12-Point' },
      { label: 'Temp Chain', value: '0–4°C' },
      { label: 'Zero Additives', value: '100%' },
    ]
  },
  {
    id: 4,
    tag: '👑 ADMIN CONTROL CENTER',
    headline: 'Powerful Admin Portal\nfor Complete Control',
    sub: 'Real-time analytics, order management, product catalog CRUD, stock control and live delivery tracking — all in one dashboard.',
    accent: '#F97316',
    glow: 'rgba(249,115,22,0.18)',
    bg: 'from-[#0D0500] via-[#1A0900] to-[#0D0400]',
    badge: '🔐 RESTRICTED ACCESS',
    emoji: '📊',
    stats: [
      { label: 'Live Analytics', value: 'Real-Time' },
      { label: 'Order Control', value: 'Full' },
      { label: 'Uptime', value: '99.9%' },
    ]
  }
]

const FEATURES = [
  { icon: '🌊', title: 'Bay of Bengal Fresh', desc: 'Sourced daily from Kasimedu, Cuddalore & Rameswaram harbours' },
  { icon: '⚡', title: '90-Min Delivery', desc: 'Express cold-chain delivery across all major Tamil Nadu cities' },
  { icon: '🧊', title: '0–4°C Cold Chain', desc: 'Temperature-controlled from harbour to your doorstep' },
  { icon: '✂️', title: 'Expert Cleaning', desc: 'Scaled, gutted & portioned by certified seafood processors' },
  { icon: '🚫', title: 'Zero Chemicals', desc: 'No preservatives, no formalin — 100% natural seafood' },
  { icon: '📱', title: 'Real-Time Tracking', desc: 'Live order tracking from dispatch to delivery' },
]

const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore', 'Erode', 'Tirunelveli', 'Kanchipuram', 'Pondicherry', 'Thanjavur', 'Dindigul']

export default function Landing() {
  const navigate = useNavigate()
  const [activeBanner, setActiveBanner] = useState(0)

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % BANNERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const banner = BANNERS[activeBanner]

  return (
    <div className="min-h-screen bg-[#050D1A] text-white font-sans overflow-x-hidden">

      {/* ── HERO BANNER ── */}
      <section
        className={`relative min-h-[92vh] bg-gradient-to-br ${banner.bg} flex flex-col items-center justify-center px-4 py-20 transition-all duration-700 overflow-hidden`}
      >
        {/* Animated glow orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${banner.glow}, transparent 70%)`,
            transition: 'background 0.7s ease'
          }}
        />

        {/* Floating fish emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {['🐟','🐠','🦐','🦀','🐡'].map((e, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-5 animate-pulse"
              style={{
                left: `${10 + i * 18}%`,
                top: `${15 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                fontSize: `${2 + i * 0.4}rem`
              }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-sm"
            style={{
              color: banner.accent,
              borderColor: `${banner.accent}40`,
              background: `${banner.accent}15`,
              transition: 'all 0.5s ease'
            }}
          >
            {banner.badge}
          </div>

          {/* Main headline */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight whitespace-pre-line"
            style={{ textShadow: `0 0 60px ${banner.glow}` }}
          >
            {banner.headline.split('\n').map((line, i) => (
              <span key={i} className={i === 0 ? 'block text-white' : 'block'} style={{ color: i === 1 ? banner.accent : 'white' }}>
                {line}
              </span>
            ))}
          </h1>

          {/* Sub text */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {banner.sub}
          </p>

          {/* Live stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {banner.stats.map((s, i) => (
              <div key={i} className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black" style={{ color: banner.accent }}>{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${banner.accent}, ${banner.accent}cc)`,
                color: '#050D1A',
                boxShadow: `0 0 40px ${banner.glow}`
              }}
            >
              👑 Admin Sign In →
            </button>
            <div className="text-xs text-slate-500 font-semibold">Authorized administrators only</div>
          </div>
        </div>

        {/* Banner dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {BANNERS.map((b, i) => (
            <button
              key={i}
              onClick={() => setActiveBanner(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeBanner === i ? '28px' : '8px',
                height: '8px',
                background: activeBanner === i ? banner.accent : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="py-10 bg-[#070F1E] border-y border-cyan-500/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2"><span className="text-cyan-400">🏆</span> Tamil Nadu's #1 Online Fish App</span>
            <span className="text-slate-700 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><span className="text-amber-400">⚡</span> 90-Min Express Delivery</span>
            <span className="text-slate-700 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><span className="text-emerald-400">✅</span> 100% Chemical-Free Seafood</span>
            <span className="text-slate-700 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><span className="text-sky-400">🧊</span> Cold-Chain 0–4°C Guaranteed</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 px-4 bg-[#050D1A]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400">
              ✦ Why Fish Mart?
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The Gold Standard of<br/>
              <span className="text-cyan-400">Tamil Nadu Seafood Delivery</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              We don't just sell fish — we deliver a promise of freshness, quality and speed that no one else in Tamil Nadu can match.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 space-y-3 transition-all duration-300 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/5"
              >
                <div className="text-3xl">{f.icon}</div>
                <div className="font-black text-white text-sm group-hover:text-cyan-300 transition-colors">{f.title}</div>
                <div className="text-slate-400 text-xs leading-relaxed font-medium">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES MARQUEE ── */}
      <section className="py-10 bg-slate-900/60 border-y border-slate-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-4 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">📍 Delivering Across Tamil Nadu</span>
        </div>
        <div className="flex gap-6 flex-wrap justify-center px-4">
          {CITIES.map((city, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors cursor-default"
            >
              📍 {city}
            </span>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#070F1E] via-[#0A1628] to-[#050D1A] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(245,158,11,0.08), transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="text-5xl">👑</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Ready to Manage the<br/>
            <span className="text-amber-400">Fish Mart Admin Portal?</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access real-time analytics, manage products, process orders and control inventory — all from your secure admin dashboard.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            👑 Sign In as Admin →
          </button>
          <div className="text-[11px] text-slate-600 font-semibold">
            🔐 Restricted to authorized Fish Mart administrators only
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-base font-black text-cyan-400">
            <span>🐟</span><span>FISH MART — TAMIL NADU'S #1 ONLINE FISH APP</span>
          </div>
          <p className="text-xs text-slate-500">
            Fresh Catch · Fast Delivery · Cleaned & Descaled · 100% Chemical-Free · Cold Chain 0–4°C
          </p>
          <div className="text-[11px] text-slate-600">
            © 2026 Fish Mart Inc. All rights reserved. Serving Tamil Nadu with pride.
          </div>
        </div>
      </footer>
    </div>
  )
}
