import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

function useIsMobile() {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= theme.breakpoints.values.sm,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= theme.breakpoints.values.sm);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
