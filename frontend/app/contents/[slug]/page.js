import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ContentDetail from '../../../components/ContentDetail'

export default function ContentPage({ params }) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      {/* Main Content - No sidebar ads */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <ContentDetail slug={params.slug} />
      </div>

      <Footer />
    </div>
  )
}
