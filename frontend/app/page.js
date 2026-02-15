import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroBanner from '../components/HeroBanner'
import TrendingSection from '../components/TrendingSection'
import HomeMovies from '../components/HomeMovies'
import HomeSeries from '../components/HomeSeries'
import InFeedAd from '../components/InFeedAd'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />
      
      {/* Hero Banner - Full Width */}
      <HeroBanner />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Main Content - No Sidebars */}
        <main className="max-w-[1400px] mx-auto space-y-12">
          {/* Trending This Week */}
          <TrendingSection />

          {/* In-Feed Ad 1 - Sau Trending */}
          <InFeedAd position="after-trending" />

          {/* Movies Section */}
          <HomeMovies />

          {/* In-Feed Ad 2 - Giữa Movies và Series */}
          <InFeedAd position="between-sections" />

          {/* Series Section */}
          <HomeSeries />
        </main>
      </div>

      <Footer />
    </div>
  )
}
