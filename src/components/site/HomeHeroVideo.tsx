const HERO_VIDEO = '/hero-home.mp4'
const HERO_OVERLAY = '/hero-overlay-camada_transp.png'
const HERO_POSTER = '/image-12a4bb2c-a74f-4587-aacb-ba96ca812599.jpg'

export function HomeHeroVideo() {
  return (
    <section
      className="relative w-full overflow-hidden bg-paz-navy"
      aria-label="Vídeo de apresentação — Somos família"
    >
      <div className="relative aspect-[1920/850] w-full max-h-[min(56vh,850px)] min-h-[220px] sm:min-h-[280px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <img
          src={HERO_OVERLAY}
          alt="Somos família"
          width={1920}
          height={850}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 z-10 m-auto h-full w-full object-contain object-center"
        />
      </div>
    </section>
  )
}
