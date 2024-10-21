import { Grid, Theme, Tooltip, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useAppState } from '../../contexts/AppStateContext';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu';

const Container = styled(Grid)(({ theme }) => ({
  background: 'white',
  paddingLeft: '1em',
  paddingRight: '1em',
  display: 'none',
  height: `52px`,
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));

const EndCallButtonStyled = styled(EndCallButton)(() => ({
  height: '28px',
  fontSize: '0.85rem',
  padding: '0 0.6em',
}));

const ShowMobile = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'initial',
  flexGrow: 1,
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

const Logo = styled('div')({
  width: '24px',
  height: '24px',
});

const RoomInfo = styled('div')({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
});

const RoomName = styled('span')({
  maxWidth: '120px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export default function MobileTopMenuBar() {
  const theme = useTheme();
  const { roomName } = useAppState();

  return (
    <Container
      container
      alignItems="center"
      justifyContent="space-between"
      theme={theme}
    >
      <RoomInfo>
        <ShowMobile theme={theme}>
          <Logo>
            <img src="/aptero.png" alt="logo" />
          </Logo>
        </ShowMobile>
        <Tooltip title={roomName}>
          <RoomName>
            <Typography>{roomName}</Typography>
          </RoomName>
        </Tooltip>
      </RoomInfo>
      <div>
        <EndCallButtonStyled />
        <Menu />
      </div>
    </Container>
  );
}
