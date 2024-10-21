import { styled } from '@mui/material';
import {
  IAgoraRTCRemoteUser,
  LocalUser,
  RemoteUser,
  useCurrentUID,
} from 'agora-rtc-react';
import UserHost from '../../assets/icons/agora_host.svg';
import { useVideo } from '../../contexts/VideoContext';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';

export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  const uid = useCurrentUID();
  const { micOn, localMicrophoneTrack, cameraOn, localCameraTrack } =
    useVideo();

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      {uid === mainParticipant.uid ? (
        <LocalUser
          audioTrack={localMicrophoneTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          videoTrack={localCameraTrack}
          cover={UserHost}
        />
      ) : (
        <ShareScreenWrapper>
          <RemoteUser
            cover={UserHost}
            user={mainParticipant as IAgoraRTCRemoteUser}
            playAudio={false}
          />
        </ShareScreenWrapper>
      )}
    </MainParticipantInfo>
  );
}

const ShareScreenWrapper = styled('div')`
  height: 100%;
  width: 100%;
  & video {
    object-fit: contain !important;
  }
`;
