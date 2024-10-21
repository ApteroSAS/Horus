import { styled } from '@mui/material/styles';
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-react';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';

const OuterContainer = styled('div')(() => ({
  width: '2em',
  height: '2em',
  padding: '0.9em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
}));

const InnerContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  '& div': {
    width: '2px',
    marginRight: '1px',
    '&:not(:last-child)': {
      borderRight: 'none',
    },
  },
}));

const STEP = 3; // This controls the height of the bars
const MAX_BARS = 6; // Adjust this based on how many bars you want (0 to 5 or 0 to 6 for Agora)

interface NetworkQualityLevelProps {
  participant: IAgoraRTCRemoteUser | IAgoraRTCClient;
}

export default function NetworkQualityLevel({
  participant,
}: NetworkQualityLevelProps) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  // Handle the case where the quality is unknown (averageNetworkQuality = 0)
  if (networkQualityLevel === 0) return null;

  return (
    <OuterContainer>
      <InnerContainer>
        {[...Array(MAX_BARS)].map((_, index) => (
          <div
            key={index}
            style={{
              height: `${STEP * (index + 1)}px`,
              background:
                networkQualityLevel <= MAX_BARS - index
                  ? 'white'
                  : 'rgba(255, 255, 255, 0.2)',
            }}
          />
        ))}
      </InnerContainer>
    </OuterContainer>
  );
}
