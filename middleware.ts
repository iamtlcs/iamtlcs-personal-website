import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiter
function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
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
      location: "Hong Kong (ap-east-1)",
      skills: {
        backend: ["Node.js", "Python", "Go", "Express.js"],
        devops: ["Docker", "Kubernetes", "Terraform", "Ansible", "GitHub Actions"],
        cloud: ["AWS (SAA-C03)", "Azure (AZ-104)", "GCP", "Alibaba Cloud"],
        frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        data: ["Machine Learning", "Deep Learning", "PyTorch", "TensorFlow"],
      },
      certifications: [
        "AWS Solutions Architect Associate (SAA-C03)",
        "Microsoft Azure Administrator (AZ-104)",
        "Certified Kubernetes Administrator (CKA)",
        "eLearnSecurity Junior Penetration Tester (eJPT)",
      ],
      contact: {
        website: "https://iamtlcs-personal-website.vercel.app",
        github: "https://github.com/iamtlcs",
        email: "Available on website",
      },
      status: {
        system: "Operational 🟢",
        deployment: "Vercel Edge Network",
        uptime: "99.99%",
      },
      easter_egg: "🎉 You found the hidden endpoint! Curious DevOps minds are the best kind.",
      tip: "Try: curl https://iamtlcs-personal-website.vercel.app/api/status",
    };

    return new NextResponse(JSON.stringify(resume, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Role': 'DevOps-Engineer',
        'X-Powered-By': 'Next.js + DevOps Magic ✨',
        'X-Response-Time': `${Date.now()}ms`,
      },
    });
  }

  const response = NextResponse.next();

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             'unknown';

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  // Security Headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "connect-src 'self' https:",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', '),
    
    // Strict Transport Security (HTTPS only)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Custom headers for analytics
    'X-Robots-Tag': 'index, follow',
    'X-DNS-Prefetch-Control': 'on',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add custom DevOps headers
  response.headers.set('X-Role', 'DevOps-Engineer');
  response.headers.set('X-Powered-By', 'Next.js + DevOps Magic ✨');
  response.headers.set('X-Location', 'Hong Kong (ap-east-1)');

  // Add cache control for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add cache control for images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400, must-revalidate');
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

