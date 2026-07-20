import { createFileRoute } from '@tanstack/react-router';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useSupplyDemandExplorer } from '@/hooks/use-supply-demand-controller';
import { DataEntryCard } from '@/components/data-entry-card';
import { AnalysisCard } from '@/components/analysis-card';
import { ExplorerHeader } from '@/components/app-header';
import { useDatasetHistory } from '@/hooks/use-dataset-history';

export const Route = createFileRoute('/')({ component: RouteComponent });

function RouteComponent() {
  const stateHistory = useDatasetHistory();
  const controller = useSupplyDemandExplorer({
    data: stateHistory.data,
    onChange: stateHistory.update,
  });
  return (
    <Container maxWidth="xl" component={'main'}>
      <Stack spacing={{ xs: 2, md: 4 }} sx={{ padding: { xs: 1, md: 3 } }}>
        <ExplorerHeader />
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <DataEntryCard
              onUndo={stateHistory.undo}
              onRedo={stateHistory.redo}
              canRedo={stateHistory.canRedo}
              canUndo={stateHistory.canUndo}
              data={stateHistory.data}
              onChange={stateHistory.update}

              onClearData={controller.handleClearData}
              onRequestSampleData={controller.handleLoadSampleData}
              errors={controller.errors}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <AnalysisCard
              dataset={controller.sortedDataset}
              equilibrium={controller.equilibrium}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
