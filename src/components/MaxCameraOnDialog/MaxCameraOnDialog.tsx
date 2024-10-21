import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from '@mui/material';
import { MAX_USERS_CAMERA_ON } from '../../constants';
import { useTranslation } from 'react-i18next';

type PropType = {
  open: boolean;
  onClose: () => void;
};

export default function MaxCameraOnDialog({ open, onClose }: PropType) {
  const { t } = useTranslation('common');

  function closeDialog() {
    onClose();
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{t('max_cam_modal.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('max_cam_modal.content_1')}</Typography>
        <Typography>{t('max_cam_modal.content_2')}</Typography>
        <Typography>
          {t('max_cam_modal.content_3')} ({MAX_USERS_CAMERA_ON}{' '}
          {t('max_cam_modal.cameras')})
        </Typography>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={closeDialog}>
          {t('max_cam_modal.close')}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}

const StyledButton = styled(Button)(() => ({
  color: 'white',
  backgroundColor: '#f26750',
  '&:hover': {
    background: '#b84937',
  },
}));
