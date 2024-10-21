import {
  IAgoraRTCRemoteUser,
  useIsConnected,
  useRemoteUsers,
} from 'agora-rtc-react';
import { MAX_USERS_CAMERA_ON, SHARE_SCREEN_NAME_SUFFIX } from '../../constants';
import { useEffect, useState } from 'react';
import useRemoteUsersAfterJoin from '../useRemoteUsersAfterJoin/useRemoteUsersAfterJoin';

export function useTotalCamera({
  cameraOn,
  setCamera,
}: {
  cameraOn: boolean;
  setCamera: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const remoteUsers = useRemoteUsers();
  const isConnected = useIsConnected();
  const [showModalMaxCamOn, setShowModalMaxCamOn] = useState<boolean>(false);
  const [totalCameras, setTotalCameras] = useState<number>(0);

  const isMaxCameraOn = totalCameras >= MAX_USERS_CAMERA_ON;
  const shouldDisabledLocalCamera = isConnected && !cameraOn && isMaxCameraOn;

  const { capturedRemoteUsers } = useRemoteUsersAfterJoin();

  useEffect(() => {
    const total = getTotalCameraOn(cameraOn, remoteUsers);
    setTotalCameras(total);
  }, [cameraOn, remoteUsers]);

  useEffect(() => {
    if (isConnected && cameraOn) {
      const countCams = getTotalCameraOn(cameraOn, capturedRemoteUsers);
      if (countCams > MAX_USERS_CAMERA_ON) {
        setShowModalMaxCamOn(true);
        setCamera(false);
      }
    }
  }, [cameraOn, setCamera, capturedRemoteUsers, isConnected]);

  return {
    totalCameras,
    shouldDisabledLocalCamera,
    showModalMaxCamOn,
    setShowModalMaxCamOn,
  };
}

function getTotalCameraOn(
  cameraOn: boolean,
  remoteUsers: IAgoraRTCRemoteUser[],
): number {
  let count = 0;
  if (cameraOn) count++;
  if (remoteUsers.length) {
    const tracks = remoteUsers.filter((user) => {
      return (
        !user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX) && user.hasVideo
      );
    });
    count = count + tracks.length;
  }
  return count;
}
