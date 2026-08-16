import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeBanner, setActiveBanner] = useState(0)

  const BANNERS = [
    {
      id: 1,
      tag: t('landing.tag'),
      headline: `${t('landing.heroTitle1')}\n${t('landing.heroTitle2')}`,
      sub: t('landing.heroSub'),
      accent: '#FB923C',
      glow: 'rgba(251,146,60,0.18)',
      bg: 'from-[#140D09] via-[#28150B] to-[#120C08]',
      badge: t('landing.pioneering'),
      stats: [
        { label: t('stat.cities'), value: '12+' },
        { label: t('stat.orders'), value: '500+' },
        { label: t('stat.species'), value: '40+' },
      ]
    },
    {
      id: 2,
      tag: t('feat.bayOfBengal'),
      headline: `${t('feat.bayOfBengal')}\n${t('landing.expressDelivery')}`,
      sub: t('feat.bayOfBengalDesc'),
      accent: '#F59E0B',
      glow: 'rgba(245,158,11,0.18)',
      bg: 'from-[#170E08] via-[#2D1A08] to-[#140C06]',
      badge: t('landing.expressDelivery'),
      stats: [
        { label: t('stat.harbours'), value: '8' },
        { label: t('stat.avgTime'), value: '72 min' },
        { label: t('stat.rating'), value: '4.9 / 5' },
      ]
    },
    {
      id: 3,
      tag: t('feat.coldChain'),
      headline: `${t('feat.coldChain')}\n${t('feat.expertCleaning')}`,
      sub: t('feat.coldChainDesc'),
      accent: '#F97316',
      glow: 'rgba(249,115,22,0.18)',
      bg: 'from-[#1A0F0A] via-[#2F180E] to-[#150D08]',
      badge: t('landing.chemFree'),
      stats: [
        { label: 'QC Standards', value: '12-Point' },
        { label: 'Cold Chain', value: '0 - 4°C' },
        { label: 'Zero Additives', value: '100%' },
      ]
    },
    {
      id: 4,
      tag: t('brand.adminPortal'),
      headline: `${t('admin.dashboard')}\n${t('admin.control')}`,
      sub: t('landing.readySub'),
      accent: '#FB7185',
      glow: 'rgba(251,113,133,0.18)',
      bg: 'from-[#180E0D] via-[#2E1513] to-[#130B0A]',
      badge: t('landing.adminControl'),
      stats: [
        { label: 'Live Analytics', value: 'Real-Time' },
        { label: 'Order Control', value: 'Instant' },
        { label: 'System Uptime', value: '99.9%' },
      ]
    }
  ]

  const FEATURES = [
    { title: t('feat.bayOfBengal'), desc: t('feat.bayOfBengalDesc') },
    { title: t('feat.express'), desc: t('feat.expressDesc') },
    { title: t('feat.coldChain'), desc: t('feat.coldChainDesc') },
    { title: t('feat.expertCleaning'), desc: t('feat.expertCleaningDesc') },
    { title: t('feat.zeroChem'), desc: t('feat.zeroChemDesc') },
    { title: t('feat.liveTracking'), desc: t('feat.liveTrackingDesc') },
  ]

  const CITIES = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Vellore',
    'Erode', 'Tirunelveli', 'Kanchipuram', 'Puducherry', 'Thanjavur', 'Dindigul'
  ]

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [BANNERS.length])

  const banner = BANNERS[activeBanner] || BANNERS[0]

  return (
    <div className="min-h-screen bg-[#0E0B09] text-stone-100 font-sans overflow-x-hidden">

      {/* Top Header with Brand & Language Selector */}
      <header className="absolute top-0 left-0 right-0 z-30 py-4 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#1A1410]/80 hover:bg-[#251C16] border border-orange-500/25 rounded-xl text-xs font-bold text-orange-200 hover:text-white transition-all shadow-md backdrop-blur-md cursor-pointer"
          >
            {t('admin.signIn')}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section
        className={`relative min-h-[92vh] bg-gradient-to-br ${banner.bg} flex flex-col items-center justify-center px-4 pt-28 pb-20 transition-all duration-700 overflow-hidden`}
      >
        {/* Animated warm glow orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${banner.glow}, transparent 70%)`,
            transition: 'background 0.7s ease'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-sm shadow-sm"
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
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight whitespace-pre-line"
            style={{ textShadow: `0 0 60px ${banner.glow}` }}
          >
            {banner.headline.split('\n').map((line, i) => (
              <span key={i} className={i === 0 ? 'block text-stone-100' : 'block mt-1'} style={{ color: i === 1 ? banner.accent : 'inherit' }}>
                {line}
              </span>
            ))}
          </h1>

          {/* Sub text */}
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            {banner.sub}
          </p>

          {/* Live stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {banner.stats.map((s, i) => (
              <div key={i} className="text-center px-5 py-2.5 bg-[#1C1511]/80 border border-orange-500/20 rounded-2xl backdrop-blur-sm shadow-md">
                <div className="text-2xl font-bold" style={{ color: banner.accent }}>{s.value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${banner.accent}, #F59E0B)`,
                color: '#160E08',
                boxShadow: `0 0 30px ${banner.glow}`
              }}
            >
              {t('landing.enterAdmin')} &rarr;
            </button>
            <div className="text-xs text-stone-400 font-medium">
              {t('admin.restricted')}
            </div>
          </div>
        </div>

        {/* Banner dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBanner(i)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: activeBanner === i ? '24px' : '8px',
                height: '8px',
                background: activeBanner === i ? banner.accent : 'rgba(255,255,255,0.25)'
              }}
            />
          ))}
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="py-8 bg-[#140E0A] border-y border-orange-500/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-bold uppercase tracking-wider text-stone-400">
            <span className="text-orange-400">{t('landing.tag')}</span>
            <span className="text-stone-700 hidden sm:block">•</span>
            <span className="text-amber-400">{t('landing.expressDelivery')}</span>
            <span className="text-stone-700 hidden sm:block">•</span>
            <span className="text-orange-300">{t('landing.chemFree')}</span>
            <span className="text-stone-700 hidden sm:block">•</span>
            <span className="text-rose-300">0 - 4°C Temperature Controlled</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-16 px-4 bg-[#0E0B09]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold uppercase tracking-widest text-orange-400">
              {t('landing.whyUs')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              {t('landing.whyUsSub')}
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto text-xs sm:text-sm">
              {t('landing.whyUsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group bg-[#17120E] border border-stone-800 hover:border-orange-500/40 rounded-2xl p-6 space-y-2.5 transition-all duration-300 hover:bg-[#1E1713] hover:-translate-y-1 hover:shadow-xl shadow-orange-950/20"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">
                  0{i + 1}
                </div>
                <div className="font-bold text-stone-100 text-sm group-hover:text-orange-300 transition-colors">
                  {f.title}
                </div>
                <div className="text-stone-400 text-xs leading-relaxed font-normal">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES COVERAGE ── */}
      <section className="py-10 bg-[#140E0A] border-y border-stone-800/80">
        <div className="max-w-6xl mx-auto px-4 space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            {t('landing.deliveringAcross')}
          </span>
          <div className="flex gap-2.5 flex-wrap justify-center px-4">
            {CITIES.map((city, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 bg-[#1C1511] border border-orange-500/15 rounded-xl text-xs font-medium text-stone-300 hover:border-orange-500/50 hover:text-orange-300 transition-colors"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#160E08] via-[#24130A] to-[#120B08] text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[11px] font-bold uppercase tracking-widest text-orange-400">
            {t('brand.adminPortal')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 leading-tight">
            {t('landing.readyTitle')}
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            {t('landing.readySub')}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:via-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('landing.enterAdmin')} &rarr;
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#120E0B] border-t border-stone-800 py-6 px-4 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="font-bold text-orange-400 uppercase tracking-wider">
            {t('brand.title')} — {t('brand.subtitle')}
          </div>
          <div className="text-[11px] text-stone-500">
            © 2026 Fish Mart Inc. All rights reserved. {t('admin.restricted')}.
          </div>
        </div>
      </footer>
    </div>
  )
}
