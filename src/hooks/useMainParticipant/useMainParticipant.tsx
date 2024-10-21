import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useScreenShareParticipant from '../useScreenShareParticipant/useScreenShareParticipant';
import { useCurrentUID, useRemoteUsers, useRTCClient } from 'agora-rtc-react';
import useSelectedParticipant from '../useSelectedParticipant/useSelectedParticipant';

export default function useMainParticipant() {
  const [selectedParticipant] = useSelectedParticipant();

  const screenShareParticipant = useScreenShareParticipant();

  const dominantSpeaker = useDominantSpeaker();
  const remoteUsers = useRemoteUsers();
  const uid = useCurrentUID();
  let dominantUser = null;
  if (dominantSpeaker && dominantSpeaker !== uid) {
    dominantUser = remoteUsers.find((user) => user.uid === dominantSpeaker);
  }
  const localParticipant = useRTCClient();
  const remoteScreenShareParticipant =
    screenShareParticipant?.uid
      .toString()
      .replace(SHARE_SCREEN_NAME_SUFFIX, '') !== localParticipant.uid
      ? screenShareParticipant
      : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return (
    selectedParticipant ||
    remoteScreenShareParticipant ||
    dominantUser ||
    remoteUsers[0] ||
    localParticipant
  );
}
