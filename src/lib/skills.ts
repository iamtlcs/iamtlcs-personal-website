import type React from 'react';
import type { Translations } from '@/contexts/LanguageContext';
import { Server, Cloud, Database, GitBranch, Activity, Code, Brain, Lock } from 'lucide-react';

export interface SkillWithIcon {
  name: string;
  icon: string; // Can be image path or Font Awesome icon class
  faIcon?: string; // Optional Font Awesome icon class as fallback
}

export interface Sector {
  id: string;
  name: string;
  position: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  skills: SkillWithIcon[];
  description: string;
}

export function getSectors(t: Translations): Sector[] {
  return [
    {
      id: 'programming',
      name: t.skills.sectors.programming.name,
      position: 0.08,
      icon: Code,
      color: '#3b82f6',
      skills: [
        { name: 'Python', icon: '/skills/programming/Python.png' },
        { name: 'JavaScript', icon: '/skills/programming/JavaScript.png' },
        { name: 'TypeScript', icon: '/skills/programming/TypeScript.png' },
        { name: 'Go', icon: '/skills/programming/GoLang.png' },
      ],
      description: t.skills.sectors.programming.description
    },
    {
      id: 'web',
      name: t.skills.sectors.web.name,
      position: 0.20,
      icon: Server,
      color: '#10b981',
      skills: [
        { name: 'React.js', icon: 'fab:react', faIcon: 'fab fa-react' },
        { name: 'Next.js', icon: '/skills/web/NextJs.png', faIcon: 'fas fa-arrow-right' },
        { name: 'Express.js', icon: 'fas:server', faIcon: 'fas fa-server' },
        { name: 'Tailwind CSS', icon: '/skills/web/TailwindCSS.png', faIcon: 'fas fa-wind' },
      ],
      description: t.skills.sectors.web.description
    },
    {
      id: 'cloud',
      name: t.skills.sectors.cloud.name,
      position: 0.32,
      icon: Cloud,
      color: '#f59e0b',
      skills: [
        { name: 'AWS', icon: '/skills/cloud/AWS.png', faIcon: 'fab fa-aws' },
        { name: 'Azure', icon: '/skills/cloud/Azure.png', faIcon: 'fas fa-cloud' },
        { name: 'GCP', icon: '/skills/cloud/GCP.png', faIcon: 'fas fa-cloud-meatball' },
        { name: 'Alibaba Cloud', icon: '/skills/cloud/AlibabaCloud.png', faIcon: 'fas fa-cloud-upload-alt' },
        { name: 'Vercel', icon: '/skills/cloud/Vercel.png', faIcon: 'fas fa-bolt' },
        { name: 'Netlify', icon: '/skills/cloud/Netlify.png', faIcon: 'fas fa-globe' },
      ],
      description: t.skills.sectors.cloud.description
    },
    {
      id: 'devops',
      name: t.skills.sectors.devops.name,
      position: 0.44,
      icon: GitBranch,
      color: '#8b5cf6',
      skills: [
        { name: 'Kubernetes', icon: '/skills/devops/Kubernetes.png', faIcon: 'fas fa-dharmachakra' },
        { name: 'Docker', icon: '/skills/devops/Docker.png', faIcon: 'fab fa-docker' },
        { name: 'Terraform', icon: '/skills/devops/Terraform.png', faIcon: 'fas fa-server' },
        { name: 'Ansible', icon: '/skills/devops/Ansible.png', faIcon: 'fas fa-robot' },
        { name: 'GitHub Actions', icon: '/skills/devops/GitHubActions.png', faIcon: 'fab fa-github-alt' },
        { name: 'Argo CD', icon: '/skills/devops/ArgoCD.png', faIcon: 'fas fa-ship' },
      ],
      description: t.skills.sectors.devops.description
    },
    {
      id: 'monitoring',
      name: t.skills.sectors.monitoring.name,
      position: 0.56,
      icon: Activity,
      color: '#ec4899',
      skills: [
        { name: 'Prometheus', icon: '/skills/monitoring/Prometheus.png', faIcon: 'fas fa-chart-line' },
        { name: 'Grafana', icon: '/skills/monitoring/Grafana.png', faIcon: 'fas fa-chart-bar' },
        { name: 'Loki', icon: '/skills/monitoring/Loki.png', faIcon: 'fas fa-database' },
        { name: 'Mimir', icon: '/skills/monitoring/Mimir.png', faIcon: 'fas fa-database' },
        { name: 'OTel', icon: '/skills/monitoring/OTel.png', faIcon: 'fas fa-project-diagram' },
        { name: 'Fluent Bit', icon: '/skills/monitoring/FluentBit.png', faIcon: 'fas fa-stream' },
      ],
      description: t.skills.sectors.monitoring.description
    },
    {
      id: 'database',
      name: t.skills.sectors.database.name,
      position: 0.68,
      icon: Database,
      color: '#10b981',
      skills: [
        { name: 'PostgreSQL', icon: '/skills/databases/Postgresql.png' },
        { name: 'MongoDB', icon: '/skills/databases/MongoDB.png' },
      ],
      description: t.skills.sectors.database.description
    },
    {
      id: 'ai',
      name: t.skills.sectors.ai.name,
      position: 0.80,
      icon: Brain,
      color: '#a855f7',
      skills: [
        { name: 'LLM APIs', icon: 'fas:robot', faIcon: 'fas fa-robot' },
        { name: 'Hugging Face', icon: '/skills/ai/HuggingFace.png', faIcon: 'fas fa-hands-helping' },
        { name: 'PyTorch', icon: '/skills/data/PyTorch.png', faIcon: 'fab fa-python' },
        { name: 'TensorFlow', icon: '/skills/data/TensorFlow.png', faIcon: 'fas fa-brain' },
        { name: 'Pandas', icon: '/skills/data/Pandas.png', faIcon: 'fas fa-table' },
        { name: 'NumPy', icon: '/skills/data/NumPy.png', faIcon: 'fas fa-calculator' },
        { name: 'Scikit-Learn', icon: '/skills/data/ScikitLearn.png', faIcon: 'fas fa-cogs' },
        { name: 'Matplotlib', icon: '/skills/data/Matplotlib.png', faIcon: 'fas fa-chart-bar' },
        { name: 'Seaborn', icon: '/skills/data/Seaborn.png', faIcon: 'fas fa-palette' },
        { name: 'Plotly', icon: '/skills/data/Plotly.png', faIcon: 'fas fa-chart-line' },
      ],
      description: t.skills.sectors.ai.description
    },
    {
      id: 'security',
      name: t.skills.sectors.security.name,
      position: 0.92,
      icon: Lock,
      color: '#ef4444',
      skills: [
        { name: 'Penetration Testing', icon: 'fas:user-secret', faIcon: 'fas fa-user-secret' },
        { name: 'SIEM', icon: 'fas:shield-alt', faIcon: 'fas fa-shield-alt' },
        { name: 'Incident Response', icon: 'fas:exclamation-triangle', faIcon: 'fas fa-exclamation-triangle' },
        { name: 'Digital Forensics', icon: 'fas:search', faIcon: 'fas fa-search' },
      ],
      description: t.skills.sectors.security.description
    },
  ];
}

