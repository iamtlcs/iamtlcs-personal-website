'use client';

// ============================================================================
// IMPORTS
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand, Download, X } from 'lucide-react';
import mermaid from 'mermaid';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  description?: string;
  scale?: number; // SVG scale multiplier (default: 1.0)
  minHeight?: number; // Minimum container height in pixels (default: 400)
  maxWidth?: string; // Maximum width of diagram container (default: '100%')
  fontSize?: string; // Font size for diagram text (default: '16px')
  nodeSpacing?: number; // Space between nodes (default: 50)
  rankSpacing?: number; // Space between ranks/levels (default: 80)
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MERMAID_CONFIG = {
  startOnLoad: true,
  theme: 'dark' as const,
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
    curve: 'basis' as const,
    padding: 20,
    nodeSpacing: 50,
    rankSpacing: 80,
    useMaxWidth: true,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function MermaidDiagram({ 
  chart, 
  title, 
  description,
  scale = 1.0,
  minHeight = 400,
  maxWidth = '100%',
  fontSize = '16px',
  nodeSpacing = 50,
  rankSpacing = 80,
}: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Mermaid with custom config
  useEffect(() => {
    setMounted(true);
    const customConfig = {
      ...MERMAID_CONFIG,
      themeVariables: {
        ...MERMAID_CONFIG.themeVariables,
        fontSize,
      },
      flowchart: {
        ...MERMAID_CONFIG.flowchart,
        nodeSpacing,
        rankSpacing,
      },
    };
    mermaid.initialize(customConfig);
  }, [fontSize, nodeSpacing, rankSpacing]);

  // Render diagram when mounted or chart changes
  useEffect(() => {
    if (!mounted || !ref.current) return;

    const renderDiagram = async () => {
      try {
        // Clear previous content
        ref.current!.innerHTML = '';
        
        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a container for Mermaid to render into
        const container = document.createElement('div');
        container.id = id;
        container.className = 'mermaid';
        container.textContent = chart.trim();
        
        ref.current!.appendChild(container);
        
        // Use Mermaid v11 API
        if (typeof mermaid.run === 'function') {
          // Modern API (v10+)
          await mermaid.run({
            nodes: [container],
            suppressErrors: true,
          });
        } else if (typeof mermaid.contentLoaded === 'function') {
          // Legacy API fallback
          mermaid.contentLoaded();
        } else {
          // Alternative: use render API if available
          const { svg } = await mermaid.render(id, chart.trim());
          container.innerHTML = svg;
        }
        
        // Scale SVG to fit container nicely (if not in fullscreen)
        if (!isFullscreen && ref.current) {
          const svg = ref.current.querySelector('svg');
          if (svg) {
            // Remove any default width/height attributes to make it responsive
            svg.removeAttribute('height');
            svg.style.width = '100%';
            svg.style.height = 'auto';
            svg.style.maxWidth = '100%';
            svg.style.display = 'block';
            svg.style.margin = '0 auto';
            svg.style.verticalAlign = 'top';
            
            // Apply custom scale if specified
            if (scale !== 1.0) {
              svg.style.transform = `scale(${scale})`;
              svg.style.transformOrigin = 'center';
            }
          }
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        if (ref.current) {
          ref.current.innerHTML = `<div class="text-red-500 dark:text-red-400 p-4 text-center text-sm">Error rendering diagram. Please refresh the page.</div>`;
        }
      }
    };

    renderDiagram();
  }, [mounted, chart, isFullscreen, scale]);

  // Download diagram as SVG
  const handleDownload = () => {
    if (!ref.current) return;

    const svg = ref.current.querySelector('svg');
    if (!svg) return;

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
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Handle ESC key to exit fullscreen and prevent body scroll
  useEffect(() => {
    if (!isFullscreen) return;
    
    // Prevent body scroll when fullscreen
    document.body.style.overflow = 'hidden';
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (!mounted) return null;

  return (
    <motion.div
      className="relative group mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title and Description */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-700 dark:text-slate-300 ml-3 leading-relaxed break-words">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Diagram Container */}
      <div 
        className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-hidden backdrop-blur-sm mx-auto"
        style={{ 
          maxWidth,
          padding: '1.5rem'
        }}
      >
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Fullscreen"
            aria-label="Toggle fullscreen mode"
          >
            <Expand className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as SVG"
            aria-label="Download diagram as SVG"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mermaid Diagram */}
        <div
          ref={ref}
          style={{ 
            minHeight: `${minHeight}px`,
          }}
          className="mermaid flex justify-center items-center w-full"
        />

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>💡 Tip: Hover to see actions • Click and drag to explore</span>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullscreen}
          >
            {/* Close Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="absolute top-8 right-8 p-3 rounded-lg bg-slate-800/90 text-white hover:bg-red-600 transition-colors shadow-lg backdrop-blur-sm z-[10000]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Exit Fullscreen (ESC)"
            >
              <X className="w-5 h-5" />
            </motion.button>
            
            {/* Render diagram in fullscreen */}
            <div 
              className="w-full h-full flex items-center justify-center overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: ref.current?.innerHTML || '' }}
                className="max-w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// SAMPLE ARCHITECTURE DIAGRAMS
// ============================================================================

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

    ecsBlueGreen: `
    graph TB
      subgraph Internet
        User[👤 Users]
      end
      
      subgraph AWS Cloud
        ALB[⚖️ Application Load Balancer]
        
        subgraph ECS Cluster
          TG1[🎯 Target Group Blue]
          TG2[🎯 Target Group Green]
          Blue[🔵 ECS Service Blue<br/>Running v1.0]
          Green[🟢 ECS Service Green<br/>Running v2.0]
        end
        
        CodeDeploy[🚀 CodeDeploy]
        ECR[(🐳 ECR Registry)]
        CloudWatch[📊 CloudWatch Monitoring]
      end
      
      User -->|Traffic| ALB
      ALB -->|100% Initially| TG1
      ALB -.->|0% Initially| TG2
      TG1 --> Blue
      TG2 --> Green
      
      CodeDeploy -->|Deploy New Version| Green
      CodeDeploy -->|Shift Traffic| ALB
      ECR -->|Pull Images| Blue
      ECR -->|Pull Images| Green
      
      Blue -.->|Metrics| CloudWatch
      Green -.->|Metrics| CloudWatch
      CodeDeploy -.->|Monitor Deployment| CloudWatch
      
      style User fill:#3b82f6,stroke:#2563eb,color:#fff
      style ALB fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style Blue fill:#3b82f6,stroke:#2563eb,color:#fff
      style Green fill:#10b981,stroke:#059669,color:#fff
      style CodeDeploy fill:#f59e0b,stroke:#d97706,color:#fff
      style ECR fill:#06b6d4,stroke:#0891b2,color:#fff
      style CloudWatch fill:#6366f1,stroke:#4f46e5,color:#fff
  `,

    multiRegionEKS: `
    graph TB
      subgraph DNS["🌐 Route 53 DNS"]
        API1["api-prod.XXX.com"]
        API2["api-staging.XXX.com"]
        API3["api-dev.XXX.com"]
      end
      
      subgraph Region1["☁️ ap-east-1 Region"]
        WAF[🛡️ WAF/Firewall]
        
        subgraph VPC1["🔒 VPC"]
          subgraph AZ1["Availability Zone 1"]
            subgraph PubSubnet1["🌐 Public Subnet"]
              LB1[⚖️ Load Balancer]
            end
            subgraph PrivSubnet1["🔐 Private Subnet"]
              EKSPods1[☸️ EKS Pods<br/>Container Services]
            end
          end
          
          subgraph AZ2["Availability Zone 2"]
            subgraph PubSubnet2["🌐 Public Subnet"]
              LB2[⚖️ Load Balancer]
            end
            subgraph PrivSubnet2["🔐 Private Subnet"]
              EKSPods2[☸️ EKS Pods<br/>Container Services]
            end
          end
          
          Prod[📦 Production Services]
          NonProd[📦 Non-Production Services]
        end
        
        PrivateEndpoint[🔗 Private Endpoint<br/>Connection String]
      end
      
      subgraph Region2["☁️ ap-southeast-1 Region"]
        subgraph VPC2["🔒 VPC"]
          subgraph AZ3["Availability Zone 1"]
            subgraph PubSubnet3["🌐 Public Subnet"]
              LB3[⚖️ Load Balancer]
            end
            subgraph PrivSubnet3["🔐 Private Subnet"]
              Lambda1[⚡ Lambda Function]
            end
          end
          
          subgraph AZ4["Availability Zone 2"]
            subgraph PubSubnet4["🌐 Public Subnet"]
              LB4[⚖️ Load Balancer]
            end
            subgraph PrivSubnet4["🔐 Private Subnet"]
              Lambda2[⚡ Lambda Function]
            end
          end
        end
        
        VPCPeering[🔗 VPC Peering<br/>Standard Connection String]
      end
      
      subgraph MongoDB["🗄️ MongoDB Atlas"]
        MongoDBVPC[🔒 VPC from MongoDB Atlas]
        MongoDBProd[🌿 Production/Non-Production Instance]
      end
      
      API1 --> WAF
      API2 --> WAF
      API3 --> WAF
      
      WAF --> LB1
      WAF --> LB2
      LB1 --> Production
      LB1 --> Non-Production
      LB2 --> Production
      LB2 --> Non-Production
      
      Production --> EKSPods1
      Non-Production --> EKSPods1
      Production --> EKSPods2
      Non-Production --> EKSPods2
      
      EKSPods1 --> PrivateEndpoint
      EKSPods2 --> PrivateEndpoint
      
      LB3 --> Lambda1
      LB4 --> Lambda2
      
      Lambda1 --> VPCPeering
      Lambda2 --> VPCPeering
      
      PrivateEndpoint --> MongoDBVPC
      VPCPeering --> MongoDBVPC
      MongoDBVPC --> MongoDBProd
      
      style API1 fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style API2 fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style API3 fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style WAF fill:#ec4899,stroke:#db2777,color:#fff
      style LB1 fill:#10b981,stroke:#059669,color:#fff
      style LB2 fill:#10b981,stroke:#059669,color:#fff
      style LB3 fill:#10b981,stroke:#059669,color:#fff
      style LB4 fill:#10b981,stroke:#059669,color:#fff
      style Production fill:#f59e0b,stroke:#d97706,color:#fff
      style Non-Production fill:#f59e0b,stroke:#d97706,color:#fff
      style EKSPods1 fill:#3b82f6,stroke:#2563eb,color:#fff
      style EKSPods2 fill:#3b82f6,stroke:#2563eb,color:#fff
      style Lambda1 fill:#f59e0b,stroke:#d97706,color:#fff
      style Lambda2 fill:#f59e0b,stroke:#d97706,color:#fff
      style PrivateEndpoint fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style VPCPeering fill:#8b5cf6,stroke:#7c3aed,color:#fff
      style MongoDBProd fill:#10b981,stroke:#059669,color:#fff
      style MongoDBVPC fill:#6366f1,stroke:#4f46e5,color:#fff
  `,
};
