import { useParams } from 'react-router-dom'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
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
      <PageTitle title={copy.title} crumbs={[{ label: 'Home', to: '/' }, { label: copy.title }]} />
      <SiteSection>
        <p className="prose-paz mx-auto max-w-3xl whitespace-pre-line">{copy.body}</p>
      </SiteSection>
    </>
  )
}
