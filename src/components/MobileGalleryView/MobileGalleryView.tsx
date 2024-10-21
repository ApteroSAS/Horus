import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCurrentUID, useRTCClient } from 'agora-rtc-react';
import { CSSProperties } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import { GalleryViewParticipant } from '../GalleryView/usePagination/usePagination';
import { Participant } from '../Participant/Participant';
import { useParticipantContext } from '../../contexts/ParticipantContext';

const SwiperContainerStyled = styled('div')<{ remoteUserCount: number }>(
  ({ remoteUserCount, theme }) => ({
    background: theme.galleryViewBackgroundColor,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100%',
    '& .swiper': {
      height: '100%',
      '--swiper-pagination-bullet-inactive-color': 'white',
    },
    '& .swiper-wrapper': {
      height: '100%',
    },
    '& .swiper-pagination.swiper-pagination-bullets': {
      bottom: '5px',
    },
    ...(remoteUserCount > 5 && {
      '& .swiper-slide': {
        // To leave room for the pagination indicators:
        height: 'calc(100% - 21px)',
        paddingBottom: '21px',
      },
    }),
  }),
);

export function MobileGalleryView() {
  // Each page should have a max of 6 participants:
  const defaultParticipantsPerSlide = 6;

  const localUser = useRTCClient();
  const uid = useCurrentUID();

  const isMobileLandscape = useMediaQuery(
    'screen and (orientation: landscape)',
  );

  const { mobileGalleryViewParticipants } = useParticipantContext();

  const remoteUserCount = mobileGalleryViewParticipants.length;
  const pages: GalleryViewParticipant[][] = [[]];

  // Add the localParticipant to the front of the array to ensure they are always the first participant:
  pages[0].push(localUser);

  for (let i = 0; i < remoteUserCount; i++) {
    const pageNumber = Math.floor(i / defaultParticipantsPerSlide);
    if (!pages[pageNumber]) pages[pageNumber] = [];

    if (pages[pageNumber].length < defaultParticipantsPerSlide)
      pages[pageNumber].push(mobileGalleryViewParticipants[i]);
    else pages[pageNumber + 1] = [mobileGalleryViewParticipants[i]];
  }

  const portraitParticipantVideoStyles: CSSProperties = {
    width: remoteUserCount < 3 ? '100%' : '50%',
    // The height of each participant's video is determined by the number of participants on the gallery view
    // page. Here the array indices represent a remoteParticipantCount. If the count is 4 or greater,
    // the height will be 33.33%
    height: ['100%', '50%', '33.33%', '50%', '33.33%'][
      Math.min(remoteUserCount, 4)
    ],
    padding: '0.2em',
    boxSizing: 'border-box',
    fontSize: '16px',
  };

  const landscapeParticipantVideoStyles: CSSProperties = {
    height: remoteUserCount < 3 ? '100%' : '50%',
    width: ['100%', '50%', '33.33%', '50%', '33.33%'][
      Math.min(remoteUserCount, 4)
    ],
    padding: '0.2em 0.1em',
    boxSizing: 'border-box',
    fontSize: '16px',
  };

  const dominantSpeaker = useDominantSpeaker(true);

  return (
    <>
      <SwiperContainerStyled remoteUserCount={remoteUserCount}>
        <Swiper pagination={true} modules={[Pagination]}>
          {pages.map((page, i) => (
            <SwiperSlide
              key={i}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignSelf: 'center',
                alignContent: 'flex-start',
              }}
            >
              {page.map((user, index) => (
                <div
                  key={`${user.uid}-${index}`}
                  style={
                    isMobileLandscape
                      ? landscapeParticipantVideoStyles
                      : portraitParticipantVideoStyles
                  }
                >
                  <Participant
                    participant={user}
                    isLocalParticipant={user.uid === uid}
                    isDominantSpeaker={user.uid === dominantSpeaker}
                  />
                </div>
              ))}
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainerStyled>
    </>
  );
}
