import { IconButton, Pagination, Theme, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useCurrentUID, useRTCClient } from 'agora-rtc-react';
import { usePagination } from './usePagination/usePagination';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import useGalleryViewLayout from '../../hooks/useGalleryViewLayout/useGalleryViewLayout';
import {
  GALLERY_VIEW_ASPECT_RATIO,
  GALLERY_VIEW_MARGIN,
} from '../../constants';
import { useAppState } from '../../contexts/AppStateContext';
import { Participant } from '../Participant/Participant';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import { useParticipantContext } from '../../contexts/ParticipantContext';

const CONTAINER_GUTTER = '50px';

const ContainerStyled = styled('div')(({ theme }: { theme: Theme }) => ({
  background: theme.galleryViewBackgroundColor,
  position: 'relative',
  gridArea: '1 / 1 / 2 / 3',
}));

const PaginationContainerStyled = styled('div')(() => ({
  position: 'absolute',
  top: `calc(100% - ${CONTAINER_GUTTER})`,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const PaginationButtonStyled = styled(IconButton)(() => ({
  color: 'black',
  background: 'rgba(255, 255, 255, 0.8)',
  width: '40px',
  height: '40px',
  '&:hover': {
    background: 'rgba(255, 255, 255)',
  },
}));

const ParticipantContainerStyled = styled('div')(() => ({
  position: 'absolute',
  display: 'flex',
  top: CONTAINER_GUTTER,
  right: CONTAINER_GUTTER,
  bottom: CONTAINER_GUTTER,
  left: CONTAINER_GUTTER,
  margin: '0 auto',
  alignContent: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const ArrowLeftButtonStyled = styled('div')(() => ({
  right: `calc(100% - ${CONTAINER_GUTTER})`,
  left: 0,
  position: 'absolute',
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ArrowRightButtonStyled = styled('div')(() => ({
  right: 0,
  left: `calc(100% - ${CONTAINER_GUTTER})`,
  position: 'absolute',
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PaginationStyled = styled(Pagination)(() => ({
  '& .MuiPaginationItem-root': {
    color: 'white',
  },
}));

export const GalleryView = () => {
  const { maxGalleryViewParticipants } = useAppState();
  const uid = useCurrentUID();

  const localUser = useRTCClient();

  const { galleryViewParticipants } = useParticipantContext();

  const { currentPage, setCurrentPage, paginatedParticipants, totalPages } =
    usePagination([localUser, ...galleryViewParticipants]);

  const galleryViewLayoutParticipantCount =
    currentPage === 1
      ? paginatedParticipants.length
      : maxGalleryViewParticipants;

  const { containerRef, participantVideoWidth } = useGalleryViewLayout(
    galleryViewLayoutParticipantCount,
  );

  const participantFrameWidth = `${participantVideoWidth}px`;
  const participantFrameHeight = `${Math.floor(participantVideoWidth * GALLERY_VIEW_ASPECT_RATIO)}px`;

  const dominantSpeaker = useDominantSpeaker(true);
  const theme = useTheme();

  return (
    <>
      <ContainerStyled theme={theme}>
        <ArrowLeftButtonStyled>
          {!(currentPage === 1) && (
            <PaginationButtonStyled
              aria-label="previous page"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ArrowBack />
            </PaginationButtonStyled>
          )}
        </ArrowLeftButtonStyled>
        <ArrowRightButtonStyled>
          {!(currentPage === totalPages) && (
            <PaginationButtonStyled
              aria-label="next page"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ArrowForward />
            </PaginationButtonStyled>
          )}
        </ArrowRightButtonStyled>
        <PaginationContainerStyled>
          {totalPages > 1 && (
            <PaginationStyled
              page={currentPage}
              count={totalPages}
              onChange={(_, value) => setCurrentPage(value)}
              shape="rounded"
              color="primary"
              size="small"
              hideNextButton
              hidePrevButton
            />
          )}
        </PaginationContainerStyled>
        <ParticipantContainerStyled ref={containerRef}>
          {paginatedParticipants.map((participant, index) => (
            <div
              key={`${participant.uid}-${index}`}
              style={{
                width: participantFrameWidth,
                height: participantFrameHeight,
                margin: `${GALLERY_VIEW_MARGIN}px`,
              }}
            >
              <Participant
                participant={participant}
                isLocalParticipant={participant.uid === uid}
                isDominantSpeaker={participant.uid === dominantSpeaker}
              />
            </div>
          ))}
        </ParticipantContainerStyled>
      </ContainerStyled>
    </>
  );
};
