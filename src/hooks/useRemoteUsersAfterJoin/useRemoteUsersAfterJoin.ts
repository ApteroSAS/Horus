import { useEffect, useState } from 'react';
import {
  useRemoteUsers,
  useIsConnected,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-react';

const STABLE_DELAY = 2500; // Delay to get the remote user list after join

export default function useRemoteUsersAfterJoin() {
  const [capturedRemoteUsers, setCapturedRemoteUsers] = useState<
    IAgoraRTCRemoteUser[]
  >([]); // State to store captured remote users
  const remoteUsers = useRemoteUsers(); // Get the current remote users
  const isConnected = useIsConnected(); // Check if the local user is connected
  const [hasCaptured, setHasCaptured] = useState(false); // To prevent multiple captures

  useEffect(() => {
    let timer: number;

    if (isConnected && !hasCaptured) {
      // Start the timer after user joins
      timer = setTimeout(() => {
        setCapturedRemoteUsers([...remoteUsers]); // Capture the remote users after 2 seconds
        setHasCaptured(true); // Mark that we've captured the list
      }, STABLE_DELAY);
    }

    // Clean up the timer if the component unmounts or dependencies change
    return () => {
      clearTimeout(timer);
    };
  }, [isConnected, remoteUsers, hasCaptured]);

  return { capturedRemoteUsers };
}
