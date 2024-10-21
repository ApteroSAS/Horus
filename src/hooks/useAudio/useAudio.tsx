import { useMemo } from 'react';
import {
  SELECTED_AUDIO_INPUT_KEY,
  SELECTED_AUDIO_OUTPUT_KEY,
} from '../../constants';
import useDevices from '../useDevices/useDevices';

export default function useAudio() {
  const { audioInputDevices, audioOutputDevices } = useDevices();
  const audioInputId = useMemo(() => {
    if (!audioInputDevices.length) return;
    const localStorageDeviceId = window.localStorage.getItem(
      SELECTED_AUDIO_INPUT_KEY,
    );
    if (
      audioInputDevices.find((item) => item.deviceId === localStorageDeviceId)
    ) {
      return localStorageDeviceId;
    } else {
      return audioInputDevices[0].deviceId;
    }
  }, [
    audioInputDevices,
    window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY),
  ]);

  const audioOutputId = useMemo(() => {
    if (!audioOutputDevices.length) return;
    const localStorageDeviceId = window.localStorage.getItem(
      SELECTED_AUDIO_OUTPUT_KEY,
    );
    if (
      audioOutputDevices.find((item) => item.deviceId === localStorageDeviceId)
    ) {
      return localStorageDeviceId;
    } else {
      return audioOutputDevices[0].deviceId;
    }
  }, [
    audioOutputDevices,
    window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY),
  ]);

  return { audioInputId, audioOutputId };
}
