import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { AgoraRTCReactError, IAgoraRTCError } from 'agora-rtc-react';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { PREVIOUSLY_JOINED_KEY } from '../../constants';

interface ErrorDialogProps {
  dismissError: () => void;
  error: AgoraRTCReactError | null;
}

function ErrorDialog({
  dismissError,
  error,
}: PropsWithChildren<ErrorDialogProps>) {
  const { message, rtcError } = error || {};
  const { t } = useTranslation('common');

  const code = getErrorCode(rtcError);

  return (
    <Dialog
      open={error !== null}
      onClose={() => dismissError()}
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle sx={{ textTransform: 'uppercase' }}>
        {t('error')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>{message}</DialogContentText>
        {rtcError && (
          <pre>
            <code>
              {t('error_code')}: {code}
            </code>
          </pre>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dismissError();
            localStorage.removeItem(PREVIOUSLY_JOINED_KEY);
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;

type RtcError = string | IAgoraRTCError | undefined;
function getErrorCode(rtcError: RtcError): string {
  if (!rtcError) return '';
  if (typeof rtcError === 'string') return rtcError;
  return rtcError.code;
}
