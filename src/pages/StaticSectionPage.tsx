import { useParams } from 'react-router-dom'
import { ScreenHeader } from '../components/ScreenHeader'
import { STATIC_COPY } from '../data/churchContent'

type Props = { base: string }

export function StaticSectionPage({ base }: Props) {
  const { section } = useParams()
  const key = `${base}/${section}`
  const copy = STATIC_COPY[key] ?? {
    title: section ?? 'Conteúdo',
    body: 'Em breve mais informações para Paz Church Ananindeua.',
  }

  return (
    <>
      <ScreenHeader title={copy.title} />
      <div className="paz-screen-enter whitespace-pre-line p-5 text-sm leading-relaxed text-paz-navy">
        {copy.body}
      </div>
    </>
  )
}
