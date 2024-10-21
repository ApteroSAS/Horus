import {
  IAgoraRTCRemoteUser,
  useCurrentUID,
  useRemoteUsers,
} from 'agora-rtc-react';
import { useEffect, useState } from 'react';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

export default function useSpeakerViewParticipants() {
  const [participants, setParticipants] = useState<IAgoraRTCRemoteUser[]>([]);
  const uid = useCurrentUID();
  const remoteUsers = useRemoteUsers();
  const dominantSpeaker = useDominantSpeaker();

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    const updateParticipants: IAgoraRTCRemoteUser[] = [];
    if (dominantSpeaker && dominantSpeaker !== uid) {
      const dominantUser = remoteUsers.find(
        (user) => user.uid === dominantSpeaker,
      );
      if (dominantUser) updateParticipants.push(dominantUser);
    }

    if (remoteUsers.length) {
      const otherUsers = remoteUsers.filter(
        (user) =>
          user.uid !== dominantSpeaker &&
          !user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX),
      );
      if (otherUsers.length) {
        updateParticipants.push(...otherUsers);
      }
    }
    setParticipants(updateParticipants);
  }, [dominantSpeaker, remoteUsers, uid]);

  return participants;
}
