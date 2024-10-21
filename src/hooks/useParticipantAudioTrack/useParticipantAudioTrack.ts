import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  useCurrentUID,
  useRemoteAudioTracks,
  useRemoteUsers,
} from 'agora-rtc-react';
import { useVideo } from '../../contexts/VideoContext';

export function useParticipantAudioTrack(
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient,
) {
  const currentUid = useCurrentUID();
  const isLocal = currentUid === participant.uid;
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const { localMicrophoneTrack } = useVideo();

  let audioTrack;
  if (isLocal) {
    audioTrack = localMicrophoneTrack;
  } else {
    const remoteUser = participant as IAgoraRTCRemoteUser;
    const audioTrackRemote = audioTracks.find(
      (track) => track.getUserId() === participant.uid,
    );
    if (audioTrackRemote) {
      audioTrack = audioTrackRemote;
    } else if (remoteUser.audioTrack) {
      audioTrack = remoteUser.audioTrack;
    }
  }

  return { audioTrack, isLocal };
}
