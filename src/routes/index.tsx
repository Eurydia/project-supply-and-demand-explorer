import { createFileRoute } from '@tanstack/react-router';
import { useSupplyDemandExplorer } from '@/hooks/useSupplyDemandExplorer';
import Container from '@mui/material/Container';
import { DataEntryCard } from '@/components/DataEntryCard';
import { AnalysisCard } from '@/components/AnalysisCard';
import { ExplorerHeader } from '@/components/ExplorerHeader';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

export const Route = createFileRoute('/')({ component: RouteComponent });

function RouteComponent() {
  const controller = useSupplyDemandExplorer();
  return (
    <Container maxWidth="xl" component={'main'}>
      <Stack spacing={4} sx={{ padding: 3 }}>
        <ExplorerHeader />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <DataEntryCard {...controller} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <AnalysisCard {...controller} />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
