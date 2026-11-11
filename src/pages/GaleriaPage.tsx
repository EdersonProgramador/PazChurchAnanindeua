import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { GALLERY_FACEBOOK, GALLERY_ITEMS } from '../data/gallery'

export function GaleriaPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      <PageTitle
        title="Galeria de fotos"
        subtitle="Momentos da Paz Church Ananindeua — confira também nosso Facebook."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Galeria' }]}
      />
      <SiteSection>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <button
              key={item.src}
              type="button"
              className="group overflow-hidden rounded-xl border bg-white text-left shadow-sm ring-1 ring-slate-100 active:ring-paz-accent/40 sm:hover:ring-paz-accent/30"
              onClick={() => setLightbox(item.src)}
            >
              <img
                src={item.src}
                alt={item.alt ?? item.title}
                className="aspect-[4/3] w-full object-cover sm:transition sm:group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
              <p className="p-3 text-left text-sm font-medium leading-snug text-paz-navy">{item.title}</p>
            </button>
          ))}
        </div>
        <p className="mt-10 text-center">
          <a
            href={GALLERY_FACEBOOK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-paz-accent hover:underline"
          >
            Ver álbums no Facebook
            <ExternalLink className="h-4 w-4" />
          </a>
        </p>
      </SiteSection>
      {lightbox && (
        <motionLightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}

function motionLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <img src={src} alt="" className="max-h-[90vh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
      <button type="button" className="absolute right-4 top-4 text-white" onClick={onClose}>
        Fechar
      </button>
    </div>
  )
}
