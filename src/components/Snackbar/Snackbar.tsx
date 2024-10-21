import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '../../icons/ErrorIcon';
import {
  IconButton,
  Snackbar as MUISnackbar,
  Typography,
  Box,
  Theme,
  useTheme,
} from '@mui/material';
import WarningIcon from '../../icons/WarningIcon';
import InfoIcon from '../../icons/InfoIcon';

const styleCustoms = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    minHeight: '50px',
    backgroundColor: 'white',
    padding: '1em',
    borderRadius: '3px',
    boxShadow: '0 12px 24px 4px rgba(40,42,43,0.2)',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  contentContainer: {
    display: 'flex',
    lineHeight: 1.8,
  },
  iconContainer: {
    display: 'flex',
    padding: '0 1.3em 0 0.3em',
    transform: 'translateY(3px)',
  },
  headline: {
    fontWeight: 'bold',
  },
  error: {
    borderLeft: '4px solid #D61F1F',
  },
  warning: {
    borderLeft: '4px solid #E46216',
  },
  info: {
    borderLeft: '4px solid #0263e0',
  },
});

interface SnackbarProps {
  headline: string;
  message: string | React.ReactNode;
  variant?: 'error' | 'warning' | 'info';
  open: boolean;
  handleClose?: () => void;
}

export default function Snackbar({
  headline,
  message,
  variant,
  open,
  handleClose,
}: SnackbarProps) {
  const theme = useTheme();
  const styles = styleCustoms(theme);
  const handleOnClose = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleOnClose}
      autoHideDuration={10000}
    >
      <Box
        sx={{
          ...styles.container,
          borderLeft:
            variant === 'error'
              ? styles.error.borderLeft
              : variant === 'warning'
                ? styles.warning.borderLeft
                : variant === 'info'
                  ? styles.info.borderLeft
                  : '',
        }}
      >
        <Box sx={styles.contentContainer}>
          <Box sx={styles.iconContainer}>
            {variant === 'warning' && <WarningIcon />}
            {variant === 'error' && <ErrorIcon />}
            {variant === 'info' && <InfoIcon />}
          </Box>
          <Box>
            <Typography variant="body1" sx={styles.headline} component="span">
              {headline}
            </Typography>
            <Typography variant="body1" component="span">
              {' '}
              {message}
            </Typography>
          </Box>
        </Box>
        <Box>
          {handleClose && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </MUISnackbar>
  );
}
