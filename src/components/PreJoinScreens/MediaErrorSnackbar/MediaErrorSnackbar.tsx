import i18n from 'i18next';
import { useState } from 'react';
import { useVideo } from '../../../contexts/VideoContext';
import { PermissionsDenied } from '../../../enum';
import Snackbar from '../../Snackbar/Snackbar';

export function getSnackbarContent(
  hasAudio: boolean,
  hasVideo: boolean,
  error?: Error,
) {
  let headline = '';
  let message = '';

  switch (true) {
    case error?.message === PermissionsDenied.CAM:
      headline = i18n.t('common:permissions.unable_access_media');
      message = i18n.t('common:permissions.cam_denied');
      break;
    case error?.message === PermissionsDenied.MIC:
      headline = i18n.t('common:permissions.unable_access_media');
      message = i18n.t('common:permissions.mic_denied');
      break;

    // This error is emitted when the user or the user's system has denied permission to use the media devices
    // case error?.name === 'NotAllowedError':
    //   headline = 'Unable to Access Media:';

    //   if (error!.message === 'Permission denied by system') {
    //     // Chrome only
    //     message =
    //       'The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.';
    //   } else {
    //     message =
    //       'The user has denied permission to use audio and video. Please grant permission to the browser to access the microphone and camera.';
    //   }

    //   break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    // case error?.name === 'NotFoundError':
    //   headline = 'Cannot Find Microphone or Camera:';
    //   message =
    //     'The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.';
    //   break;

    case !hasAudio && !hasVideo:
      headline = i18n.t('common:no_camera_microphone_detected');
      message = i18n.t('common:other_participants_unable_see_and_hear_you');
      break;

    case !hasVideo:
      headline = i18n.t('common:no_camera_detected');
      message = i18n.t('common:other_participants_unable_to_see_you');
      break;

    case !hasAudio:
      headline = i18n.t('common:no_microphone_detected');
      message = i18n.t('common:other_participants_unable_to_hear_you');
  }

  return {
    headline,
    message,
  };
}

export default function MediaErrorSnackbar({ error }: { error?: Error }) {
  const { devicesInfo } = useVideo();
  const { hasAudioInputDevices, hasVideoInputDevices } = devicesInfo;

  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);

  const isSnackbarOpen =
    !isSnackbarDismissed &&
    (!hasAudioInputDevices || !hasVideoInputDevices || Boolean(error));

  const { headline, message } = getSnackbarContent(
    hasAudioInputDevices,
    hasVideoInputDevices,
    error,
  );

  return (
    <Snackbar
      open={isSnackbarOpen}
      handleClose={() => setIsSnackbarDismissed(true)}
      headline={headline}
      message={message}
      variant="warning"
    />
  );
}
