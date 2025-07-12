import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://iamtlcs-personal-website.vercel.app/sitemap.xml',
    host: 'https://iamtlcs-personal-website.vercel.app',
  }
}
