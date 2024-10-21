import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IMicrophoneAudioTrack } from 'agora-rtc-react';
import { IMicrophoneAudioTrack as IMicrophoneAudioTrackSdk } from 'agora-rtc-sdk-ng';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts/AppStateContext';
import { useVideo } from '../../contexts/VideoContext';
import InfoIconOutlined from '../../icons/InfoIconOutlined';
import SmallCheckIcon from '../../icons/SmallCheckIcon';
import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import MaxGalleryViewParticipants from './MaxGalleryViewParticipants/MaxGalleryViewParticipants';
import VideoInputList from './VideoInputList/VideoInputList';

const style = (theme: Theme) => ({
  container: {
    width: '100%',
    // width: '600px',
    // minHeight: '400px',
    // [theme.breakpoints.down('sm')]: {
    //   width: 'calc(100vw - 16px)',
    // },
    '& .inputSelect': {
      width: 'calc(100% - 35px)',
    },
  },
  button: {
    float: 'right',
    color: '#fff',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
    },
  },
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0.8em',
    '&:first-of-type': {
      margin: '1em 0 2em 0',
    },
  },
  noiseCancellationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '24px',
    '& svg': {
      '&:not(:last-child)': {
        margin: '0 0.3em',
      },
    },
  },
  infoText: {
    margin: '0 0 1.5em 0em',
  },
});

export default function DeviceSelectionDialog({
  open,
  onClose,
  audioTrack,
}: {
  open: boolean;
  onClose: () => void;
  audioTrack:
    | IMicrophoneAudioTrack
    | IMicrophoneAudioTrackSdk
    | undefined
    | null;
}) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation('common');

  const { isGuest } = useAppState();
  const { isAINoiseEnabled, toggleAINoise } = useVideo();

  const styles = style(theme);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ paper: styles.paper }}
      fullWidth={true}
    >
      <DialogTitle>{t('audio_and_video_settings')}</DialogTitle>
      <Divider />
      <DialogContent sx={styles.container}>
        {!isGuest && (
          <>
            <Box sx={styles.listSection}>
              <Typography variant="h6" sx={styles.headline}>
                {t('video')}
              </Typography>
              <VideoInputList />
            </Box>
            <Divider />
            <Box sx={styles.listSection}>
              <Typography variant="h6" sx={styles.headline}>
                {t('audio')}
              </Typography>
              <Fragment>
                <Box sx={styles.noiseCancellationContainer}>
                  <Box sx={styles.description}>
                    <Typography variant="subtitle2">
                      {t('noise_cancellation_powered_by_agora')}
                    </Typography>
                    <Tooltip
                      title={t('suppress_background_noise')}
                      leaveDelay={250}
                      leaveTouchDelay={15000}
                      enterTouchDelay={0}
                    >
                      <div>
                        <InfoIconOutlined />
                      </div>
                    </Tooltip>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isAINoiseEnabled}
                        checkedIcon={<SmallCheckIcon />}
                        disableRipple={true}
                        onClick={toggleAINoise}
                      />
                    }
                    label={isAINoiseEnabled ? t('enabled') : t('disabled')}
                    style={{ marginRight: 0 }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={styles.infoText}
                >
                  {t('suppress_background_noise')}
                </Typography>
              </Fragment>
              <AudioInputList audioTrack={audioTrack} />
            </Box>
          </>
        )}
        <Box sx={styles.listSection}>
          <AudioOutputList />
        </Box>
        {!isSmDown && (
          <Box>
            <Divider />
            <Box sx={styles.listSection}>
              <Typography variant="h6" sx={styles.headline}>
                {t('gallery_view')}
              </Typography>
              <MaxGalleryViewParticipants />
            </Box>
          </Box>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          sx={styles.button}
          onClick={onClose}
        >
          {t('done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
