import { useRemoteUsers } from 'agora-rtc-react';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

/*
  Returns the participant that is sharing their screen (if any). This hook assumes that only one participant
  can share their screen at a time.
*/
export default function useScreenShareParticipant() {
  const remoteUsers = useRemoteUsers();
  const screenShareParticipant = remoteUsers.find((user) =>
    user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX),
  );

  return screenShareParticipant;
}
