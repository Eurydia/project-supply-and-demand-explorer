import { createFileRoute } from '@tanstack/react-router';
import { SupplyDemandExplorerPage } from '@/components/SupplyDemandExplorerPage';
import { useSupplyDemandExplorer } from '@/hooks/useSupplyDemandExplorer';

export const Route = createFileRoute('/')({ component: SupplyDemandExplorer });

function SupplyDemandExplorer() {
  const explorer = useSupplyDemandExplorer();
  return <SupplyDemandExplorerPage {...explorer} />;
}
