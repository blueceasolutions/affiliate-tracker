/**
 * FormDivider — "or sign in with email" visual separator.
 * Single responsibility: purely presentational divider.
 */
export function FormDivider({
  label = 'or sign in with email',
}: {
  label?: string
}) {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex-1 h-px bg-slate-200 dark:bg-slate-800' />
      <span className='text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap'>
        {label}
      </span>
      <div className='flex-1 h-px bg-slate-200 dark:bg-slate-800' />
    </div>
  )
}
