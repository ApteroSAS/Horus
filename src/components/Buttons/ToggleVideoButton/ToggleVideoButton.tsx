import { Button, SxProps, Tooltip } from '@mui/material';
import { useVideo } from '../../../contexts/VideoContext';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';
import { useEffect } from 'react';
import { VIDEO_INPUT_MUTED_KEY } from '../../../constants';
import { useTranslation } from 'react-i18next';

export default function ToggleVideoButton(props: {
  disabled?: boolean;
  className?: SxProps;
  fillColor?: string;
  slashColor?: string;
  shouldDisabledLocalCamera?: boolean;
}) {
  const {
    disabled,
    className,
    fillColor,
    slashColor,
    shouldDisabledLocalCamera,
  } = props;
  const { t } = useTranslation('common');
  const { cameraOn, setCamera, cameraPermission, devicesInfo } = useVideo();
  const { hasVideoInputDevices } = devicesInfo;

  useEffect(() => {
    const videoInputMuted = window.localStorage.getItem(VIDEO_INPUT_MUTED_KEY);
    if (videoInputMuted === 'true' && cameraOn) {
      setCamera(false); //mute
    }
  }, [cameraOn, setCamera]);

  const isBtnDisabled = !hasVideoInputDevices || !cameraPermission || disabled;

  if (shouldDisabledLocalCamera) {
    return (
      <Tooltip title={t('max_cam_on_msg')} arrow>
        <span>
          <Button
            sx={className}
            disabled={true}
            startIcon={
              <VideoOffIcon fillColor={fillColor} slashColor={slashColor} />
            }
          >
            {t('start_video')}
          </Button>
        </span>
      </Tooltip>
    );
  }
  return (
    <Button
      sx={className}
      onClick={() => {
        setCamera(!cameraOn);
        window.localStorage.setItem(
          VIDEO_INPUT_MUTED_KEY,
          cameraOn ? 'true' : 'false',
        );
      }}
      disabled={isBtnDisabled}
      startIcon={
        cameraOn ? (
          <VideoOnIcon fillColor={fillColor} />
        ) : (
          <VideoOffIcon fillColor={fillColor} slashColor={slashColor} />
        )
      }
    >
      {!hasVideoInputDevices || !cameraPermission
        ? t('no_video')
        : cameraOn
          ? t('stop_video')
          : t('start_video')}
    </Button>
  );
}
