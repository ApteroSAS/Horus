import { Box, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ApteroLogo from '../../icons/ApteroLogo';
import VideoLogo from './VideoLogo';

interface IntroContainerProps {
  children: React.ReactNode;
}

const style = (theme: Theme) => ({
  background: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d2947',
    height: '100%',
  },
  logo: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    width: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    width: '888px',
    borderRadius: '8px',
    // boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    boxShadow: '#00122f 3px 3px 8px -1px',
    [theme.breakpoints.up('md')]: {
      minHeight: '350px',
    },
    [theme.breakpoints.down('md')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
    },
  },
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fc',
    backgroundSize: 'cover',
    width: '296px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  logoVideo: {
    filter: 'drop-shadow(2px 2px 4px #6aa7e480)',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '2em 4em',
    flex: 1,
    [theme.breakpoints.down('md')]: {
      padding: '2em',
    },
  },
  title: {
    color: theme.palette.primary.main,
    margin: '1em 0 0',
    [theme.breakpoints.down('md')]: {
      margin: 0,
      fontSize: '1.1rem',
    },
  },
});

const IntroContainer = (props: IntroContainerProps) => {
  const theme = useTheme();
  const styles = style(theme);
  const { t } = useTranslation('common');

  return (
    <Box sx={styles.background}>
      <Box sx={styles.container}>
        <Box sx={styles.innerContainer}>
          <Box sx={styles.swooshContainer}>
            <Box sx={styles.logoContainer}>
              <Box sx={styles.logoVideo}>
                <VideoLogo />
              </Box>
              <Typography variant="h6" sx={styles.title}>
                {t('dialog_room')}
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.content}>{props.children}</Box>
        </Box>
      </Box>
      <Box sx={styles.logo}>
        <ApteroLogo />
      </Box>
    </Box>
  );
};

export default IntroContainer;
