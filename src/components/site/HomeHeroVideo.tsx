const HERO_VIDEO = '/hero-home.mp4'
const HERO_OVERLAY = '/hero-overlay-camada_transp.png'

export function HomeHeroVideo() {
  return (
    <section
      className="relative w-full overflow-hidden bg-paz-navy"
      aria-label="Vídeo de apresentação — Somos família"
    >
      <div className="relative h-[42svh] max-h-[52svh] w-full sm:h-auto sm:aspect-[1920/850] sm:min-h-[280px] sm:max-h-[min(56vh,850px)]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
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
