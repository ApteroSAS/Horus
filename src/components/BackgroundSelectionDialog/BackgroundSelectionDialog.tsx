import { Box } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Theme, useTheme } from '@mui/material/styles';
import { useVideo } from '../../contexts/VideoContext';
import { backgroundConfig } from '../../hooks/useBackgroundSettings/useBackgroundSettings';
import BackgroundSelectionHeader from './BackgroundSelectionHeader/BackgroundSelectionHeader';
import BackgroundThumbnail from './BackgroundThumbnail/BackgroundThumbnail';
import { BackgroundType } from '../../enum';
import { useTranslation } from 'react-i18next';

const style = (theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: theme.rightDrawerWidth,
    height: `calc(100% - ${theme.footerHeight}px)`,
    zIndex: 2,
  },
  thumbnailContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px 5px 72px 5px',
    overflowY: 'auto',
  },
});

function BackgroundSelectionDialog() {
  const theme = useTheme();
  const styles = style(theme);
  const { isBackgroundSelectionOpen, setIsBackgroundSelectionOpen } =
    useVideo();
  const { t } = useTranslation('common');

  const imageNames = backgroundConfig.imageNames;
  const images = backgroundConfig.images;

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isBackgroundSelectionOpen}
      transitionDuration={0}
      sx={styles.drawer}
      PaperProps={{
        sx: {
          display: 'flex',
          width: theme.rightDrawerWidth,
        },
      }}
    >
      <BackgroundSelectionHeader
        onClose={() => setIsBackgroundSelectionOpen(false)}
      />
      <Box sx={styles.thumbnailContainer}>
        <BackgroundThumbnail thumbnail={BackgroundType.NONE} name={t('none')} />
        <BackgroundThumbnail thumbnail={BackgroundType.BLUR} name={t('blur')} />
        {images.map((image, index) => (
          <BackgroundThumbnail
            thumbnail={BackgroundType.IMAGE}
            name={imageNames[index]}
            index={index}
            imagePath={image}
            key={image}
          />
        ))}
      </Box>
    </Drawer>
  );
}

export default BackgroundSelectionDialog;
