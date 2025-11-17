import HeroSlider from '@/components/HeroSlider'
import VideoBanner from '@/components/VideoBanner'
import NewsSection from '@/components/NewsSection'
import BottomNav from '@/components/BottomNav'

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <HeroSlider />
      <VideoBanner />
      <NewsSection />
      <BottomNav />
    </main>
  )
}

