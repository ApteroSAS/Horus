import { Button, styled, SxProps } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AUDIO_INPUT_MUTED_KEY } from '../../../constants';
import { useVideo } from '../../../contexts/VideoContext';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

const IconStyled = styled('div')({
  display: 'flex',
  alignItems: 'center',
});
const MicIconStyled = styled('div')({
  width: '24px',
  display: 'flex',
  justifyContent: 'center',
});

export default function ToggleAudioButton(props: {
  disabled?: boolean;
  className?: SxProps;
  fillColor?: string;
  slashColor?: string;
}) {
  const { t } = useTranslation('common');

  const { micOn, setMic, micPermission, devicesInfo } = useVideo();
  const { hasAudioInputDevices } = devicesInfo;

  useEffect(() => {
    const audioInputMuted = window.localStorage.getItem(AUDIO_INPUT_MUTED_KEY);
    if (audioInputMuted === 'true' && micOn) {
      setMic(false);
    }
  }, [micOn, setMic]);

  return (
    <Button
      sx={props.className}
      onClick={() => {
        setMic(!micOn);
        window.localStorage.setItem(
          AUDIO_INPUT_MUTED_KEY,
          micOn ? 'true' : 'false',
        );
      }}
      disabled={!hasAudioInputDevices || !micPermission || props.disabled}
    >
      <IconStyled>
        {micOn ? (
          <MicIconStyled>
            <MicIcon fillColor={props.fillColor} />
          </MicIconStyled>
        ) : (
          <MicOffIcon
            fillColor={props.fillColor}
            slashColor={props.slashColor}
          />
        )}
      </IconStyled>
      {!hasAudioInputDevices || !micPermission
        ? t('no_audio')
        : micOn
          ? t('mute')
          : t('unmute')}
    </Button>
  );
}
