import { Box, Button, Typography } from '@mui/material';
import CloseIcon from '../../../icons/CloseIcon';
import { useTranslation } from 'react-i18next';

const styles = {
  container: {
    minHeight: '56px',
    background: '#F4F4F6',
    borderBottom: '1px solid #E4E7E9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1em',
  },
  text: {
    fontWeight: 'bold',
  },
  closeBackgroundSelection: {
    cursor: 'pointer',
    display: 'flex',
    background: 'transparent',
    border: '0',
    padding: '0.4em',
  },
};

interface BackgroundSelectionHeaderProps {
  onClose: () => void;
}

export default function BackgroundSelectionHeader({
  onClose,
}: BackgroundSelectionHeaderProps) {
  const { t } = useTranslation('common');
  return (
    <Box sx={styles.container}>
      <Typography sx={styles.text}>{t('backgrounds')}</Typography>
      <Button sx={styles.closeBackgroundSelection} onClick={onClose}>
        <CloseIcon />
      </Button>
    </Box>
  );
}
