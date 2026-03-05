import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ContentDetail from '../../../components/ContentDetail';

async function getContent(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contents/${slug}`,
      {
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const content = await getContent(params.slug);
  
  if (!content) {
    return {
      title: 'Content Not Found',
    };
  }

  const description = content.description 
    ? content.description.substring(0, 160) 
    : `Watch ${content.title} review and details`;

  return {
    title: `${content.title} (${content.releaseYear || 'N/A'})`,
    description,
    keywords: [
      content.title,
      content.type === 'MOVIE' ? 'movie' : 'series',
      'review',
      'watch',
      ...(content.genres?.map(g => g.genre.name) || [])
    ],
    openGraph: {
      title: content.title,
      description,
      images: [
        {
          url: content.posterUrl || '/default-poster.jpg',
          width: 500,
          height: 750,
          alt: content.title,
        },
        {
          url: content.backdropUrl || content.posterUrl || '/default-backdrop.jpg',
          width: 1280,
          height: 720,
          alt: `${content.title} backdrop`,
        },
      ],
      type: 'video.movie',
      releaseDate: content.releaseYear ? `${content.releaseYear}-01-01` : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description,
      images: [content.posterUrl || '/default-poster.jpg'],
    },
  };
}

// Generate static params for popular content (optional)
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents?limit=50`);
    const contents = await res.json();
    
    return contents.map((content) => ({
      slug: content.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function ContentPage({ params }) {
  const content = await getContent(params.slug);

  if (!content) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': content.type === 'MOVIE' ? 'Movie' : 'TVSeries',
    name: content.title,
    description: content.description,
    image: content.posterUrl,
    datePublished: content.releaseYear ? `${content.releaseYear}-01-01` : undefined,
    aggregateRating: content.rating ? {
      '@type': 'AggregateRating',
      ratingValue: content.rating,
      bestRating: '10',
      worstRating: '0',
      ratingCount: '1'
    } : undefined,
    genre: content.genres?.map(g => g.genre.name),
    countryOfOrigin: content.country,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
        <Header />
        <main className="flex-1">
          <ContentDetail content={content} />
        </main>
        <Footer />
      </div>
    </>
  );
}
