import React from 'react'
import { useLanguage, Language } from '../context/LanguageContext'

export default function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const { language, setLanguage } = useLanguage()

  const languages: { code: Language; label: string; subLabel: string }[] = [
    { code: 'en', label: 'EN', subLabel: 'English' },
    { code: 'ta', label: 'தமிழ்', subLabel: 'Tamil' },
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi' }
  ]

  return (
    <div className="inline-flex items-center p-1 bg-slate-900/90 border border-slate-700/70 rounded-xl backdrop-blur-md shadow-inner">
      {languages.map((l) => {
        const isActive = language === l.code
        return (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            title={l.subLabel}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{variant === 'compact' ? l.label : l.label}</span>
          </button>
        )
      })}
    </div>
  )
}
