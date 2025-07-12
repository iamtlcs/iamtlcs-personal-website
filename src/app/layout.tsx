import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://iamtlcs-personal-website.vercel.app'),
  title: {
    default: "Simon Cheung Tak Leung - Full Stack & DevOps Engineer",
    template: "%s | Simon Cheung Tak Leung"
  },
  description: "Portfolio of Simon Cheung Tak Leung - A passionate Full Stack & DevOps Engineer specializing in React, Node.js, AWS, and cloud-native solutions. Building scalable and dynamic web experiences.",
  keywords: [
    "Simon Cheung", 
    "Simon Cheung Tak Leung", 
    "Full Stack Developer", 
    "DevOps Engineer", 
    "React Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "AWS Solutions Architect",
    "Azure Developer",
    "Cloud Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Software Engineer",
    "Hong Kong Developer",
    "CUHK Graduate",
    "Statistics Graduate",
    "Portfolio",
    "Web Development",
    "Cloud Computing",
    "DevOps",
    "CI/CD",
    "Terraform",
    "Docker",
    "Kubernetes",
    "Python Developer",
    "Next.js Developer",
    "TailwindCSS",
    "Responsive Design",
    "GitHub Developer",
    "LinkedIn Profile",
    "Open Source Contributor",
    "Tech Professional Hong Kong"
  ],
  authors: [{ name: "Simon Cheung Tak Leung", url: "https://iamtlcs-personal-website.vercel.app" }],
  creator: "Simon Cheung Tak Leung",
  publisher: "Simon Cheung Tak Leung",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iamtlcs-personal-website.vercel.app',
    siteName: 'Simon Cheung Tak Leung - Portfolio',
    title: 'Simon Cheung Tak Leung - Full Stack & DevOps Engineer',
    description: 'Portfolio of Simon Cheung Tak Leung - A passionate Full Stack & DevOps Engineer specializing in React, Node.js, AWS, and cloud-native solutions.',
    images: [
      {
        url: '/MyPhoto1.png',
        width: 1200,
        height: 630,
        alt: 'Simon Cheung Tak Leung - Full Stack & DevOps Engineer',
        type: 'image/png',
      }
    ],
  },
  alternates: {
    canonical: 'https://iamtlcs-personal-website.vercel.app',
  },
  category: 'Technology',
  classification: 'Portfolio Website',
  referrer: 'origin-when-cross-origin',
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Simon Cheung Tak Leung",
    "alternateName": "Simon Cheung",
    "jobTitle": ["Full Stack Developer", "DevOps Engineer"],
    "description": "Passionate Full Stack & DevOps Engineer specializing in React, Node.js, AWS, and cloud-native solutions",
    "url": "https://iamtlcs-personal-website.vercel.app",
    "image": "https://iamtlcs-personal-website.vercel.app/MyPhoto1.png",
    "sameAs": [
      "https://www.linkedin.com/in/iamtlcs",
      "https://github.com/iamtlcs"
    ],
    "mainEntityOfPage": {
      "@type": "ProfilePage",
      "@id": "https://iamtlcs-personal-website.vercel.app"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "The Chinese University of Hong Kong",
      "sameAs": "https://www.cuhk.edu.hk/"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Bachelor of Science in Statistics",
        "educationalLevel": "Bachelor",
        "credentialCategory": "degree"
      }
    ],
    "knowsAbout": [
      "JavaScript", "TypeScript", "React", "Node.js", "Python",
      "AWS", "Azure", "DevOps", "Cloud Computing", "Terraform",
      "Docker", "Kubernetes", "CI/CD", "Full Stack Development"
    ],
    "workLocation": {
      "@type": "Place",
      "name": "Hong Kong"
    },
    "nationality": {
      "@type": "Country",
      "name": "Hong Kong"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "professional",
      "url": "https://www.linkedin.com/in/iamtlcs"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <link rel="canonical" href="https://iamtlcs-personal-website.vercel.app" />
        
        {/* LinkedIn specific meta tags */}
        <meta property="profile:first_name" content="Simon" />
        <meta property="profile:last_name" content="Cheung Tak Leung" />
        <meta property="profile:username" content="iamtlcs" />
        
        {/* GitHub specific meta tags */}
        <meta name="github-username" content="iamtlcs" />
        <meta name="developer-profile" content="https://github.com/iamtlcs" />
      </head>
      <body 
        className={`${inter.variable} font-inter antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
