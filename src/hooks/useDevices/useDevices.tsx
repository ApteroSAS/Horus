import { useState, useEffect } from 'react';
import {
  getCameras,
  getMicrophones,
  getPlaybackDevices,
} from 'agora-rtc-sdk-ng/esm';

export type DeviceInfoType = {
  audioInputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  hasAudioInputDevices: boolean;
  hasVideoInputDevices: boolean;
};

export default function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoType>({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
    hasAudioInputDevices: false,
    hasVideoInputDevices: false,
  });

  useEffect(() => {
    async function getAllDevices() {
      Promise.allSettled([getMicrophones(), getCameras(), getPlaybackDevices()])
        .then((results) => {
          const devices = results.map((item) =>
            item.status === 'fulfilled' ? item.value : [],
          );
          const [mics, cameras, speakers] = devices;
          const hasAudioInputDevices = mics.length > 0;
          const hasVideoInputDevices = cameras.length > 0;
          setDeviceInfo({
            ...deviceInfo,
            audioInputDevices: mics,
            videoInputDevices: cameras,
            audioOutputDevices: speakers,
            hasAudioInputDevices,
            hasVideoInputDevices,
          });
        })
        .catch((error) => {
          console.log({ error });
        });
    }
    getAllDevices();
    navigator.mediaDevices.addEventListener('devicechange', getAllDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getAllDevices);
    };
  }, []);

  return deviceInfo;
}
