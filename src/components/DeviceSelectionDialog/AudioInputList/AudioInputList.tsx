import { FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import { IMicrophoneAudioTrack } from 'agora-rtc-react';
import { IMicrophoneAudioTrack as IMicrophoneAudioTrackSdk } from 'agora-rtc-sdk-ng';
import { useTranslation } from 'react-i18next';
import { SELECTED_AUDIO_INPUT_KEY } from '../../../constants';
import { useVideo } from '../../../contexts/VideoContext';
import AudioLevelIndicator from '../../AudioLevelIndicator/AudioLevelIndicator';

export default function AudioInputList({
  audioTrack,
}: {
  audioTrack:
    | IMicrophoneAudioTrack
    | IMicrophoneAudioTrackSdk
    | undefined
    | null;
}) {
  const {
    localMicrophoneTrack,
    audioInputDeviceId,
    setAudioInputDeviceId,
    devicesInfo,
  } = useVideo();
  const { audioInputDevices } = devicesInfo;
  const { t } = useTranslation('common');

  async function replaceTrack(newDeviceId: string) {
    setAudioInputDeviceId(newDeviceId);
    window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setDevice(newDeviceId);
    }
  }

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        {t('audio_input')}
      </Typography>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className="inputSelect">
          {audioInputDevices.length > 1 ? (
            <FormControl fullWidth>
              <Select
                variant="outlined"
                sx={{ p: 0 }}
                value={audioInputDeviceId || undefined}
                onChange={(e) => replaceTrack(e.target.value as string)}
              >
                {audioInputDevices.map((device) => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>
              {audioInputDevices[0]?.label || t('no_local_audio')}
            </Typography>
          )}
        </div>
        <AudioLevelIndicator
          audioTrack={audioTrack}
          color="black"
          isLocal
          key={audioInputDeviceId}
        />
      </Grid>
    </div>
  );
}
