import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useVideo } from '../../../contexts/VideoContext';
import { useTranslation } from 'react-i18next';

export default function AudioOutputList() {
  const { activeSinkId, setActiveSinkId, devicesInfo } = useVideo();
  const { audioOutputDevices } = devicesInfo;
  const { t } = useTranslation('common');

  const activeOutputLabel = audioOutputDevices.find(
    (device) => device.deviceId === activeSinkId,
  )?.label;

  return (
    <div className="inputSelect">
      {audioOutputDevices.length ? (
        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            {t('audio_output')}
          </Typography>
          <Select
            variant="outlined"
            sx={{ p: 0 }}
            value={activeSinkId}
            onChange={(e) => setActiveSinkId(e.target.value as string)}
          >
            {audioOutputDevices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle2">{t('audio_output')}</Typography>
          <Typography>
            {activeOutputLabel || t('system_default_audio_output')}
          </Typography>
        </>
      )}
    </div>
  );
}
