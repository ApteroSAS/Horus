import { Box, CircularProgress } from '@mui/material';
import React, { Suspense } from 'react';

export default function SuspenseLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}
