import {
  IRemoteAudioTrack,
  useRemoteAudioTracks,
  useRemoteUsers,
} from 'agora-rtc-react';
import AudioTrack from '../AudioTrack/AudioTrack';

interface ParticipantProps {
  audioTrack: IRemoteAudioTrack;
}

function Participant({ audioTrack }: ParticipantProps) {
  if (audioTrack) return <AudioTrack track={audioTrack} />;
  return null;
}

/*
  This ParticipantAudioTracks component will render the audio track for all participants in the room.
  It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
  unnecessarily unmounted/mounted as the user switches between Gallery View and Speaker View.
*/
export function ParticipantAudioTracks() {
  const participants = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(participants);

  return (
    <>
      {audioTracks.map((track) => (
        <Participant key={track.getTrackId()} audioTrack={track} />
      ))}
    </>
  );
}
