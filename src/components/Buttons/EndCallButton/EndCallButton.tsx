import { Button, Theme } from '@mui/material';
import { styled } from '@mui/system';
import { useRTCScreenShareClient } from 'agora-rtc-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../../contexts/AppStateContext';
import useSelectedParticipant from '../../../hooks/useSelectedParticipant/useSelectedParticipant';

const StyledButton = styled(Button)(({ theme }: { theme?: Theme }) => ({
  background: theme?.brand,
  color: 'white',
  backgroundColor: '#f26750',
  '&:hover': {
    background: '#b84937',
  },
}));

export default function EndCallButton(props: { className?: string }) {
  const { setCalling, setDisableAutoJoin } = useAppState();
  const sharedClient = useRTCScreenShareClient();
  const { t } = useTranslation('common');
  const [selectedParticipant, setSelectedParticipant] =
    useSelectedParticipant();

  const handleDisconnect = () => {
    setCalling(false);
    setDisableAutoJoin(true);
    sharedClient && sharedClient.leave();
    selectedParticipant && setSelectedParticipant(null);
  };

  return (
    <StyledButton
      onClick={handleDisconnect}
      className={clsx(props.className)}
      data-cy-disconnect
    >
      {t('disconnect')}
    </StyledButton>
  );
}
