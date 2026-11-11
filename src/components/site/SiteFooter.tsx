import { Facebook, Instagram, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FOOTER_COLUMNS } from '../../data/navigation'
import { CHURCH } from '../../data/churchContent'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-paz-navy text-white">
      <div className="site-container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/90">{col.title}</h3>
            <ul className="space-y-2 text-sm text-white/75">
              {col.links.map((link) => (
                <li key={link.label}>
                  {'external' in link && link.external ? (
                    <a href={link.to} target="_blank" rel="noreferrer" className="hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to} className="hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} {CHURCH.name}. Inspirado em{' '}
            <a href="https://paz.church/belem/" className="underline hover:text-white">
              paz.church/belem
            </a>
          </p>
          <div className="flex gap-4">
            <a href={CHURCH.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-white/80 hover:text-white" />
            </a>
            <a href="https://paz.church/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-white/80 hover:text-white" />
            </a>
            <a href="https://paz.church/" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="h-5 w-5 text-white/80 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
