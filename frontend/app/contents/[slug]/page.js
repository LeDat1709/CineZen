import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar'
import Footer from '../../../components/Footer'
import ContentDetail from '../../../components/ContentDetail'

export default function ContentPage({ params }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <Sidebar position="left" />
          </aside>

          <main className="flex-1 min-w-0">
            <ContentDetail slug={params.slug} />
          </main>

          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <Sidebar position="right" />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
