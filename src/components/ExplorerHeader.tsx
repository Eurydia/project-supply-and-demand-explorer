import { Box, Stack, Typography } from '@mui/material';

export function ExplorerHeader() {
  return (
    <Box component="header" className="hero-note">
      <Box className="binder-holes" aria-hidden="true">
        <span />
        <span />
        <span />
      </Box>
      <Stack className="hero-copy" spacing={0.5}>
        <Typography className="lesson-tag">เศรษฐศาสตร์ • บทที่ 3</Typography>
        <Typography component="h1" variant="h2">
          สมุดทดลอง อุปสงค์–อุปทาน
        </Typography>
        <Typography className="hero-subtitle">
          ใส่ตัวเลขในตาราง แล้วดูเส้นกราฟขยับตามทันที
        </Typography>
      </Stack>
      <Box className="hero-formula" aria-label="สูตรเตือนความจำ">
        <span>ราคา ↑</span>
        <strong>Qₛ ↑ · Qd ↓</strong>
      </Box>
    </Box>
  );
}
