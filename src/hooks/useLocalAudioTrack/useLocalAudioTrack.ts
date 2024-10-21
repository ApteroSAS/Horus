import AgoraRTC, { IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useState } from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { PermissionsDenied } from '../../enum';

export default function useLocalAudioTrack() {
  const [audioTrack, setAudioTrack] = useState<
    IMicrophoneAudioTrack | undefined
  >();

  const { setError, micOn } = useVideo();

  useEffect(() => {
    let ignore = false;

    const createTrack = async () => {
      try {
        const track = await AgoraRTC.createMicrophoneAudioTrack();
        if (ignore) return;
        setAudioTrack(track);
      } catch (error: unknown) {
        if (error instanceof Error) {
          let message = error.message;
          if ('code' in error && error.code === 'PERMISSION_DENIED') {
            message = PermissionsDenied.MIC;
          }
          setError({ ...error, message });
        } else {
          console.error('Failed to create camera audio track:', error);
        }
      }
    };

    // Manage the track lifecycle based on micOn state
    if (micOn && !audioTrack) {
      createTrack();
    } else if (!micOn && audioTrack) {
      cleanup();
    }

    return () => {
      ignore = true;
      if (audioTrack) {
        cleanup();
      }
    };

    function cleanup() {
      if (!audioTrack) return;
      if (audioTrack.isPlaying) {
        audioTrack.stop();
      }
      audioTrack.close();
      setAudioTrack(undefined);
    }
  }, [audioTrack, micOn, setError]);

  return {
    audioTrack,
  };
}
