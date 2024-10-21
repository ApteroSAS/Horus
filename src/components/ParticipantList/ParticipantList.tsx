import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IAgoraRTCRemoteUser, useRTCClient } from 'agora-rtc-react';

import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';
import { useParticipantContext } from '../../contexts/ParticipantContext';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '../../hooks/useSelectedParticipant/useSelectedParticipant';
import { Participant } from '../Participant/Participant';

// Define styled components
const Container = styled('aside')(({ theme }) => ({
  overflowY: 'auto',
  gridArea: '1 / 2 / 1 / 3',
  zIndex: 5,
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    gridArea: '2 / 1 / 3 / 3',
    overflowY: 'initial',
    overflowX: 'auto',
    display: 'flex',
  },
}));

const ScrollContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

const InnerScrollContainer = styled(Box)(({ theme }) => ({
  width: `calc(${theme.sidebarWidth}px - 3em)`,
  padding: '1.5em 0',
  [theme.breakpoints.down('sm')]: {
    width: 'auto',
    padding: `${theme.sidebarMobilePadding}px`,
    display: 'flex',
  },
}));

export default function ParticipantList() {
  const localParticipant = useRTCClient();
  const { speakerViewParticipants } = useParticipantContext();

  const [selectedParticipant, setSelectedParticipant] =
    useSelectedParticipant();

  const screenShareParticipant = useScreenShareParticipant();
  const mainParticipant = useMainParticipant();

  const isRemoteParticipantScreenSharing =
    screenShareParticipant &&
    screenShareParticipant.uid !== localParticipant.uid;

  const handleSetParticipant = (participant: IAgoraRTCRemoteUser) => {
    if (mainParticipant.uid !== participant.uid) {
      if (
        `${participant.uid}${SHARE_SCREEN_NAME_SUFFIX}` !==
        screenShareParticipant?.uid
      ) {
        setSelectedParticipant(participant);
      } else {
        setSelectedParticipant(null);
      }
    }
  };

  if (speakerViewParticipants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <Container
      style={{
        background: isRemoteParticipantScreenSharing
          ? 'rgb(79, 83, 85)'
          : 'transparent',
      }}
    >
      <ScrollContainer>
        <InnerScrollContainer>
          <Participant
            participant={localParticipant}
            isLocalParticipant={true}
          />
          {speakerViewParticipants.map((participant) => {
            const isSelected = participant === selectedParticipant;
            const hideParticipant =
              participant.uid === mainParticipant.uid &&
              participant.uid !== screenShareParticipant?.uid &&
              !isSelected;
            if (hideParticipant) return null;
            return (
              <Participant
                key={participant.uid}
                participant={participant}
                isSelected={isSelected}
                onClick={() => handleSetParticipant(participant)}
              />
            );
          })}
        </InnerScrollContainer>
      </ScrollContainer>
    </Container>
  );
}
