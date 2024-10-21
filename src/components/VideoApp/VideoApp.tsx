import AgoraRTC, { AgoraRTCScreenShareProvider } from 'agora-rtc-react';
import App from '../../App.tsx';
import { AppStateProvider } from '../../contexts/AppStateContext.tsx';
import { VideoProvider } from '../../contexts/VideoContext.tsx';
import { ParticipantProvider } from '../../contexts/ParticipantContext.tsx';

export default function VideoApp() {
  const clientShareScreen = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });
  return (
    <AgoraRTCScreenShareProvider client={clientShareScreen}>
      <AppStateProvider>
        <VideoProvider>
          <ParticipantProvider>
            <App />
          </ParticipantProvider>
        </VideoProvider>
      </AppStateProvider>
    </AgoraRTCScreenShareProvider>
  );
}
