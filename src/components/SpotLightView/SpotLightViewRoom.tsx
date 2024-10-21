import { styled } from '@mui/material/styles';
import SpotLightViewScreen from './SpotLightViewScreen';

const Container = styled('div')(({ theme }) => {
  const totalMobileSidebarHeight = `${
    theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth
  }px`;

  return {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
    },
  };
});

export default function SpotLightViewRoom() {
  return (
    <Container>
      <SpotLightViewScreen />
    </Container>
  );
}
