import { styled, useMediaQuery, useTheme } from '@mui/material';

import { useAppState } from '../../contexts/AppStateContext';
import { useVideo } from '../../contexts/VideoContext';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import { useSetSpeakerViewOnScreenShare } from '../../hooks/useSetSpeakerViewOnScreenShare/useSetSpeakerViewOnScreenShare';
import { GalleryView } from '../GalleryView/GalleryView';
import MainParticipant from '../MainParticipant/MainParticipant';
import { MobileGalleryView } from '../MobileGalleryView/MobileGalleryView';
import ParticipantList from '../ParticipantList/ParticipantList';
import { ParticipantAudioTracks } from '../ParticipantAudioTracks/ParticipantAudioTracks';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import MaxCameraOnDialog from '../MaxCameraOnDialog/MaxCameraOnDialog';

const Container = styled('div')<{
  isRightDrawerOpen: boolean;
}>(({ theme, isRightDrawerOpen }) => {
  const totalMobileSidebarHeight = `${
    theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth
  }px`;
  return {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
    },
    ...(isRightDrawerOpen && {
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px`,
    }),
  };
});

type PropsType = {
  showModalMaxCamOn?: boolean;
  setShowModalMaxCamOn?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Room = ({
  showModalMaxCamOn,
  setShowModalMaxCamOn,
}: PropsType) => {
  const { isGalleryViewActive, setIsGalleryViewActive } = useAppState();
  const { isBackgroundSelectionOpen } = useVideo();
  const screenShareParticipant = useScreenShareParticipant();

  const isRightDrawerOpen = isBackgroundSelectionOpen;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const searchParams = new URLSearchParams(location.search);
  const soundEnabled: boolean = searchParams.get('disableSound') !== 'true';

  useSetSpeakerViewOnScreenShare(
    screenShareParticipant,
    setIsGalleryViewActive,
    isGalleryViewActive,
  );

  return (
    <Container isRightDrawerOpen={isRightDrawerOpen} theme={theme}>
      {soundEnabled && <ParticipantAudioTracks />}
      {isGalleryViewActive ? (
        isMobile ? (
          <MobileGalleryView />
        ) : (
          <GalleryView />
        )
      ) : (
        <>
          <MainParticipant />
          <ParticipantList />
        </>
      )}
      <BackgroundSelectionDialog />
      <MaxCameraOnDialog
        open={Boolean(showModalMaxCamOn)}
        onClose={() => {
          setShowModalMaxCamOn && setShowModalMaxCamOn(false);
        }}
      />
    </Container>
  );
};

export default Room;
