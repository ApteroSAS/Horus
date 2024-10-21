import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  useRemoteUsers,
} from 'agora-rtc-react';
import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts/AppStateContext';
import ScreenShareIcon from '../../icons/ScreenShareIcon';
import NetworkQualityLevel from '../NetworkQualityLevel/NetworkQualityLevel';
import { useParticipantAudioTrack } from '../../hooks/useParticipantAudioTrack/useParticipantAudioTrack';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import { useVideo } from '../../contexts/VideoContext';

const borderWidth = 2;

interface ParticipantInfoProps {
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient;
  children: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

const ContainerStyled = styled('div')<{
  isDominantSpeaker: boolean | undefined;
  hideParticipant: boolean | undefined;
  galleryView: boolean | undefined;
}>(({ isDominantSpeaker, hideParticipant, galleryView, theme }) => ({
  isolation: 'isolate',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: 0,
  overflow: 'hidden',
  marginBottom: '0.5em',
  '& video': {
    objectFit: 'contain !important',
  },
  borderRadius: '8px',
  border: '2px solid #fff',
  paddingTop: `calc(${(9 / 16) * 100}% - ${theme.participantBorderWidth}px)`,
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    height: theme.sidebarMobileHeight,
    width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
    marginRight: '8px',
    marginBottom: '0',
    fontSize: '12px',
    paddingTop: `${theme.sidebarMobileHeight - 2}px`,
  },

  ...(hideParticipant && {
    display: 'none',
  }),
  cursor: 'pointer',
  ...(galleryView && {
    border: `${theme.participantBorderWidth}px solid ${theme.galleryViewBackgroundColor}`,
    borderRadius: '8px',
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      width: '100%',
      height: '100%',
      padding: '0',
      fontSize: '12px',
      margin: '0',
      '& video': {
        objectFit: 'cover !important',
      },
    },
  }),
  ...(isDominantSpeaker && {
    border: `solid ${borderWidth}px #7BEAA5`,
  }),
}));

const InfoContainer = styled('div')(() => ({
  position: 'absolute',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
  background: 'transparent',
  top: 0,
}));

const InfoRowBottom = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  left: 0,
  maxWidth: '100%',
}));

const ScreenShareIconContainer = styled('span')(() => ({
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '0.18em 0.3em',
  marginRight: '0.3em',
  display: 'flex',
  '& path': {
    fill: 'white',
  },
}));

const IdentityContainer = styled('span')(() => ({
  background: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '0.18em 0.3em 0.18em 0',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  color: 'white',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const InnerContainer = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}));

function checkScreenShareEnabled(
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient,
  remoteUsers: IAgoraRTCRemoteUser[],
) {
  const screenShareUID = `${participant.uid}_screen`;
  for (let i = 0; i < remoteUsers.length; i++) {
    if (screenShareUID == remoteUsers[i].uid) return true;
  }
  return false;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  hideParticipant,
  isDominantSpeaker,
}: ParticipantInfoProps) {
  const { t } = useTranslation('common');
  const remoteUsers = useRemoteUsers();
  const isScreenShareEnabled = checkScreenShareEnabled(
    participant,
    remoteUsers,
  );
  const { isGalleryViewActive } = useAppState();
  const { audioTrack, isLocal } = useParticipantAudioTrack(participant);
  const { audioInputDeviceId } = useVideo();

  if (isSelected) {
    return <Fragment />;
  }

  return (
    <ContainerStyled
      isDominantSpeaker={isDominantSpeaker}
      hideParticipant={hideParticipant}
      galleryView={isGalleryViewActive}
      onClick={onClick}
    >
      <Tooltip
        title={
          isGalleryViewActive || isLocalParticipant
            ? ''
            : t('click_to_pin_participant')
        }
      >
        <InfoContainer>
          <NetworkQualityLevel participant={participant} />
          <InfoRowBottom>
            {isScreenShareEnabled && (
              <ScreenShareIconContainer>
                <ScreenShareIcon />
              </ScreenShareIconContainer>
            )}
            <IdentityContainer>
              <Box
                sx={{
                  display: 'flex',
                  flexShrink: '0',
                }}
              >
                <AudioLevelIndicator
                  audioTrack={audioTrack}
                  isLocal={isLocal}
                  key={
                    isLocal
                      ? `${participant.uid}-${audioInputDeviceId}`
                      : participant.uid
                  }
                />
              </Box>
              <TypographyStyled variant="body1">
                {participant.uid}
                {isLocalParticipant && ` (${t('you')})`}
              </TypographyStyled>
            </IdentityContainer>
          </InfoRowBottom>
        </InfoContainer>
      </Tooltip>
      <InnerContainer>
        {children}
        {/* Component for displaying Reconnecting status here */}
      </InnerContainer>
    </ContainerStyled>
  );
}
