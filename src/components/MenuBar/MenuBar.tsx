import { Button, Grid, Theme, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useCurrentUID, useRemoteUsers } from 'agora-rtc-react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts/AppStateContext';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useScreenShareToggle from '../../hooks/useToggleShareScreen/useToggleShareScreen';
import ApteroLogo from '../../icons/ApteroLogo';
import ScreenShareIcon from '../../icons/ScreenShareIcon';
import { isMobile as isMobileDevice } from '../../utils/index';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';
import Menu from './Menu';

// Define styled components using MUI's `styled` utility
const Container = styled('footer')(
  ({ theme, isMobile }: { theme: Theme; isMobile: boolean }) => ({
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    left: 0,
    right: 0,
    height: `${theme.footerHeight}px`,
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.43em',
    justifyContent: isMobile ? 'center' : 'space-between',
    zIndex: 10,
    boxShadow: '#00122f 0px -6px 8px',
    [theme.breakpoints.down('sm')]: {
      height: `${theme.mobileFooterHeight}px`,
      padding: 0,
    },
  }),
);

const ScreenShareBanner = styled(Grid)(({ theme }: { theme: Theme }) => ({
  position: 'fixed',
  zIndex: 8,
  bottom: `${theme.footerHeight}px`,
  left: 0,
  right: 0,
  height: '104px',
  background: 'rgba(0, 0, 0, 0.5)',
  '& h6': {
    color: 'white',
  },
  '& button': {
    background: 'white',
    color: theme.brand,
    border: `2px solid ${theme.brand}`,
    margin: '0 2em',
    '&:hover': {
      color: '#600101',
      border: `2px solid #600101`,
      background: '#FFE9E7',
    },
  },
}));

const HideMobile = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'initial',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.down('md')]: {
    flexGrow: 0,
  },
}));

const LogoStyled = styled('div')({
  width: '100px',
});

const RoomInfo = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 0,
    alignItems: 'start',
  },
}));

const Settings = styled('div')({
  minWidth: '250px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

type PropsType = {
  totalCameras: number;
  shouldDisabledLocalCamera: boolean;
};

export default function MenuBar({
  totalCameras,
  shouldDisabledLocalCamera,
}: PropsType) {
  const { connectionState } = useAppState();
  const isReconnecting = connectionState === 'RECONNECTING';
  const { roomName } = useAppState();
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();

  const screenShareParticipant = useScreenShareParticipant();
  const uid = useCurrentUID();

  const remoteUsers = useRemoteUsers();
  const theme = useTheme();

  const { isSharing, setIsSharing, screenTrack } = useScreenShareToggle();

  return (
    <>
      {isSharing && screenTrack && (
        <ScreenShareBanner
          container
          justifyContent="center"
          alignItems="center"
          theme={theme}
        >
          <Typography variant="h6">
            {t('you_are_sharing_your_screen')}
          </Typography>
          <Button onClick={() => setIsSharing(false)}>
            {t('stop_sharing')}
          </Button>
        </ScreenShareBanner>
      )}
      <Container theme={theme} isMobile={isMobile}>
        <HideMobile theme={theme}>
          <RoomInfo theme={theme}>
            <LogoStyled>
              <ApteroLogo />
            </LogoStyled>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              {roomName} | {remoteUsers.length + 1} {t('participant')}
              {remoteUsers.length ? 's' : ''}{' '}
              {`(${totalCameras} ${totalCameras > 1 ? 'cameras' : 'camera'} on)`}
            </Typography>
          </RoomInfo>
        </HideMobile>
        <Settings>
          <ToggleAudioButton
            disabled={isReconnecting}
            className={{ whiteSpace: 'nowrap' }}
          />
          <ToggleVideoButton
            disabled={isReconnecting}
            className={{ whiteSpace: 'nowrap' }}
            shouldDisabledLocalCamera={shouldDisabledLocalCamera}
          />
          {!isSharing && !isMobileDevice && (
            <Button
              onClick={() => setIsSharing(true)}
              disabled={
                isReconnecting ||
                (screenShareParticipant && screenShareParticipant.uid !== uid)
              }
              startIcon={<ScreenShareIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('share_screen')}
            </Button>
          )}
          <HideMobile theme={theme}>
            <Menu />
          </HideMobile>
        </Settings>
        <HideMobile theme={theme}>
          <Grid container justifyContent="flex-end">
            <EndCallButton />
          </Grid>
        </HideMobile>
      </Container>
    </>
  );
}
