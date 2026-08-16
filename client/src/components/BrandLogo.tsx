import React, { useState } from 'react'

export default function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const logoUrl = "https://chatgpt.com/backend-api/estuary/content?id=file_000000003dc882118ad85d2ce36a06a0&ts=496330&p=fs&cid=1&sig=03fea84308a484b15c90c5e56f6bcb83021211fb2f770ebd0ea06be3742e1378&v=0"

  const imageSizes = {
    sm: 'h-8 max-w-[120px]',
    md: 'h-10 sm:h-12 max-w-[180px]',
    lg: 'h-14 sm:h-16 max-w-[240px]'
  }

  const badgeSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-lg',
    lg: 'w-14 h-14 text-2xl'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none group">
      {!imgError ? (
        <div className="bg-slate-900/90 border border-cyan-500/30 p-1.5 rounded-2xl shadow-lg shadow-cyan-500/20 backdrop-blur-md flex items-center justify-center">
          <img
            src={logoUrl}
            alt="Fish Mart Logo"
            onError={() => setImgError(true)}
            className={`${imageSizes[size]} object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)] transition-transform group-hover:scale-105 duration-300`}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* High Visibility Fallback Badge */}
          <div className={`${badgeSizes[size]} rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-teal-300 p-[2px] shadow-lg shadow-cyan-500/30`}>
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-cyan-300">
              🐟
            </div>
          </div>
          <div className={`font-brand ${textSizes[size]} font-black tracking-wider uppercase flex items-center gap-1`}>
            <span className="text-white drop-shadow-md">FISH</span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 bg-clip-text text-transparent drop-shadow-sm">
              MART
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
