import { useEffect, useState } from 'react';
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  useCurrentUID,
  useNetworkQuality,
  useRTCClient,
} from 'agora-rtc-react';

export default function useParticipantNetworkQualityLevel(
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient,
) {
  const [averageNetworkQualityLevel, setAverageNetworkQualityLevel] =
    useState(0);

  // Get network quality of local user
  const networkQualityLevel = useNetworkQuality();

  const client = useRTCClient();
  const localUID = useCurrentUID(); // Get UID of local user

  useEffect(() => {
    if (!participant.uid) return;

    // Handle network quality based of if user is local or remote
    if (participant.uid === localUID) {
      const { uplinkNetworkQuality, downlinkNetworkQuality } =
        networkQualityLevel;
      setAverageNetworkQualityLevel(
        Math.round((uplinkNetworkQuality + downlinkNetworkQuality) / 2),
      );
    } else {
      // Get and handle network quality of all remote users with unstable network connection
      const remoteNetworkQuality = client.getRemoteNetworkQuality();
      if (participant.uid && participant.uid in remoteNetworkQuality) {
        const { uplinkNetworkQuality, downlinkNetworkQuality } =
          remoteNetworkQuality[participant.uid];
        setAverageNetworkQualityLevel(
          Math.round((uplinkNetworkQuality + downlinkNetworkQuality) / 2),
        );
      }
    }
  }, [client, participant, localUID, networkQualityLevel]);

  return averageNetworkQualityLevel;
}
