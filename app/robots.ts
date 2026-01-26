import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://contest-tracker-zms3.vercel.app/'; // Replace with your actual domain
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard'],
      },
    ],
    sitemap: `https://contest-tracker-zms3.vercel.app/sitemap.xml`,
  };
}