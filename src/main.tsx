import { ThemeProvider } from '@mui/material';
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react';
import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SuspenseLoader from './components/SuspenseLoader/SuspenseLoader.tsx';
import './i18n';
import './index.css';
import theme from './theme.ts';

const GuestView = lazy(() => import('./components/GuestView/GuestView.tsx'));
const SpotLightView = lazy(
  () => import('./components/SpotLightView/SpotLightView.tsx'),
);
const VideoApp = lazy(() => import('./components/VideoApp/VideoApp.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseLoader>
        <VideoApp />
      </SuspenseLoader>
    ),
  },
  {
    path: '/room/:URLRoomName',
    element: (
      <SuspenseLoader>
        <VideoApp />
      </SuspenseLoader>
    ),
  },
  {
    path: '/view/:URLRoomName',
    element: (
      <SuspenseLoader>
        <SpotLightView />
      </SuspenseLoader>
    ),
  },
  {
    path: '/guest/:URLRoomName',
    element: (
      <SuspenseLoader>
        <GuestView />
      </SuspenseLoader>
    ),
  },
]);

// In the video call scenario, set mode to "rtc"
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AgoraRTCProvider client={client}>
        <RouterProvider router={router} />
      </AgoraRTCProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
