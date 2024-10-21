import { styled } from '@mui/material';
import { useConnectionState } from 'agora-rtc-react';
import useHeight from '../../hooks/useHeight/useHeight';
import ReconnectingNotification from '../ReconnectingNotification/ReconnectingNotification';
import SpotLightViewPreJoinsScreens from './SpotLightViewPreJoinsScreens';
import SpotLightViewRoom from './SpotLightViewRoom';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')({
  overflow: 'hidden',
  background: 'black',
});

export default function SpotLightViewApp() {
  const connectionState = useConnectionState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      {['DISCONNECTED', 'CONNECTING'].includes(connectionState) ? (
        <SpotLightViewPreJoinsScreens />
      ) : (
        <Main>
          <ReconnectingNotification />
          <SpotLightViewRoom />
        </Main>
      )}
    </Container>
  );
}
