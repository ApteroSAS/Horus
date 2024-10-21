import { useEffect, useRef } from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { IAgoraRTCRemoteUser, ILocalAudioTrack } from 'agora-rtc-react';

interface AudioTrackProps {
  track: ILocalAudioTrack | IAgoraRTCRemoteUser['audioTrack'];
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const { activeSinkId } = useVideo();
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track) {
      if (!audioEl.current) {
        // Create an HTMLAudioElement
        audioEl.current = document.createElement('audio');
        audioEl.current.autoplay = true;
        document.body.appendChild(audioEl.current);
      }

      // Use the underlying MediaStreamTrack directly
      const stream = new MediaStream([track.getMediaStreamTrack()]);
      audioEl.current.srcObject = stream;

      // Set the sink ID for audio output
      if (typeof audioEl.current.setSinkId === 'function') {
        audioEl.current.setSinkId(activeSinkId).catch((error) => {
          console.error('Error setting sink ID:', error);
        });
      }
    }

    return () => {
      if (audioEl.current) {
        // Clean up the audio element
        document.body.removeChild(audioEl.current);
        audioEl.current.srcObject = null;
        audioEl.current = null;
        if (!track) return;
        // Stop playing the track if it's local
        if ('stop' in track) {
          track.stop();
        }
      }
    };
  }, [track, activeSinkId]);

  return null;
}
