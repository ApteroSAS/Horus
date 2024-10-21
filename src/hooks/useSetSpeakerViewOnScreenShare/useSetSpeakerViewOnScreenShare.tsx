import { IAgoraRTCRemoteUser, useCurrentUID } from 'agora-rtc-react';
import { useEffect, useRef } from 'react';
import { SHARE_SCREEN_NAME_SUFFIX } from '../../constants';

/**
 * This hook turns on speaker view when screensharing is active, regardless of if the
 * user was already using speaker view or gallery view. Once screensharing has ended, the user's
 * view will return to whatever they were using prior to screenshare starting.
 */
export function useSetSpeakerViewOnScreenShare(
  screenShareParticipant: IAgoraRTCRemoteUser | undefined,
  setIsGalleryViewActive: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >,
  isGalleryViewActive: boolean,
) {
  const uid = useCurrentUID();
  const isGalleryViewActiveRef = useRef(isGalleryViewActive);

  // Save the user's view setting whenever they change to speaker view or gallery view:
  useEffect(() => {
    isGalleryViewActiveRef.current = isGalleryViewActive;
  }, [isGalleryViewActive]);

  useEffect(() => {
    if (
      screenShareParticipant &&
      screenShareParticipant.uid
        .toString()
        .replace(SHARE_SCREEN_NAME_SUFFIX, '') !== uid?.toString()
    ) {
      // When screensharing starts, save the user's previous view setting (speaker or gallery):
      const prevIsGalleryViewActive = isGalleryViewActiveRef.current;
      // Turn off gallery view so that the user can see the screen that is being shared:
      setIsGalleryViewActive(false);
      return () => {
        // If the user was using gallery view prior to screensharing, turn gallery view back on
        // once screensharing stops:
        if (prevIsGalleryViewActive) {
          setIsGalleryViewActive(prevIsGalleryViewActive);
        }
      };
    }
  }, [screenShareParticipant, setIsGalleryViewActive, uid]);
}
