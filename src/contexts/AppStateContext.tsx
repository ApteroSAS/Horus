import {
  AgoraRTCReactError,
  ConnectionState,
  useConnectionState,
  useIsConnected,
  useJoin,
} from 'agora-rtc-react';
import { createContext, useContext, useMemo, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getToken } from '../api';
import { SHARE_SCREEN_NAME_SUFFIX, USER_NAME_KEY } from '../constants';
import { useLocalStorageState } from '../hooks/useLocalStorageState/useLocalStorageState';

type ProviderValue = {
  disableAutoJoin: boolean | undefined;
  setDisableAutoJoin: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isConnected: boolean;
  isLoading: boolean;
  calling: boolean;
  setCalling: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  connectionState: ConnectionState;
  maxGalleryViewParticipants: number;
  setMaxGalleryViewParticipants: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  agoraError: AgoraRTCReactError | null;
  isGalleryViewActive: boolean;
  setIsGalleryViewActive: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  isGuest: boolean;
} | null;

interface ProviderProps {
  children: React.ReactNode;
}

enum UserRole {
  Guest = 'guest',
}

const AppStateContext = createContext<ProviderValue>(null);

export function useAppState() {
  const contextValue = useContext(AppStateContext);

  if (!contextValue) {
    throw new Error(
      'useAppState must be called from within an AppStateProvider',
    );
  }

  return contextValue;
}

export function AppStateProvider({ children }: ProviderProps) {
  const [calling, setCalling] = useState<boolean>(false);
  const [maxGalleryViewParticipants, setMaxGalleryViewParticipants] =
    useLocalStorageState('max-gallery-participants-key', 6);
  const [isGalleryViewActive, setIsGalleryViewActive] = useLocalStorageState(
    'gallery-view-active-key',
    true,
  );

  const [disableAutoJoin, setDisableAutoJoin] = useState<boolean | undefined>();

  const [searchParams] = useSearchParams();
  const { URLRoomName } = useParams<{ URLRoomName?: string }>();

  const [roomName] = useState<string>(
    searchParams.get('roomName') || URLRoomName || '',
  );
  const [username, setUsername] = useState<string>(getUserName() as string);

  function getUserName() {
    if (
      searchParams.get('userName') &&
      searchParams.get('userName')?.includes(SHARE_SCREEN_NAME_SUFFIX)
    ) {
      return searchParams.get('userName')?.replaceAll('_', '-');
    }
    return (
      searchParams.get('userName') || localStorage.getItem(USER_NAME_KEY) || ''
    );
  }

  const { isLoading, error: agoraError } = useJoin(async () => {
    const res = await getToken(username, roomName);
    return {
      appid: res.appId,
      channel: roomName,
      token: res?.token ? res.token : null,
      uid: username,
    };
  }, calling);

  // Check whether the user joins the app with guest role
  const isGuest = useLocation().pathname.split('/')[1] === UserRole.Guest;

  const isConnected = useIsConnected();
  const connectionState = useConnectionState();

  const value = useMemo(
    () => ({
      disableAutoJoin,
      setDisableAutoJoin,
      isLoading,
      isConnected,
      calling,
      setCalling,
      username,
      setUsername,
      roomName,
      connectionState,
      maxGalleryViewParticipants,
      setMaxGalleryViewParticipants,
      agoraError,
      isGalleryViewActive,
      setIsGalleryViewActive,
      isGuest,
    }),
    [
      disableAutoJoin,
      isLoading,
      isConnected,
      calling,
      username,
      roomName,
      connectionState,
      maxGalleryViewParticipants,
      setMaxGalleryViewParticipants,
      agoraError,
      isGalleryViewActive,
      setIsGalleryViewActive,
      isGuest,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
