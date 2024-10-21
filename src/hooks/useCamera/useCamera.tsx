import { useMemo, useState } from 'react';
import { SELECTED_VIDEO_INPUT_KEY } from '../../constants';
import { DeviceInfoType } from '../useDevices/useDevices';

export default function useCamera(devicesInfo: DeviceInfoType) {
  const { videoInputDevices } = devicesInfo;
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | undefined
  >();

  const localStorageDeviceId = window.localStorage.getItem(
    SELECTED_VIDEO_INPUT_KEY,
  );

  const cameraId = useMemo(() => {
    if (!videoInputDevices.length) return;
    if (selectedDeviceId) {
      return selectedDeviceId;
    }
    if (
      videoInputDevices.find((item) => item.deviceId === localStorageDeviceId)
    ) {
      return localStorageDeviceId;
    } else {
      return videoInputDevices[0].deviceId;
    }
  }, [
    videoInputDevices,
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY),
  ]);

  function switchCamera(deviceId: string) {
    setSelectedDeviceId(deviceId);
  }

  return { videoInputDevices, cameraId, setSelectedDeviceId, switchCamera };
}
