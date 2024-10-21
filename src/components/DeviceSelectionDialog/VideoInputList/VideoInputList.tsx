import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import { useVideo } from '../../../contexts/VideoContext';
import useCamera from '../../../hooks/useCamera/useCamera';
import useLocalVideoTrack from '../../../hooks/useVideoTrack/useVideoTrack';
import theme from '../../../theme';

export default function VideoInputList() {
  const { videoRef, videoTrack } = useLocalVideoTrack();
  const { cameraOn, localCameraTrack, devicesInfo } = useVideo();
  const { switchCamera } = useCamera(devicesInfo);

  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY),
  );

  const { videoInputDevices } = devicesInfo;

  const { t } = useTranslation('common');

  function replaceTrack(newDeviceId: string) {
    setStoredLocalVideoDeviceId(newDeviceId);
    window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
    switchCamera(newDeviceId);
    if (localCameraTrack) {
      localCameraTrack.setDevice(newDeviceId);
    }
  }

  useEffect(() => {
    const cameraId = videoTrack?.getMediaStreamTrack().getSettings().deviceId;
    const localCameraId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);
    if (cameraId && !localCameraId) {
      setStoredLocalVideoDeviceId(cameraId);
    }
  }, [videoTrack]);

  return (
    <div className="inputSelect" style={{ width: '100%' }}>
      {cameraOn && (
        <Box
          ref={videoRef}
          sx={{
            maxWidth: '300px',
            // width: '300px',
            height: '200px',
            mx: 'auto',
            mb: '1.3em',
            backgroundColor: `${!videoTrack && '#000'}`,
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          }}
        />
      )}
      {videoInputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            {t('video_input')}
          </Typography>
          <Select
            value={storedLocalVideoDeviceId}
            variant="outlined"
            sx={{ p: 0 }}
            onChange={(e) => replaceTrack(e.target.value as string)}
          >
            {videoInputDevices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle2" gutterBottom>
            {t('video_input')}
          </Typography>
          <Typography>
            {videoInputDevices[0]?.label || t('no_local_video')}
          </Typography>
        </>
      )}
    </div>
  );
}
