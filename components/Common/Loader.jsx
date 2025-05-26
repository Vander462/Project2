import Loader from '@/components/Common/Loader'

export default function MenuPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return <Loader message="Fetching menu items..." />

  return (
    <div>Menu content goes here</div>
  )
}
