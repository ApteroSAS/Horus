import { useEffect, useState } from 'react';
import { DeviceInfoType } from '../../hooks/useDevices/useDevices';
import { SELECTED_AUDIO_OUTPUT_KEY } from '../../constants';

export default function useActiveSinkId(devicesInfo: DeviceInfoType) {
  const { audioOutputDevices } = devicesInfo;

  const [activeSinkId, setActiveSinkId] = useState(
    getAudioOutputId(audioOutputDevices) || '',
  );

  useEffect(() => {
    const updateOutputId = getAudioOutputId(audioOutputDevices);
    setActiveSinkId(updateOutputId || '');
  }, [audioOutputDevices]);

  return [activeSinkId, setActiveSinkId] as const;
}

function getAudioOutputId(audioOutputDevices: MediaDeviceInfo[]) {
  const localStorageDeviceId = window.localStorage.getItem(
    SELECTED_AUDIO_OUTPUT_KEY,
  );
  if (!audioOutputDevices || audioOutputDevices.length === 0) return null;
  if (
    audioOutputDevices.find((item) => item.deviceId === localStorageDeviceId)
  ) {
    return localStorageDeviceId;
  } else {
    return audioOutputDevices[0].deviceId;
  }
}
