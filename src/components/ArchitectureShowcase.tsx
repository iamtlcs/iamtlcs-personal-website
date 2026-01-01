'use client';

import MermaidDiagram, { sampleArchitectures } from './MermaidDiagram';
import { motion } from 'framer-motion';
import { Layers, Network, GitBranch } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ArchitectureShowcase() {
  const { t } = useLanguage();
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 rounded-2xl shadow-2xl mb-8 border border-slate-300 dark:border-slate-700">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {t.architecture.title}
            </h2>
          </div>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.architecture.subtitle}
          </p>
        </motion.div>

        {/* Full-Stack Architecture */}
        <div className="mb-12">
          <MermaidDiagram
            chart={sampleArchitectures.fullStack}
            title={t.architecture.fullStackTitle}
            description={t.architecture.fullStackDescription}
          />
        </div>

        {/* CI/CD Pipeline */}
        <div className="mb-12">
          <MermaidDiagram
            chart={sampleArchitectures.cicd}
            title={t.architecture.cicdTitle}
            description={t.architecture.cicdDescription}
          />
        </div>

        {/* Microservices */}
        <div className="mb-12">
          <MermaidDiagram
            chart={sampleArchitectures.microservices}
            title={t.architecture.microservicesTitle}
            description={t.architecture.microservicesDescription}
          />
        </div>

        {/* Custom Project Architecture - URL Shortener */}
        <div className="mb-12">
          <MermaidDiagram
            chart={`
              graph TB
                User[👤 User]
                CF[☁️ CloudFront CDN]
                APIGateway[🚪 API Gateway]
                Lambda[⚡ Lambda Function]
                DynamoDB[(🗄️ DynamoDB)]
                CloudWatch[📊 CloudWatch]
                
                User -->|1. Request Short URL| CF
                CF -->|2. Route Request| APIGateway
                APIGateway -->|3. Invoke| Lambda
                Lambda -->|4. Lookup/Create| DynamoDB
                Lambda -->|5. Return Response| APIGateway
                APIGateway -->|6. Cache & Respond| CF
                CF -->|7. Deliver Result| User
                Lambda -.->|Logs & Metrics| CloudWatch
                
                style User fill:#3b82f6,stroke:#2563eb,color:#fff
                style CF fill:#ec4899,stroke:#db2777,color:#fff
                style APIGateway fill:#8b5cf6,stroke:#7c3aed,color:#fff
                style Lambda fill:#f59e0b,stroke:#d97706,color:#fff
                style DynamoDB fill:#10b981,stroke:#059669,color:#fff
                style CloudWatch fill:#6366f1,stroke:#4f46e5,color:#fff
            `}
            title={t.architecture.urlShortenerTitle}
            description={t.architecture.urlShortenerDescription}
          />
        </div>

        {/* Custom Project Architecture - ECS Blue-Green */}
        <div className="mb-12">
          <MermaidDiagram
            chart={`
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
            `}
            title={t.architecture.ecsBlueGreenTitle}
            description={t.architecture.ecsBlueGreenDescription}
          />
        </div>

        {/* DevOps Note */}
        <motion.div
          className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <Network className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                {t.architecture.devopsNoteTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {t.architecture.devopsNoteDescription}
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>{t.architecture.devopsNotePoints.point1}</li>
                <li>{t.architecture.devopsNotePoints.point2}</li>
                <li>{t.architecture.devopsNotePoints.point3}</li>
                <li>{t.architecture.devopsNotePoints.point4}</li>
                <li>{t.architecture.devopsNotePoints.point5}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

