import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string; wide?: boolean }

export function SiteSection({ children, className = '', wide }: Props) {
  return (
    <section className={`py-8 md:py-14 ${className}`}>
      <div className={wide ? 'px-0' : 'site-container'}>{children}</div>
    </section>
  )
}
