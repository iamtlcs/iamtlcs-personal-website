import Portfolio from '@/components/Portfolio';
import { getDeploymentInfo } from '@/lib/deployment';

export default function Home() {
  return <Portfolio deploymentInfo={getDeploymentInfo()} year={new Date().getUTCFullYear()} />;
}
