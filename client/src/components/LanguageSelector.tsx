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
    <div className="inline-flex items-center p-1 bg-[#1A1410]/90 border border-orange-500/20 rounded-xl backdrop-blur-md shadow-inner">
      {languages.map((l) => {
        const isActive = language === l.code
        return (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            title={l.subLabel}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-bold shadow-md shadow-orange-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#251C17]'
            }`}
          >
            <span>{variant === 'compact' ? l.label : l.label}</span>
          </button>
        )
      })}
    </div>
  )
}
