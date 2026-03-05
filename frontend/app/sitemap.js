export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Fetch all contents for dynamic URLs
  let contents = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (response.ok) {
      contents = await response.json();
    }
  } catch (error) {
    console.error('Error fetching contents for sitemap:', error);
  }

  // Generate content URLs
  const contentUrls = contents.map((content) => ({
    url: `${baseUrl}/contents/${content.slug}`,
    lastModified: content.updatedAt || content.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...staticPages, ...contentUrls];
}
