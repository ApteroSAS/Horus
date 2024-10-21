import { Box, Theme, Typography, useTheme } from '@mui/material';
import { useVideo } from '../../../../contexts/VideoContext';
import useLocalVideoTrack from '../../../../hooks/useVideoTrack/useVideoTrack';
import AgoraHostIcon from '../../../../icons/AgoraHostIcon';
import useLocalAudioTrack from '../../../../hooks/useLocalAudioTrack/useLocalAudioTrack';
import LocalAudioLevelIndicator from '../../../AudioLevelIndicator/AudioLevelIndicator';

const style = (theme: Theme) => ({
  container: {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    paddingTop: `${(9 / 16) * 100}%`,
    background: 'black',
  },
  innerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  identityContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    maxWidth: '100%',
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '0.18em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      '& svg': {
        transform: 'scale(0.7)',
      },
    },
  },
});

export default function LocalVideoPreview({ identity }: { identity: string }) {
  const theme = useTheme();
  const styles = style(theme);
  const { cameraOn } = useVideo();
  const { videoRef } = useLocalVideoTrack();
  const { audioTrack } = useLocalAudioTrack();

  return (
    <Box sx={styles.container}>
      <Box sx={styles.innerContainer}>
        {cameraOn ? (
          <Box ref={videoRef} sx={{ width: '100%', height: '100%' }} />
        ) : (
          <Box sx={styles.avatarContainer}>
            <AgoraHostIcon />
          </Box>
        )}
      </Box>

      <Box sx={styles.identityContainer}>
        <Box sx={styles.identity}>
          <Box
            sx={{
              display: 'flex',
              flexShrink: '0',
            }}
          >
            <LocalAudioLevelIndicator
              color={theme.palette.primary.main}
              slashColor={theme.palette.primary.main}
              audioTrack={audioTrack}
              isLocal
            />
          </Box>
          <Typography
            variant="body1"
            color="inherit"
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {identity}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
