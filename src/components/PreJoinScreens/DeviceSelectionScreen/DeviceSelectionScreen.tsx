import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleVideoButton from '../../..//components/Buttons/ToggleVideoButton/ToggleVideoButton';
import ToggleAudioButton from '../../../components/Buttons/ToggleAudioButton/ToggleAudioButton';
import { USER_NAME_MAX_LENGTH } from '../../../constants';
import { useAppState } from '../../../contexts/AppStateContext';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import { DeviceSettingsMenu } from './SettingsMenu/SettingsMenu';
interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  onJoin: () => void;
}

const style = (theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    marginBottom: '2em',
    [theme.breakpoints.down('md')]: {
      padding: '0',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      color: 'white',
      ':hover': {
        backgroundColor: '#d37b13',
      },
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  toolTipContainer: {
    display: 'flex',
    alignItems: 'center',
    '& div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& svg': {
      marginLeft: '0.3em',
    },
  },
});

export default function DeviceSelectionScreen({
  name,
  roomName,
  setName,
  onJoin,
}: DeviceSelectionScreenProps) {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const styles = style(theme);
  const { t } = useTranslation('common');

  const { isLoading, isGuest } = useAppState();
  const disableButtons = isLoading || isGuest;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrorMessage('');
  };

  const handleJoinRoom = () => {
    if (name.trim()) {
      setName(name.trim());
      onJoin();
    } else {
      setErrorMessage(t('required_field'));
    }
  };

  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ height: '100%' }}
      >
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography
            variant="body2"
            style={{ fontWeight: 'bold', fontSize: '16px' }}
          >
            {t('joining_meeting')}
          </Typography>
        </div>
      </Grid>
    );
  } else {
    return (
      <>
        <Typography variant="h5" mb={1}>
          {t('join')} {roomName}
        </Typography>
        <Grid container justifyContent="center">
          <Grid item md={7} xs={12}>
            <Box sx={styles.localPreviewContainer}>
              <LocalVideoPreview identity={name} />
            </Box>
            <Box sx={styles.mobileButtonBar}>
              {isMdDown && (
                <>
                  <ToggleAudioButton
                    className={styles.mobileButton}
                    disabled={disableButtons}
                    fillColor={theme.palette.primary.main}
                    slashColor={theme.palette.primary.main}
                  />
                  <ToggleVideoButton
                    className={styles.mobileButton}
                    disabled={disableButtons}
                    fillColor={theme.palette.primary.main}
                    slashColor={theme.palette.primary.main}
                  />
                  <DeviceSettingsMenu className={styles.mobileButton} />
                </>
              )}
            </Box>
          </Grid>
          <Grid item md={5} xs={12}>
            <Grid
              container
              direction="column"
              justifyContent="space-between"
              style={{ alignItems: 'normal' }}
            >
              {isMdUp && (
                <Box>
                  <ToggleAudioButton
                    className={styles.deviceButton}
                    disabled={disableButtons}
                    fillColor={theme.palette.primary.main}
                    slashColor={theme.palette.primary.main}
                  />
                  <ToggleVideoButton
                    className={styles.deviceButton}
                    disabled={disableButtons}
                    fillColor={theme.palette.primary.main}
                    slashColor={theme.palette.primary.main}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            <InputLabel
              shrink
              htmlFor="input-user-name"
              sx={{ marginBottom: '-4px' }}
            >
              {t('your_name')}
            </InputLabel>
            <TextField
              id="input-user-name"
              variant="outlined"
              fullWidth
              value={name}
              error={!!errorMessage}
              onChange={handleNameChange}
              inputProps={{ maxLength: USER_NAME_MAX_LENGTH }}
            />
            {errorMessage && (
              <Typography color={'error'} sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}
            <Grid
              container
              direction="row"
              alignItems="center"
              style={{ marginTop: '1em' }}
            >
              {isMdUp && (
                <Grid item md={7} xs={12}>
                  <DeviceSettingsMenu />
                </Grid>
              )}
              <Grid item md={5} xs={12}>
                <Box sx={styles.joinButtons}>
                  <Button
                    variant="contained"
                    color="primary"
                    data-cy-join-now
                    onClick={handleJoinRoom}
                    disabled={isLoading}
                  >
                    {t('join_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
