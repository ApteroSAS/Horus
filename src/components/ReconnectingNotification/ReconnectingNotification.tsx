import Snackbar from '../Snackbar/Snackbar';
import { useAppState } from '../../contexts/AppStateContext';

export default function ReconnectingNotification() {
  const { connectionState } = useAppState();

  return (
    <Snackbar
      variant="error"
      headline="Connection Lost:"
      message="Reconnecting to room..."
      open={connectionState === 'RECONNECTING'}
    />
  );
}
