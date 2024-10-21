import AgoraRTC, { ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef, useState } from 'react';
import { useVideo } from '../../contexts/VideoContext';
import useCamera from '../useCamera/useCamera';
import { PermissionsDenied } from '../../enum';

export default function useLocalVideoTrack() {
  const [videoTrack, setVideoTrack] = useState<ICameraVideoTrack | undefined>(
    undefined,
  );

  const { setError, devicesInfo } = useVideo();
  const { cameraId } = useCamera(devicesInfo);
  const { cameraOn } = useVideo();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;

    const createTrack = async () => {
      try {
        const track = await AgoraRTC.createCameraVideoTrack(
          cameraId
            ? {
                cameraId,
              }
            : {},
        );
        if (!ignore) {
          if (videoTrack) {
            videoTrack.stop();
            videoTrack.close();
          }
          setVideoTrack(track);
          if (videoRef.current) {
            videoRef.current.innerHTML = '';
            track.play(videoRef.current);
          }
        } else {
          track.stop();
          track.close();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          let message = error.message;
          if ('code' in error && error.code === 'PERMISSION_DENIED') {
            message = PermissionsDenied.CAM;
          }
          setError({ ...error, message });
        } else {
          console.error('Failed to create camera video track:', error);
        }
      }
    };

    if (cameraOn && !videoTrack) {
      createTrack();
    } else if (!cameraOn && videoTrack) {
      cleanup();
    }

    return () => {
      ignore = true;
      if (videoTrack) {
        cleanup();
      }
    };

    function cleanup() {
      if (!videoTrack) return;
      videoTrack.stop();
      videoTrack.close();
      setVideoTrack(undefined);
      if (videoRef.current) {
        videoRef.current.innerHTML = '';
      }
    }
  }, [cameraOn, cameraId, videoTrack, videoRef]);

  return {
    videoRef,
    videoTrack,
    setVideoTrack,
  };
}
