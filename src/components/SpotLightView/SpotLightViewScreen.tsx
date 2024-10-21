import { styled } from '@mui/material';
import {
  IAgoraRTCRemoteUser,
  RemoteUser,
  useRemoteUsers,
} from 'agora-rtc-react';
import UserHost from '../../assets/icons/agora_host.svg';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import { useTranslation } from 'react-i18next';

export default function SpotLightViewScreen() {
  const mainParticipant = useMainParticipant();
  const remoteUsers = useRemoteUsers();
  const { t } = useTranslation('common');

  const participants = remoteUsers.filter((user) =>
    user.uid.toString().includes(SHARE_SCREEN_NAME_SUFFIX),
  );

  const isShareScreen = participants.length > 0;

  if (isShareScreen) {
    return (
      <MainParticipantInfo participant={mainParticipant}>
        <ShareScreenWrapper>
          <RemoteUser
            cover={UserHost}
            user={mainParticipant as IAgoraRTCRemoteUser}
          />
        </ShareScreenWrapper>
      </MainParticipantInfo>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Adjust height as needed
          width: '100%', // Adjust width as needed
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          {t('no_one_streaming')}
        </div>
      </div>
    );
  }
}

const ShareScreenWrapper = styled('div')`
  height: 100%;
  width: 100%;
  & video {
    object-fit: contain !important;
  }
`;
