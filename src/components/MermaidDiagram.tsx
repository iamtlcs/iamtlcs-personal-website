'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';
import { Expand, Download } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  description?: string;
}

export default function MermaidDiagram({ chart, title, description }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#60a5fa',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#ec4899',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        textColor: '#f1f5f9',
        border1: '#475569',
        border2: '#64748b',
        fontSize: '16px',
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
      },
    });
  }, []);

  useEffect(() => {
    if (mounted && ref.current) {
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [mounted, chart]);

  const handleDownload = () => {
    if (ref.current) {
      const svg = ref.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `architecture-${Date.now()}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      }
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title and Description */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 ml-3">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Diagram Container */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-6 overflow-x-auto backdrop-blur-sm">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Fullscreen"
          >
            <Expand className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as SVG"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mermaid Diagram */}
        <div
          ref={ref}
          className={`mermaid flex justify-center items-center min-h-[300px] ${
            isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl p-8' : ''
          }`}
        />

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>💡 Tip: Hover to see actions • Click and drag to explore</span>
        </div>
      </div>
    </motion.div>
  );
}

// Sample architecture diagrams you can use

export const sampleArchitectures = {
  fullStack: `
    graph TB
      User[👤 User]
      LB[⚖️ Load Balancer<br/>Nginx]
      FE[🎨 Frontend<br/>Next.js + React]
      API[🔧 API Gateway<br/>Express.js]
      Auth[🔐 Auth Service<br/>JWT]
      Cache[⚡ Redis Cache]
      DB[(🗄️ PostgreSQL<br/>Database)]
      CDN[🌐 CDN<br/>Vercel Edge]
      Monitor[📊 Monitoring<br/>Datadog]
      
      User -->|HTTPS| CDN
      CDN -->|Static Assets| FE
      User -->|API Requests| LB
      LB --> API
      API --> Auth
      API --> Cache
      Cache -.->|Cache Miss| DB
      API --> DB
      API -.->|Metrics| Monitor
      
      style User fill:#3b82f6,stroke:#2563eb,color:#fff
      style LB fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style FE fill:#ec4899,stroke:#db2777,color:#fff
      style API fill:#10b981,stroke:#059669,color:#fff
      style Cache fill:#f59e0b,stroke:#d97706,color:#fff
      style DB fill:#6366f1,stroke:#4f46e5,color:#fff
  `,
  
  cicd: `
    graph LR
      Dev[💻 Developer]
      Git[📦 GitHub]
      Actions[🔄 GitHub Actions]
      Test[✅ Test Suite]
      Build[🏗️ Build]
      Docker[🐳 Docker Registry]
      K8s[☸️ Kubernetes]
      Prod[🚀 Production]
      
      Dev -->|git push| Git
      Git -->|webhook| Actions
      Actions --> Test
      Test -->|pass| Build
      Build --> Docker
      Docker --> K8s
      K8s --> Prod
      
      style Dev fill:#3b82f6,stroke:#2563eb,color:#fff
      style Actions fill:#10b981,stroke:#059669,color:#fff
      style Test fill:#f59e0b,stroke:#d97706,color:#fff
      style Docker fill:#06b6d4,stroke:#0891b2,color:#fff
      style K8s fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style Prod fill:#ec4899,stroke:#db2777,color:#fff
  `,

  microservices: `
    graph TB
      subgraph Client
        Web[🌐 Web App]
        Mobile[📱 Mobile App]
      end
      
      subgraph API Layer
        Gateway[🚪 API Gateway]
      end
      
      subgraph Services
        User[👤 User Service]
        Order[🛒 Order Service]
        Payment[💳 Payment Service]
        Notify[📧 Notification Service]
      end
      
      subgraph Data Layer
        UserDB[(User DB)]
        OrderDB[(Order DB)]
        Queue[📮 Message Queue]
      end
      
      Web --> Gateway
      Mobile --> Gateway
      Gateway --> User
      Gateway --> Order
      Gateway --> Payment
      User --> UserDB
      Order --> OrderDB
      Order --> Queue
      Payment --> Queue
      Queue --> Notify
      
      style Gateway fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style User fill:#3b82f6,stroke:#2563eb,color:#fff
      style Order fill:#10b981,stroke:#059669,color:#fff
      style Payment fill:#f59e0b,stroke:#d97706,color:#fff
      style Notify fill:#ec4899,stroke:#db2777,color:#fff
  `,
};

