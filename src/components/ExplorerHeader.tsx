import { Box, Stack, Typography } from '@mui/material';

export function ExplorerHeader() {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        position: 'relative',
        display: 'grid',
        boxSizing: 'border-box',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'center',
        width: '100%',
        minHeight: 150,
        px: '42px',
        pt: '28px',
        pb: '26px',
        pl: '50px',
        overflow: 'hidden',
        color: theme.palette.text.primary,
        bgcolor: `${theme.palette.background.paper} !important`,
        backgroundImage:
          'linear-gradient(90deg, transparent 46px, rgba(165, 101, 78, 0.42) 47px, transparent 48px), linear-gradient(rgba(119, 117, 104, 0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(119, 117, 104, 0.16) 1px, transparent 1px)',
        backgroundSize: 'auto, 24px 24px, 24px 24px',
        border: `2px solid ${theme.palette.text.primary}`,
        boxShadow: '6px 6px rgba(47, 53, 46, 0.22)',
        '&::before': {
          content: '"S / D"',
          position: 'absolute',
          zIndex: 2,
          top: 19,
          left: 0,
          display: 'grid',
          width: 31,
          height: 82,
          placeItems: 'center',
          color: '#f8f2e7',
          bgcolor: theme.palette.primary.main,
          borderRight: `2px solid ${theme.palette.text.primary}`,
          fontFamily: '"Mali", sans-serif',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          writingMode: 'vertical-rl',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          zIndex: 1,
          top: 0,
          right: 0,
          width: 42,
          height: 42,
          background: `linear-gradient(225deg, ${theme.palette.background.default} 0 48%, #756f63 49% 51%, #e9dfce 52% 100%)`,
        },
        '@media (max-width: 620px)': {
          gridTemplateColumns: '1fr',
          gap: '18px',
          p: '24px 22px 22px 48px',
        },
      })}
    >
      <Stack spacing={0.5} sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            width: 'max-content',
            px: '10px',
            py: '3px',
            color: '#413721',
            bgcolor: '#d8bd80',
            borderBottom: '2px solid #8f713e',
            fontSize: '0.78rem !important',
            fontWeight: '800 !important',
            letterSpacing: '0.08em !important',
            transform: 'rotate(-1deg)',
          }}
        >
          SUPPLY / DEMAND
        </Typography>
        <Typography
          component="h1"
          variant="h2"
          sx={{
            mt: '5px',
            color: '#303a31',
            fontSize: 'clamp(2rem, 5vw, 3.55rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            '@media (max-width: 620px)': { fontSize: '2.05rem' },
          }}
        >
          สำรวจอุปสงค์–อุปทาน
        </Typography>
        <Typography
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontSize: '1rem !important',
          })}
        >
          ป้อนข้อมูลเพื่อเปรียบเทียบความสัมพันธ์ของราคาและปริมาณ
        </Typography>
      </Stack>
      <Box
        sx={(theme) => ({
          position: 'relative',
          gap: '2px',
          paddingX: 3,
          paddingY: 1,
          backgroundColor: theme.palette.background.paper,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: theme.palette.primary.dark,
          transform: 'rotate(4deg)',
        })}
      >
        <Stack spacing={0.5}>
          <Typography component="span" color="textSecondary">
            {`ราคา ↑`}
          </Typography>
          <Typography component="strong" color="textPrimary">
            {`Qₛ ↑ · Qd ↓`}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
