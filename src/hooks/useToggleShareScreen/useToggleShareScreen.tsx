import {
  useCurrentUID,
  useLocalScreenTrack,
  useRTCScreenShareClient,
  useTrackEvent,
} from 'agora-rtc-react';
import { useCallback, useEffect, useState } from 'react';
import { getToken } from '../../api';
import { useAppState } from '../../contexts/AppStateContext';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

export default function useScreenShareToggle() {
  const [isSharing, setIsSharing] = useState(false);
  const { screenTrack, error } = useLocalScreenTrack(isSharing, {}, 'disable');
  const sharedClient = useRTCScreenShareClient();
  const { roomName, connectionState } = useAppState();

  const uid = useCurrentUID();
  const uidScreen = `${uid}${SHARE_SCREEN_NAME_SUFFIX}`;

  const shareScreen = useCallback(async () => {
    if (!sharedClient || !screenTrack) return;
    try {
      const { token, appId } = await getToken(uidScreen, roomName);
      await sharedClient.join(appId, roomName, token, uidScreen);
      await sharedClient.publish(screenTrack);
    } catch (error) {
      console.error('Error sharing screen:', error);
      setIsSharing(false);
    }
  }, [roomName, screenTrack, sharedClient, uidScreen]);

  useTrackEvent(screenTrack, 'track-ended', () => {
    if (!screenTrack || !sharedClient) return;
    screenTrack.close();
    sharedClient.leave();
    setIsSharing(false);
  });

  useEffect(() => {
    if (connectionState === 'RECONNECTING' && isSharing) {
      setIsSharing(false);
    }
    if (connectionState === 'DISCONNECTING' && screenTrack) {
      screenTrack.stop();
      screenTrack.close();
    }
  }, [connectionState, isSharing, screenTrack]);

  useEffect(() => {
    if (isSharing) {
      shareScreen();
    } else {
      if (!screenTrack || !sharedClient) return;
      sharedClient.unpublish(screenTrack).finally(() => {
        try {
          screenTrack.stop(); // Stop the screen share track
          screenTrack.close(); // Close the track to free up resources
        } catch (error) {
          console.error('Error stopping screen share track:', error);
        } finally {
          sharedClient.leave().catch((error) => {
            console.error('Error leaving screen share client:', error);
          });
        }
      });
    }
  }, [isSharing, screenTrack, shareScreen, sharedClient]);

  useEffect(() => {
    if (error) {
      console.error('Error with screen track:', error);
      setIsSharing(false);
    }
  }, [screenTrack, error]);

  return { isSharing, setIsSharing, screenTrack };
}
