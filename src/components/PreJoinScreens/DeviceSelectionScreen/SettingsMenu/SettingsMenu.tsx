import {
  Button,
  styled,
  SxProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVideo } from '../../../../contexts/VideoContext';
import useLocalAudioTrack from '../../../../hooks/useLocalAudioTrack/useLocalAudioTrack';
import SettingsIcon from '../../../../icons/SettingsIcon';
import DeviceSelectionDialog from '../../../DeviceSelectionDialog/DeviceSelectionDialog';

const IconStyled = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '24px',
});

export function DeviceSettingsMenu(props: { className?: SxProps }) {
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);

  const { t } = useTranslation('common');
  const { cameraOn, setCamera } = useVideo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const { audioTrack } = useLocalAudioTrack();

  const handleCloseSetting = () => {
    setDeviceSettingsOpen(false);
    if (!cameraOn) return;
    setCamera(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCamera(true);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Button
        sx={props.className}
        ref={anchorRef}
        onClick={() => setDeviceSettingsOpen(true)}
      >
        <IconStyled>
          <SettingsIcon fillColor={theme.palette.primary.main} />
        </IconStyled>
        {isMobile ? t('settings') : t('device_settings')}
      </Button>
      <DeviceSelectionDialog
        open={deviceSettingsOpen}
        onClose={handleCloseSetting}
        audioTrack={audioTrack}
      />
    </>
  );
}
