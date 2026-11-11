import { Facebook, Instagram, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FOOTER_COLUMNS } from '../../data/navigation'
import { CHURCH } from '../../data/churchContent'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-paz-navy text-white">
      <div className="site-container grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:gap-x-8 sm:gap-y-8 sm:py-12 lg:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="min-w-0">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-white/90 sm:mb-3 sm:text-sm sm:tracking-wider">
              {col.title}
            </h3>
            <ul className="space-y-0.5 text-xs text-white/75 sm:space-y-2 sm:text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md py-1.5 leading-snug active:text-white sm:py-0 sm:hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="block rounded-md py-1.5 leading-snug active:text-white sm:py-0 sm:hover:text-white"
                    >
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
        <div className="site-container flex flex-col items-center justify-between gap-3 py-5 sm:flex-row sm:gap-4 sm:py-6">
          <div className="text-center text-xs text-white/60 sm:text-left">
            <p>
              © {new Date().getFullYear()} {CHURCH.name}. Inspirado em{' '}
              <a href="https://paz.church/belem/" className="underline hover:text-white">
                paz.church/belem
              </a>
            </p>
            <p className="mt-1">
              Construído por{' '}
              <a
                href="https://www.edersonprogramador.com.br/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                Ederson programador
              </a>
            </p>
          </div>
          <div className="flex gap-1 sm:gap-4">
            <a
              href={CHURCH.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="touch-target rounded-lg text-white/80 active:bg-white/10 sm:hover:text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://paz.church/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="touch-target rounded-lg text-white/80 active:bg-white/10 sm:hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://paz.church/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="touch-target rounded-lg text-white/80 active:bg-white/10 sm:hover:text-white"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
