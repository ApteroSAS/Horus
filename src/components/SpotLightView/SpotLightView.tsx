import { AppStateProvider } from '../../contexts/AppStateContext';
import { ParticipantProvider } from '../../contexts/ParticipantContext';
import { VideoProvider } from '../../contexts/VideoContext';
import SpotLightViewApp from './SpotLightViewApp';

function SpotLightView() {
  return (
    <AppStateProvider>
      <VideoProvider>
        <ParticipantProvider>
          <SpotLightViewApp />
        </ParticipantProvider>
      </VideoProvider>
    </AppStateProvider>
  );
}

export default SpotLightView;
