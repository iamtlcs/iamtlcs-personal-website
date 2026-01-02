'use client';

// ============================================================================
// IMPORTS
// ============================================================================

import { motion } from 'framer-motion';
import { Layers, Network } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MermaidDiagram, { sampleArchitectures } from './MermaidDiagram';

// ============================================================================
// COMPONENT
// ============================================================================

export default function ArchitectureShowcase() {
  const { t } = useLanguage();

  // Architecture diagrams configuration
  const architectureDiagrams = [
    {
      chart: sampleArchitectures.fullStack,
      title: t.architecture.fullStackTitle,
      description: t.architecture.fullStackDescription,
      scale: 2.0,        // Zoom level for this diagram
      minHeight: 900,    // Base container height (will be multiplied by scale)
      maxWidth: '100%',
      fontSize: '16px',
      nodeSpacing: 60,
      rankSpacing: 90,
    },
    {
      chart: sampleArchitectures.cicd,
      title: t.architecture.cicdTitle,
      description: t.architecture.cicdDescription,
      scale: 3.5,
      minHeight: 200,    // Base container height (will be multiplied by scale)
      maxWidth: '100%',
      fontSize: '15px',
      nodeSpacing: 40,
      rankSpacing: 70,
    },
    {
      chart: sampleArchitectures.microservices,
      title: t.architecture.microservicesTitle,
      description: t.architecture.microservicesDescription,
      scale: 2.0,        // Zoom level for this diagram
      minHeight: 600,    // Base container height (will be multiplied by scale)
      maxWidth: '100%',
      fontSize: '15px',
      nodeSpacing: 50,
      rankSpacing: 80,
    },
    {
      chart: sampleArchitectures.ecsBlueGreen,
      title: t.architecture.ecsBlueGreenTitle,
      description: t.architecture.ecsBlueGreenDescription,
      scale: 2.0,        // Zoom level for this diagram
      minHeight: 600,    // Base container height (will be multiplied by scale)
      maxWidth: '100%',
      fontSize: '15px',
      nodeSpacing: 55,
      rankSpacing: 85,
    },
    {
      chart: sampleArchitectures.multiRegionEKS,
      title: t.architecture.multiRegionEKSTitle,
      description: t.architecture.multiRegionEKSDescription,
      scale: 3.0,        // Zoom level for this diagram
      minHeight: 1000,    // Base container height (will be multiplied by scale)
      maxWidth: '100%',
      fontSize: '14px',
      nodeSpacing: 45,
      rankSpacing: 75,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 rounded-2xl shadow-2xl mb-8 border border-slate-300 dark:border-slate-700">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <HeaderSection title={t.architecture.title} subtitle={t.architecture.subtitle} />

        {/* Architecture Diagrams */}
        <div className="space-y-12">
          {architectureDiagrams.map((diagram, index) => (
            <div key={index} className="mb-8">
              <MermaidDiagram
                chart={diagram.chart}
                title={diagram.title}
                description={diagram.description}
                scale={diagram.scale}
                minHeight={diagram.minHeight}
                maxWidth={diagram.maxWidth}
                fontSize={diagram.fontSize}
                nodeSpacing={diagram.nodeSpacing}
                rankSpacing={diagram.rankSpacing}
              />
            </div>
          ))}
        </div>

        {/* DevOps Note Section */}
        <DevOpsNoteSection
          title={t.architecture.devopsNoteTitle}
          description={t.architecture.devopsNoteDescription}
          points={t.architecture.devopsNotePoints}
        />
      </div>
    </section>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function HeaderSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      className="flex flex-col items-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Layers className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl">
        {subtitle}
      </p>
    </motion.div>
  );
}

function DevOpsNoteSection({
  title,
  description,
  points,
}: {
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <motion.div
      className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <Network className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{description}</p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
