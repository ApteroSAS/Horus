import { useConnectionState } from 'agora-rtc-react';
import { useCallback, useEffect } from 'react';
import { SHARE_SCREEN_NAME_SUFFIX, USER_NAME_KEY } from '../../constants';
import { useAppState } from '../../contexts/AppStateContext';
import { useVideo } from '../../contexts/VideoContext';
import IntroContainer from '../IntroContainer/IntroContainer';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';

export const PreJoinScreens = () => {
  const {
    calling,
    setCalling,
    roomName,
    username,
    setUsername,
    disableAutoJoin,
    setDisableAutoJoin,
  } = useAppState();

  const { micPermission, devicesInfo } = useVideo();
  const { hasAudioInputDevices } = devicesInfo;

  const checkDeviceEmpty = useCallback(() => {
    if (!micPermission) {
      return true;
    }
    if (!hasAudioInputDevices) {
      return true;
    }
    return false;
  }, [hasAudioInputDevices, micPermission]);

  const handleSetUsername = (name: string) => {
    const userName = name.includes(SHARE_SCREEN_NAME_SUFFIX)
      ? name.replaceAll('_', '-')
      : name;
    setUsername(userName);
    localStorage.setItem(USER_NAME_KEY, userName);
  };

  const { error } = useVideo();
  const connectionState = useConnectionState();

  useEffect(() => {
    if (!disableAutoJoin && roomName && username && !checkDeviceEmpty()) {
      setCalling(true);
    }
  }, [
    username,
    hasAudioInputDevices,
    micPermission,
    disableAutoJoin,
    roomName,
    checkDeviceEmpty,
    setCalling,
  ]);

  useEffect(() => {
    if (checkDeviceEmpty()) {
      setCalling(false);
    }
  }, [checkDeviceEmpty, setCalling]);

  useEffect(() => {
    if ((connectionState === 'DISCONNECTED' && calling) || username === '') {
      setCalling(false);
      setDisableAutoJoin(true);
    }
  }, []);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={error} />
      <DeviceSelectionScreen
        name={username}
        roomName={roomName}
        setName={handleSetUsername}
        onJoin={() => setCalling(true)}
      />
    </IntroContainer>
  );
};

export default PreJoinScreens;
