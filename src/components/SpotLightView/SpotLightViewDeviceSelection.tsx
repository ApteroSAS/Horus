import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useAppState } from '../../contexts/AppStateContext';
import { useVideo } from '../../contexts/VideoContext';
import { useTranslation } from 'react-i18next';

interface DeviceSelectionScreenProps {
  name: string;
}

export default function SpotLightViewDeviceSelection({
  name,
}: DeviceSelectionScreenProps) {
  const { setMic, setCamera } = useVideo();
  const { isLoading, agoraError, setCalling, setUsername } = useAppState();
  const { t } = useTranslation('common');

  setMic(false);
  setCamera(false);
  setUsername(name);
  setCalling(true);

  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ height: '100%' }}
      >
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography
            variant="body2"
            style={{ fontWeight: 'bold', fontSize: '16px' }}
          >
            {t('joining_meeting')}
          </Typography>
        </div>
      </Grid>
    );
  }
  if (agoraError) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography>{agoraError.message}</Typography>
      </Box>
    );
  }
}
