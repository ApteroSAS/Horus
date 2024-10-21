import { useEffect, useState } from 'react';
import { SELECTED_AUDIO_INPUT_KEY } from '../../constants';
import { DeviceInfoType } from '../useDevices/useDevices';

export function useAudioDeviceId(devicesInfo: DeviceInfoType) {
  const { audioInputDevices } = devicesInfo;

  const [audioInputDeviceId, setAudioInputDeviceId] = useState(
    getAudioInputId(audioInputDevices),
  );

  useEffect(() => {
    const updateInputId = getAudioInputId(audioInputDevices);
    setAudioInputDeviceId(updateInputId);
  }, [audioInputDevices]);

  return { audioInputDeviceId, setAudioInputDeviceId };
}

function getAudioInputId(audioInputDevices: MediaDeviceInfo[]) {
  const localStorageDeviceId = window.localStorage.getItem(
    SELECTED_AUDIO_INPUT_KEY,
  );
  if (!audioInputDevices || audioInputDevices.length === 0) return null;
  if (
    audioInputDevices.find((item) => item.deviceId === localStorageDeviceId)
  ) {
    return localStorageDeviceId;
  } else {
    return audioInputDevices[0].deviceId;
  }
}
