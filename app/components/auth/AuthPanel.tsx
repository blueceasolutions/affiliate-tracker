/**
 * AuthPanel — Left decorative panel with brand gradient, logo, tagline,
 * and an inline revenue chart illustration.
 * Single responsibility: purely presentational branding panel.
 */
export function AuthPanel() {
  return (
    <div
      className='hidden lg:flex flex-col justify-between p-10 relative overflow-hidden'
      style={{
        background: 'linear-gradient(160deg, #5a4d9c 0%, #3b3070 100%)',
      }}>
      {/* Decorative glow orb */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
      </div>

      {/* Logo */}
      <div className='flex items-center gap-3 relative z-10'>
        <div
          className='w-9 h-9 rounded-lg flex items-center justify-center'
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
              fill='white'
            />
          </svg>
        </div>
        <span className='text-white font-semibold text-lg tracking-wide'>
          Bluecea
        </span>
      </div>

      {/* Tagline */}
      <div className='relative z-10'>
        <h1 className='text-white font-bold text-4xl leading-tight mb-4'>
          Join the Bluecea
          <br />
          Affiliate Network
        </h1>
        <p className='text-white/70 text-base leading-relaxed max-w-xs'>
          Unlock your earning potential with real-time analytics, premium
          offers, and dedicated support designed to scale your performance.
        </p>
      </div>

      {/* Revenue card illustration */}
      <RevenueCard />

      {/* Footer */}
      <p className='text-white/40 text-xs relative z-10'>
        © 2026 Bluecea Inc. All rights reserved.
      </p>
    </div>
  )
}

/** Inline revenue card — pure SVG + HTML, no external assets */
function RevenueCard() {
  const bars = [42, 58, 52, 65, 55, 100]

  return (
    <div
      className='relative z-10 rounded-2xl p-5'
      style={{
        background: 'rgba(255,255,255,0.13)',
        backdropFilter: 'blur(12px)',
      }}>
      {/* Header */}
      <div className='flex items-center justify-between mb-1'>
        <span className='text-white/60 text-xs'>Monthly Revenue</span>
        <span
          className='text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1'
          style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
          ↑ +24%
        </span>
      </div>
      <p className='text-white font-bold text-2xl mb-4'>$124,500.00</p>

      {/* Bar chart */}
      <div className='flex items-end gap-2 h-16'>
        {bars.map((h, i) => {
          const isLast = i === bars.length - 1
          return (
            <div key={i} className='flex-1 flex flex-col items-center gap-1'>
              {isLast && (
                <span
                  className='text-[10px] font-medium px-1.5 py-0.5 rounded'
                  style={{ background: '#fff', color: '#3b3070' }}>
                  Best Month
                </span>
              )}
              <div
                className='w-full rounded-sm transition-all'
                style={{
                  height: `${(h / 100) * 48}px`,
                  background: isLast ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
