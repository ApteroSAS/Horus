import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import {
  IAgoraRTCRemoteUser,
  useConnectionState,
  useRTCClient,
} from 'agora-rtc-react';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { useParticipantAudioTrack } from '../../hooks/useParticipantAudioTrack/useParticipantAudioTrack';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '../../hooks/useSelectedParticipant/useSelectedParticipant';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import NetworkQualityLevel from '../NetworkQualityLevel/NetworkQualityLevel';
import PinIcon from '../ParticipantInfo/PinIcon/PinIcon';

const Container = styled('div')<{ isRemoteParticipantScreenSharing: boolean }>(
  ({ isRemoteParticipantScreenSharing, theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    ...(!isRemoteParticipantScreenSharing && {
      gridArea: '1 / 1 / 2 / 3',
      [theme.breakpoints.down('sm')]: {
        gridArea: '1 / 1 / 3 / 3',
      },
    }),
  }),
);

const Identity = styled('div')(() => ({
  background: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '0.1em 0.3em 0.1em 0',
  display: 'inline-flex',
  marginRight: '0.4em',
  alignItems: 'center',
  '& svg': {
    marginLeft: '0.3em',
  },
}));

const InfoContainer = styled('div')(() => ({
  position: 'absolute',
  zIndex: 4,
  height: '100%',
  width: '100%',
}));

const ReconnectingContainer = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(40, 42, 43, 0.75)',
  zIndex: 1,
}));

interface MainParticipantInfoProps {
  participant: IAgoraRTCRemoteUser;
  children: React.ReactNode;
}

export default function MainParticipantInfo({
  participant,
  children,
}: MainParticipantInfoProps) {
  const localParticipant = useRTCClient();

  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant
    ? screenShareParticipant.uid !== localParticipant.uid
    : false;

  const [selectedParticipant, setSelectedParticipant] =
    useSelectedParticipant();

  const isSelectedParticipant = participant.uid === selectedParticipant?.uid;

  const connectionState = useConnectionState();
  const { t } = useTranslation('common');

  const { audioTrack, isLocal } = useParticipantAudioTrack(participant);

  // OLD SOURCE CODE - twilio: The 'switchedOff' event is emitted when there is not enough bandwidth to support a track
  // const isVideoSwitchedOff = useIsTrackSwitchedOff(
  //   videoTrack as LocalVideoTrack | RemoteVideoTrack,
  // );

  return (
    <Container
      data-cy-main-participant
      data-cy-participant={participant.uid}
      isRemoteParticipantScreenSharing={isRemoteParticipantScreenSharing}
    >
      <InfoContainer>
        <div style={{ display: 'flex' }}>
          <Identity>
            <AudioLevelIndicator audioTrack={audioTrack} isLocal={isLocal} />
            <Typography variant="body1" color="inherit">
              {participant.uid}
              {isLocal && ' (You)'}
            </Typography>
          </Identity>
          <NetworkQualityLevel participant={participant} />
          {isSelectedParticipant && (
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedParticipant(null);
              }}
            >
              <PinIcon />
            </Box>
          )}
        </div>
      </InfoContainer>
      {connectionState === 'RECONNECTING' && (
        <ReconnectingContainer>
          <Typography variant="body1" style={{ color: 'white' }}>
            {`${t('reconnecting')}...`}
          </Typography>
        </ReconnectingContainer>
      )}
      {children}
    </Container>
  );
}
