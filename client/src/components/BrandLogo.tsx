import React, { useState } from 'react'

export default function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const logoUrl = "https://chatgpt.com/backend-api/estuary/content?id=file_000000003dc882118ad85d2ce36a06a0&ts=496330&p=fs&cid=1&sig=03fea84308a484b15c90c5e56f6bcb83021211fb2f770ebd0ea06be3742e1378&v=0"

  const imageSizes = {
    sm: 'h-8 max-w-[120px]',
    md: 'h-10 sm:h-11 max-w-[170px]',
    lg: 'h-13 sm:h-15 max-w-[230px]'
  }

  const badgeSizes = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-9 h-9 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-bold'
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none group">
      {!imgError ? (
        <div className="bg-[#1C1612]/90 border border-orange-500/30 p-1.5 rounded-2xl shadow-lg shadow-orange-500/10 backdrop-blur-md flex items-center justify-center">
          <img
            src={logoUrl}
            alt="Fish Mart Logo"
            onError={() => setImgError(true)}
            className={`${imageSizes[size]} object-contain filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)] transition-transform group-hover:scale-105 duration-300`}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          {/* Sunset Orange Fallback Badge */}
          <div className={`${badgeSizes[size]} rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-400 p-[1.5px] shadow-md shadow-orange-500/20`}>
            <div className="w-full h-full bg-[#16110E] rounded-[10px] flex items-center justify-center font-extrabold text-orange-400">
              FM
            </div>
          </div>
          <div className={`font-brand ${textSizes[size]} font-extrabold tracking-wider uppercase flex items-center gap-1.5`}>
            <span className="text-stone-100 drop-shadow-sm">FISH</span>
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
              MART
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
