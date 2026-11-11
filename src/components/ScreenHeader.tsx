import { Info } from 'lucide-react'
import { CHURCH } from '../data/churchContent'

type Props = { title: string; showInfo?: boolean }

export function ScreenHeader({ title, showInfo = true }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-paz-navy px-4 py-3 text-center text-white shadow-md">
      <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
      {showInfo && (
        <a
          href={CHURCH.site}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90"
          aria-label="Informações"
        >
          <Info className="h-5 w-5" />
        </a>
      )}
    </header>
  )
}
