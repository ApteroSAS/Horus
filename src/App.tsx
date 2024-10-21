import { styled, Theme } from '@mui/material';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';
import { useAppState } from './contexts/AppStateContext';
import useHeight from './hooks/useHeight/useHeight';
import TopMenuBar from './components/GuestView/TopMenuBar';
import { useTotalCamera } from './hooks/useTotalCamera/useTotalCamera';
import { useVideo } from './contexts/VideoContext';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

const MainContent = () => {
  const { cameraOn, setCamera } = useVideo();
  const {
    showModalMaxCamOn,
    setShowModalMaxCamOn,
    totalCameras,
    shouldDisabledLocalCamera,
  } = useTotalCamera({ cameraOn, setCamera });

  return (
    <>
      <MobileTopMenuBar />
      <Room
        showModalMaxCamOn={showModalMaxCamOn}
        setShowModalMaxCamOn={setShowModalMaxCamOn}
      />
      <MenuBar
        totalCameras={totalCameras}
        shouldDisabledLocalCamera={shouldDisabledLocalCamera}
      />
    </>
  );
};

const GuestContent = () => (
  <>
    <TopMenuBar />
    <Room />
  </>
);

export default function App() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  const { connectionState, agoraError, setCalling, isGuest } = useAppState();

  return (
    <>
      <ErrorDialog
        error={agoraError}
        dismissError={() => {
          setCalling(false);
        }}
      />
      <Container style={{ height }}>
        {['DISCONNECTED', 'CONNECTING'].includes(connectionState) ? (
          <PreJoinScreens />
        ) : (
          <Main>
            {isGuest ? <GuestContent /> : <MainContent />}
            <ReconnectingNotification />
          </Main>
        )}
      </Container>
    </>
  );
}
