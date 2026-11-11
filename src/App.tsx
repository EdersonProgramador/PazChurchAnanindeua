import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRouter } from './router'

type Props = { onRoutePaint?: () => void }

export default function App({ onRoutePaint }: Props) {
  const location = useLocation()
  useEffect(() => {
    onRoutePaint?.()
  }, [location.pathname, onRoutePaint])
  return <AppRouter />
}
