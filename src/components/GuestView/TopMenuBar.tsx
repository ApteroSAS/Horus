import { useAppState } from '../../contexts/AppStateContext';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu';

const Container = styled(Grid)(({ theme }) => ({
  background: 'white',
  paddingLeft: '1em',
  paddingRight: '1em',
  display: 'flex',
  height: `${theme.mobileTopBarHeight}px`,
}));

const EndCallButtonStyled = styled(EndCallButton)(() => ({
  height: '28px',
  fontSize: '0.85rem',
  padding: '0 0.6em',
}));

export default function TopMenuBar() {
  const { roomName } = useAppState();

  return (
    <Container container justifyContent="space-between" alignItems="center">
      <Typography variant="subtitle1">{roomName}</Typography>
      <div>
        <EndCallButtonStyled />
        <Menu />
      </div>
    </Container>
  );
}
