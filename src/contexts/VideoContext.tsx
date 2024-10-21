import { IAIDenoiserProcessor } from 'agora-extension-ai-denoiser';
import {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
} from 'agora-rtc-react';
import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PermissionsDenied } from '../enum';
import useActiveSinkId from '../hooks/useActiveSinkId/useActiveSinkId';
import useAINoiseCancellation from '../hooks/useAINoiseCancellation/useAINoiseCancellation';
import useBackgroundSettings, {
  BackgroundSettings,
} from '../hooks/useBackgroundSettings/useBackgroundSettings';
import useCamera from '../hooks/useCamera/useCamera';
import { SelectedParticipantProvider } from '../hooks/useSelectedParticipant/useSelectedParticipant';
import { useAppState } from './AppStateContext';
import { NOISE_CANCELLATION_KEY } from '../constants';
import { useLocalStorageState } from '../hooks/useLocalStorageState/useLocalStorageState';
import { useAudioDeviceId } from '../hooks/useAudioDeviceId/useAudioDeviceId';
import useDevices, { DeviceInfoType } from '../hooks/useDevices/useDevices';

type ProviderValue = {
  toggleAINoise: () => void;
  processor: MutableRefObject<IAIDenoiserProcessor | undefined>;
  isAINoiseEnabled: boolean;
  setIsAINoiseEnabled: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  micOn: boolean;
  cameraOn: boolean;
  setMic: React.Dispatch<React.SetStateAction<boolean>>;
  setCamera: React.Dispatch<React.SetStateAction<boolean>>;
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  localCameraTrack: ICameraVideoTrack | null;
  micPermission: boolean;
  cameraPermission: boolean;
  isBackgroundSelectionOpen: boolean;
  setIsBackgroundSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSupported: boolean;
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
  error: Error | undefined;
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
  audioInputDeviceId: string | null;
  setAudioInputDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  devicesInfo: DeviceInfoType;
} | null;

interface ProviderProps {
  children: React.ReactNode;
}

const VideoContext = createContext<ProviderValue>(null);

export function useVideo() {
  const contextValue = useContext(VideoContext);

  if (!contextValue) {
    throw new Error(
      'useVideoState must be called from within an VideoStateProvider',
    );
  }

  return contextValue;
}

export function VideoProvider({ children }: ProviderProps) {
  const [micPermission, setMicPermission] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);

  const [micOn, setMic] = useState<boolean>(true);
  const [cameraOn, setCamera] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  const client = useRTCClient();
  const devicesInfo = useDevices();

  const [activeSinkId, setActiveSinkId] = useActiveSinkId(devicesInfo);
  const [isBackgroundSelectionOpen, setIsBackgroundSelectionOpen] =
    useState<boolean>(false);

  const { cameraId } = useCamera(devicesInfo);

  const { audioInputDeviceId, setAudioInputDeviceId } =
    useAudioDeviceId(devicesInfo);

  const { isGuest, connectionState } = useAppState();

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(
    micOn,
    audioInputDeviceId
      ? {
          microphoneId: audioInputDeviceId,
          AEC: true,
          ANS: true,
        }
      : {},
  );

  const { localCameraTrack } = useLocalCameraTrack(
    cameraOn,
    cameraId
      ? {
          cameraId: cameraId,
        }
      : {},
  );

  const [isSupported, backgroundSettings, setBackgroundSettings] =
    useBackgroundSettings(localCameraTrack);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const [isAINoiseEnabled, setIsAINoiseEnabled] = useLocalStorageState(
    NOISE_CANCELLATION_KEY,
    false,
  );

  const { processor } = useAINoiseCancellation(
    localMicrophoneTrack,
    isAINoiseEnabled,
    setIsAINoiseEnabled,
  );

  const toggleAINoise = useCallback(() => {
    setIsAINoiseEnabled((prev) => !prev);
    localStorage.setItem(
      NOISE_CANCELLATION_KEY,
      !isAINoiseEnabled ? 'true' : 'false',
    );
  }, [isAINoiseEnabled, setIsAINoiseEnabled]);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request camera and microphone permissions
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraPermission(true);
        // Stop the camera stream to release the camera
        cameraStream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.log(error);
      }

      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicPermission(true);
        // Stop the microphone stream to release the microphone
        micStream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (processor.current && localMicrophoneTrack) {
      setIsAINoiseEnabled(processor.current.enabled);
    }
  }, [processor, localMicrophoneTrack, setIsAINoiseEnabled]);

  useEffect(() => {
    if (error && error.message === PermissionsDenied.CAM) {
      setCamera(false);
      setCameraPermission(false);
    }
    if (error && error.message === PermissionsDenied.MIC) {
      setMic(false);
      setMicPermission(false);
    }
  }, [error]);

  useEffect(() => {
    if (connectionState === 'RECONNECTING') {
      if (localCameraTrack) {
        client.unpublish(localCameraTrack).then(() => {
          localCameraTrack.close();
        });
      }
      if (localMicrophoneTrack) {
        client.unpublish(localMicrophoneTrack).then(() => {
          localMicrophoneTrack.close();
        });
      }
    }
  }, [connectionState, localCameraTrack, localMicrophoneTrack, client]);

  useEffect(() => {
    if (isGuest) {
      setMic(false);
      setCamera(false);
    }
  }, [isGuest]);

  const value = useMemo(
    () => ({
      toggleAINoise,
      processor,
      isAINoiseEnabled,
      setIsAINoiseEnabled,
      activeSinkId,
      setActiveSinkId,
      micOn,
      cameraOn,
      setMic,
      setCamera,
      localMicrophoneTrack,
      localCameraTrack,
      micPermission,
      cameraPermission,
      isBackgroundSelectionOpen,
      setIsBackgroundSelectionOpen,
      isSupported,
      backgroundSettings,
      setBackgroundSettings,
      error,
      setError,
      audioInputDeviceId,
      setAudioInputDeviceId,
      devicesInfo,
    }),
    [
      toggleAINoise,
      processor,
      isAINoiseEnabled,
      setIsAINoiseEnabled,
      activeSinkId,
      setActiveSinkId,
      micOn,
      cameraOn,
      setMic,
      setCamera,
      localMicrophoneTrack,
      localCameraTrack,
      micPermission,
      cameraPermission,
      isBackgroundSelectionOpen,
      setIsBackgroundSelectionOpen,
      isSupported,
      backgroundSettings,
      setBackgroundSettings,
      error,
      setError,
      audioInputDeviceId,
      setAudioInputDeviceId,
      devicesInfo,
    ],
  );

  return (
    <VideoContext.Provider value={value}>
      <SelectedParticipantProvider>{children}</SelectedParticipantProvider>
    </VideoContext.Provider>
  );
}
