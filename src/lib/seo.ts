import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

export function generateSEO({
  title = 'Simon Cheung Tak Leung - Full Stack & DevOps Engineer',
  description = 'Portfolio of Simon Cheung Tak Leung - A passionate Full Stack & DevOps Engineer specializing in React, Node.js, AWS, and cloud-native solutions.',
  keywords = [],
  image = '/MyPhoto1.png',
  url = 'https://iamtlcs-personal-website.vercel.app',
  type = 'website'
}: SEOProps): Metadata {
  const fullTitle = title.includes('Simon Cheung') ? title : `${title} | Simon Cheung Tak Leung`;
  
  return {
    title: fullTitle,
    description,
    keywords: [
      'Simon Cheung',
      'Simon Cheung Tak Leung',
      'Full Stack Developer',
      'DevOps Engineer',
      'React Developer',
      'Node.js Developer',
      'AWS Solutions Architect',
      'Hong Kong Developer',
      ...keywords
    ],
    openGraph: {
      title: fullTitle,
      description,
      url,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default generateSEO;
