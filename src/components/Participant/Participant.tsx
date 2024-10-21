import { styled } from '@mui/material';
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  LocalUser,
  RemoteUser,
  useCurrentUID,
} from 'agora-rtc-react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import UserHost from '../../assets/icons/agora_host.svg';
import { useVideo } from '../../contexts/VideoContext';

interface ParticipantProps {
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient;
  isLocalParticipant?: boolean;
  isDominantSpeaker?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  hideParticipant?: boolean;
}

const UserFrame = styled('div')(() => ({
  boxSizing: 'border-box',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
}));

export function Participant({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
  hideParticipant,
  isSelected,
  onClick,
}: ParticipantProps) {
  const uid = useCurrentUID();

  const { micOn, localMicrophoneTrack, cameraOn, localCameraTrack } =
    useVideo();

  return (
    <ParticipantInfo
      participant={participant}
      isDominantSpeaker={isDominantSpeaker}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
      isSelected={isSelected}
      onClick={onClick}
    >
      <UserFrame>
        {uid === participant.uid ? (
          <LocalUser
            audioTrack={localMicrophoneTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={false}
            videoTrack={localCameraTrack}
            cover={UserHost}
          />
        ) : (
          <RemoteUser
            cover={UserHost}
            user={participant as IAgoraRTCRemoteUser}
          />
        )}
      </UserFrame>
    </ParticipantInfo>
  );
}
