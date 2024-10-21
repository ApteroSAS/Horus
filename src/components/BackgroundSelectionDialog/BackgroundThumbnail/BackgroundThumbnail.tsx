import clsx from 'clsx';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import { useVideo } from '../../../contexts/VideoContext';
import { Box, Theme, Typography, useTheme } from '@mui/material';
import { BackgroundType } from '../../../enum';

export type Thumbnail = `${BackgroundType}`;

interface BackgroundThumbnailProps {
  thumbnail: Thumbnail;
  imagePath?: string;
  name?: string;
  index?: number;
}

const style = (theme: Theme) => ({
  thumbContainer: {
    margin: '5px',
    width: 'calc(50% - 10px)',
    display: 'flex',
    position: 'relative',
    '&::after': {
      content: '""',
      paddingBottom: '55.5%',
    },
    cursor: 'pointer',
  },
  thumbIconContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    border: `solid ${theme.palette.grey[400]}`,
    '&.selected': {
      border: `solid ${theme.palette.primary.main}`,
      '& svg': {
        color: `${theme.palette.primary.main}`,
      },
    },
  },
  thumbIcon: {
    height: 50,
    width: 50,
    color: `${theme.palette.grey[400]}`,
    '&.selected': {
      color: `${theme.palette.primary.main}`,
    },
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    objectFit: 'cover',
    borderRadius: '10px',
    border: `solid ${theme.palette.grey[400]}`,
    '&:hover': {
      cursor: 'pointer',
      '& svg': {
        color: `${theme.palette.primary.main}`,
      },
      '& $thumbOverlay': {
        visibility: 'visible',
      },
    },
    '&.selected': {
      border: `solid ${theme.palette.primary.main}`,
      '& svg': {
        color: `${theme.palette.primary.main}`,
      },
    },
  },
  thumbOverlay: {
    position: 'absolute',
    color: 'transparent',
    padding: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      background: 'rgba(95, 93, 128, 0.6)',
      color: 'white',
    },
  },
});
export default function BackgroundThumbnail({
  thumbnail,
  imagePath,
  name,
  index,
}: BackgroundThumbnailProps) {
  const theme = useTheme();
  const styles = style(theme);
  const { backgroundSettings, setBackgroundSettings } = useVideo();
  const isImage = thumbnail === BackgroundType.IMAGE;
  const thumbnailSelected = isImage
    ? backgroundSettings?.index === index &&
      backgroundSettings.type === BackgroundType.IMAGE
    : backgroundSettings?.type === thumbnail;
  const icons = {
    none: NotInterestedOutlinedIcon,
    blur: BlurOnOutlinedIcon,
    image: null,
  };
  const ThumbnailIcon = icons[thumbnail];

  return (
    <Box
      sx={styles.thumbContainer}
      onClick={() =>
        setBackgroundSettings({
          type: thumbnail,
          index: index,
        })
      }
    >
      {ThumbnailIcon ? (
        <Box
          sx={styles.thumbIconContainer}
          className={clsx({ selected: thumbnailSelected })}
        >
          <ThumbnailIcon sx={styles.thumbIcon} />
        </Box>
      ) : (
        <Box
          component={'img'}
          sx={styles.thumbImage}
          className={clsx({ selected: thumbnailSelected })}
          src={imagePath}
          alt={name}
        />
      )}
      <Typography sx={styles.thumbOverlay}>{name}</Typography>
    </Box>
  );
}
