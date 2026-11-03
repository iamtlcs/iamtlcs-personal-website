import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { certifications } from '@/lib/certifications';

export function proxy(request: NextRequest) {
  // Check if the request comes from curl, wget, or other CLI tools
  const userAgent = request.headers.get('user-agent') || '';
  const isCLI = userAgent.includes('curl') || 
                userAgent.includes('Wget') || 
                userAgent.includes('HTTPie') ||
                userAgent.includes('httpie');

  // Only return JSON resume for the root path
  if (isCLI && request.nextUrl.pathname === '/') {
    const resume = {
      name: "Simon Cheung Tak Leung",
      role: "Backend & DevOps Engineer | Full-Stack Developer",
      tagline: "Building scalable systems and elegant solutions",
      location: "Hong Kong",
      skills: {
        backend: ["Node.js", "Python", "Go", "Express.js"],
        devops: ["Docker", "Kubernetes", "Terraform", "Ansible", "GitHub Actions"],
        cloud: ["AWS (SAA-C03)", "Azure (AZ-104)", "GCP", "Alibaba Cloud"],
        frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        data: ["Machine Learning", "Deep Learning", "PyTorch", "TensorFlow"],
      },
      certifications: certifications.map(cert => `${cert.name} (${cert.code})`),
      contact: {
        website: "https://iamtlcs.vercel.app",
        github: "https://github.com/iamtlcs",
        email: "Available on website",
      },
      easter_egg: "🎉 You found the hidden endpoint! Curious DevOps minds are the best kind.",
      tip: "Try: curl https://iamtlcs.vercel.app/api/status",
    };

    return new NextResponse(JSON.stringify(resume, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Role': 'DevOps-Engineer',
        'Cache-Control': 'private, no-store',
      },
    });
  }

  return NextResponse.next();
}

export const config = { matcher: ['/'] };
