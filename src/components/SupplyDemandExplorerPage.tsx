import { Box, Container } from '@mui/material';
import type { SupplyDemandExplorerController } from '@/hooks/useSupplyDemandExplorer';
import { AnalysisCard } from './AnalysisCard';
import { DataEntryCard } from './DataEntryCard';
import { ExplorerHeader } from './ExplorerHeader';

export function SupplyDemandExplorerPage(
  controller: SupplyDemandExplorerController,
) {
  return (
    <Box component="main" className="notebook-page">
      <Container maxWidth="xl" className="page-shell">
        <ExplorerHeader />
        <Box className="workspace-grid">
          <DataEntryCard {...controller} />
          <AnalysisCard {...controller} />
        </Box>
        <Box component="footer" className="page-footer">
          <span>Supply &amp; Demand Explorer</span>
          <span>ทดลอง · สังเกต · สรุป</span>
        </Box>
      </Container>
    </Box>
  );
}
