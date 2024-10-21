import App from '../../App';
import { AppStateProvider } from '../../contexts/AppStateContext';
import { ParticipantProvider } from '../../contexts/ParticipantContext';
import { VideoProvider } from '../../contexts/VideoContext';

function GuestView() {
  return (
    <AppStateProvider>
      <VideoProvider>
        <ParticipantProvider>
          <App />
        </ParticipantProvider>
      </VideoProvider>
    </AppStateProvider>
  );
}

export default GuestView;
