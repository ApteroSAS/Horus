import {
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import CollaborationViewIcon from '@mui/icons-material/AccountBox';
import GridViewIcon from '@mui/icons-material/Apps';
import {
  Button,
  Menu as MenuContainer,
  MenuItem,
  Typography,
  styled,
} from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts/AppStateContext';
import { useVideo } from '../../contexts/VideoContext';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import BackgroundIcon from '../../icons/BackgroundIcon';
import SettingsIcon from '../../icons/SettingsIcon';
import DeviceSelectionDialog from '../DeviceSelectionDialog/DeviceSelectionDialog';

export const IconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '1.5em',
  marginRight: '0.3em',
});

export const MoreButton = styled('div')({
  border: '1px solid rgb(136,140,142)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  width: '28px',
  height: '28px',
  borderRadius: '4px',
});

export default function Menu() {
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { isSupported, setIsBackgroundSelectionOpen, localMicrophoneTrack } =
    useVideo();
  const { t } = useTranslation('common');
  const { isGalleryViewActive, setIsGalleryViewActive, isGuest } =
    useAppState();

  const anchorRef = useRef<HTMLButtonElement>(null);
  // const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  return (
    <>
      <Button
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        ref={anchorRef}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreButton>
            <MoreVertIcon />
          </MoreButton>
        ) : (
          <>
            {t('more')}
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen((isOpen) => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">
            {t('audio_and_video_settings')}
          </Typography>
        </MenuItem>

        {!isGuest && isSupported && (
          <MenuItem
            onClick={() => {
              setIsBackgroundSelectionOpen(true);
              setMenuOpen(false);
            }}
          >
            <IconContainer>
              <BackgroundIcon />
            </IconContainer>
            <Typography variant="body1">{t('backgrounds')}</Typography>
          </MenuItem>
        )}

        {/* {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )} */}

        <MenuItem
          onClick={() => {
            setIsGalleryViewActive((isGallery) => !isGallery);
            setMenuOpen(false);
          }}
        >
          <IconContainer>
            {isGalleryViewActive ? (
              <CollaborationViewIcon
                style={{ fill: '#707578', width: '0.9em' }}
              />
            ) : (
              <GridViewIcon style={{ fill: '#707578', width: '0.9em' }} />
            )}
          </IconContainer>
          <Typography variant="body1">
            {isGalleryViewActive ? t('speaker_view') : t('gallery_view')}
          </Typography>
        </MenuItem>
      </MenuContainer>
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
        audioTrack={localMicrophoneTrack}
      />
    </>
  );
}
